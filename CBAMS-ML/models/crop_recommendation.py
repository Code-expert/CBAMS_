import numpy as np
import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import os

class CropRecommendationModel:
    def __init__(self):
        self.model = None
        self.load_or_train_model()
    
    def load_or_train_model(self):
        """Load existing model or train new one"""
        model_path = 'trained_models/crop_model.pkl'
        
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            print("✅ Loaded existing crop recommendation model")
        else:
            print("⚠️ No model found. Training new model...")
            self.train_model()
    
    def train_model(self):
        """Train crop recommendation model"""
        # Load dataset (you'll need to provide this CSV)
        # For now, using mock data
        data = self.generate_mock_data()
        
        X = data.drop('label', axis=1)
        y = data['label']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        accuracy = self.model.score(X_test, y_test)
        print(f"✅ Model trained with accuracy: {accuracy * 100:.2f}%")
        
        # Save model
        os.makedirs('trained_models', exist_ok=True)
        with open('trained_models/crop_model.pkl', 'wb') as f:
            pickle.dump(self.model, f)
    
    def generate_mock_data(self):
        """Generate mock training data"""
        # Columns: N, P, K, temperature, humidity, ph, rainfall, label
        np.random.seed(42)
        n_samples = 2000
        
        data = {
            'N': np.random.uniform(0, 140, n_samples),
            'P': np.random.uniform(5, 145, n_samples),
            'K': np.random.uniform(5, 205, n_samples),
            'temperature': np.random.uniform(8, 43, n_samples),
            'humidity': np.random.uniform(14, 100, n_samples),
            'ph': np.random.uniform(3.5, 9.5, n_samples),
            'rainfall': np.random.uniform(20, 300, n_samples),
            'label': np.random.choice(['rice', 'wheat', 'cotton', 'sugarcane', 
                                      'maize', 'tomato', 'potato'], n_samples)
        }
        
        return pd.DataFrame(data)
    
    def predict(self, input_data):
        """Predict best crops for given conditions"""
        if self.model is None:
            raise Exception("Model not loaded")
        
        # Prepare features
        features = np.array([[
            input_data['nitrogen'],
            input_data['phosphorus'],
            input_data['potassium'],
            input_data['temperature'],
            input_data['humidity'],
            input_data['ph'],
            input_data['rainfall']
        ]])
        
        # Get prediction probabilities
        probabilities = self.model.predict_proba(features)[0]
        classes = self.model.classes_
        
        # Sort by probability
        sorted_indices = np.argsort(probabilities)[::-1]
        
        recommendations = []
        for i in sorted_indices[:3]:  # Top 3 recommendations
            recommendations.append({
                'crop': classes[i].title(),
                'suitability': round(probabilities[i] * 100, 2),
                'reason': self.get_suitability_reason(
                    classes[i], input_data
                )
            })
        
        return recommendations
    
    def get_suitability_reason(self, crop, data):
        """Generate reason for crop suitability"""
        reasons = {
            'rice': f"Suitable temperature ({data['temperature']}°C) and high rainfall ({data['rainfall']}mm)",
            'wheat': f"Good temperature range and moderate rainfall",
            'cotton': f"High temperature ({data['temperature']}°C) ideal for cotton",
            'sugarcane': f"High humidity ({data['humidity']}%) and rainfall favorable",
            'maize': f"Balanced NPK levels and good weather conditions",
            'tomato': f"pH level ({data['ph']}) and temperature suitable",
            'potato': f"Cool temperature and moderate humidity ideal"
        }
        return reasons.get(crop, "Suitable growing conditions")
