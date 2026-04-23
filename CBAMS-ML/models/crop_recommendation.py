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
        dataset_path = 'datasets/crop_recommendation.csv'
        
        if os.path.exists(dataset_path):
            print(f"📁 Loading dataset from {dataset_path}...")
            data = pd.read_csv(dataset_path)
        else:
            print("⚠️ No dataset file found. Generating initial dataset...")
            data = self.generate_mock_data()
            os.makedirs('datasets', exist_ok=True)
            data.to_csv(dataset_path, index=False)
            print(f"✅ Created new dataset file at {dataset_path}")
        
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
        """Generate realistic synthetic training data for 22 crops"""
        np.random.seed(42)
        n_samples_per_crop = 100
        
        crops = [
            'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
            'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
            'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 'apple',
            'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee'
        ]
        
        # Real-world approximate ranges for these crops
        # N, P, K, temp, hum, ph, rain
        crop_params = {
            'rice': [(60, 100), (35, 60), (35, 45), (20, 27), (80, 85), (6.0, 7.0), (200, 300)],
            'maize': [(60, 100), (35, 60), (15, 25), (18, 27), (55, 75), (5.5, 7.0), (60, 110)],
            'cotton': [(100, 140), (40, 60), (15, 25), (22, 28), (75, 85), (7.0, 8.5), (60, 100)],
            'coffee': [(80, 120), (15, 35), (25, 45), (23, 28), (50, 60), (6.0, 7.5), (140, 200)],
            'banana': [(80, 120), (70, 95), (45, 55), (25, 30), (75, 85), (5.5, 6.5), (90, 110)],
            # Simplified defaults for others to save space but maintain variety
        }
        
        rows = []
        for crop in crops:
            params = crop_params.get(crop, [(20, 120), (20, 120), (10, 200), (15, 35), (30, 90), (5.0, 8.5), (40, 250)])
            for _ in range(n_samples_per_crop):
                row = {
                    'N': np.random.uniform(*params[0]),
                    'P': np.random.uniform(*params[1]),
                    'K': np.random.uniform(*params[2]),
                    'temperature': np.random.uniform(*params[3]),
                    'humidity': np.random.uniform(*params[4]),
                    'ph': np.random.uniform(*params[5]),
                    'rainfall': np.random.uniform(*params[6]),
                    'label': crop
                }
                rows.append(row)
        
        return pd.DataFrame(rows)
    
    def predict(self, input_data):
        """Predict best crops for given conditions"""
        if self.model is None:
            raise Exception("Model not loaded")
        
        # Prepare features (ensure keys match frontend/backend)
        features = np.array([[
            float(input_data.get('nitrogen', 0)),
            float(input_data.get('phosphorus', 0)),
            float(input_data.get('potassium', 0)),
            float(input_data.get('temperature', 25)),
            float(input_data.get('humidity', 70)),
            float(input_data.get('ph', 6.5)),
            float(input_data.get('rainfall', 100))
        ]])
        
        # Get prediction probabilities
        probabilities = self.model.predict_proba(features)[0]
        classes = self.model.classes_
        
        # Sort by probability
        sorted_indices = np.argsort(probabilities)[::-1]
        
        recommendations = []
        for i in sorted_indices[:3]:  # Top 3 recommendations
            prob = probabilities[i]
            if prob > 0.05:  # Only include if probability > 5%
                crop_name = classes[i]
                recommendations.append({
                    'crop': crop_name.title(),
                    'suitability': round(prob * 100, 2),
                    'reason': self.get_suitability_reason(crop_name, input_data)
                })
        
        return recommendations
    
    def get_suitability_reason(self, crop, data):
        """Generate dynamic reason for crop suitability"""
        temp = float(data.get('temperature', 25))
        rain = float(data.get('rainfall', 100))
        
        reasons = {
            'rice': f"Optimal temperature ({temp}°C) and high rainfall ({rain}mm) are perfect for wetland rice cultivation.",
            'wheat': f"Temp ({temp}°C) is within the cool range required for wheat during its growing season.",
            'cotton': f"High temperature and moderate rainfall favor fiber development in cotton.",
            'sugarcane': f"Current conditions support the heavy water and nutrient requirements for sugarcane.",
            'maize': f"Well-distributed rainfall and warm temperatures are ideal for maize growth.",
            'banana': f"Constant high humidity and warm weather support tropical banana growth.",
            'coffee': f"Temperature and rainfall patterns match high-altitude coffee plantation needs."
        }
        return reasons.get(crop, f"Soil nutrient levels and weather conditions are favorable for {crop} cultivation.")
