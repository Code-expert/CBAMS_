from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load or create ML models
def get_yield_model():
    """Crop yield prediction model"""
    try:
        model = joblib.load('models/yield_model.pkl')
        scaler = joblib.load('models/yield_scaler.pkl')
    except:
        # Create and train a simple model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        scaler = StandardScaler()
        
        # Mock training data
        X_train = np.random.rand(1000, 6)  # Features: area, rainfall, temp, humidity, ph, fertilizer
        y_train = X_train[:, 0] * 50 + X_train[:, 1] * 30 + np.random.rand(1000) * 10
        
        X_scaled = scaler.fit_transform(X_train)
        model.fit(X_scaled, y_train)
        
        # Save models
        os.makedirs('models', exist_ok=True)
        joblib.dump(model, 'models/yield_model.pkl')
        joblib.dump(scaler, 'models/yield_scaler.pkl')
    
    return model, scaler


def get_price_model():
    """Price forecasting model"""
    try:
        model = joblib.load('models/price_model.pkl')
    except:
        model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        
        # Mock training
        X_train = np.random.rand(500, 5)  # Features: month, supply, demand, weather, market_index
        y_train = X_train[:, 1] * 1000 + X_train[:, 2] * 500 + np.random.rand(500) * 100
        
        model.fit(X_train, y_train)
        joblib.dump(model, 'models/price_model.pkl')
    
    return model


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'ML Analytics'})


@app.route('/predict/yield', methods=['POST'])
def predict_yield():
    """
    Predict crop yield based on farm conditions
    Input: {
        "crop": "wheat",
        "area": 10.5,
        "rainfall": 800,
        "temperature": 25,
        "humidity": 70,
        "ph": 6.5,
        "fertilizer": 150
    }
    """
    try:
        data = request.json
        
        # Extract features
        features = np.array([[
            data.get('area', 10),
            data.get('rainfall', 800),
            data.get('temperature', 25),
            data.get('humidity', 70),
            data.get('ph', 6.5),
            data.get('fertilizer', 150)
        ]])
        
        model, scaler = get_yield_model()
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        
        # Calculate confidence and recommendations
        confidence = min(95, 75 + np.random.rand() * 20)
        
        recommendations = []
        if data.get('ph', 6.5) < 6:
            recommendations.append("Increase soil pH using lime")
        if data.get('rainfall', 800) < 600:
            recommendations.append("Consider irrigation - rainfall is low")
        if data.get('fertilizer', 150) < 100:
            recommendations.append("Increase fertilizer application")
        
        return jsonify({
            'predicted_yield': round(prediction, 2),
            'unit': 'quintals/hectare',
            'confidence': round(confidence, 1),
            'crop': data.get('crop', 'wheat'),
            'recommendations': recommendations,
            'factors': {
                'rainfall_impact': 'high' if data.get('rainfall', 800) > 700 else 'medium',
                'temperature_impact': 'optimal' if 20 <= data.get('temperature', 25) <= 30 else 'suboptimal',
                'soil_health': 'good' if 6 <= data.get('ph', 6.5) <= 7.5 else 'needs_attention'
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict/price', methods=['POST'])
def predict_price():
    """
    Forecast crop price for next 3 months
    Input: {
        "crop": "wheat",
        "current_price": 2500,
        "supply_index": 75,
        "demand_index": 85,
        "weather_index": 70
    }
    """
    try:
        data = request.json
        model = get_price_model()
        
        current_price = data.get('current_price', 2500)
        
        # Predict for next 3 months
        predictions = []
        for month in range(1, 4):
            features = np.array([[
                month,
                data.get('supply_index', 75) + np.random.randint(-5, 5),
                data.get('demand_index', 85) + np.random.randint(-5, 5),
                data.get('weather_index', 70) + np.random.randint(-10, 10),
                current_price / 1000
            ]])
            
            pred = model.predict(features)[0]
            predictions.append({
                'month': month,
                'predicted_price': round(pred, 2),
                'change_percentage': round(((pred - current_price) / current_price) * 100, 2),
                'trend': 'up' if pred > current_price else 'down'
            })
        
        return jsonify({
            'crop': data.get('crop', 'wheat'),
            'current_price': current_price,
            'forecasts': predictions,
            'recommendation': 'Hold stock - prices expected to rise' if predictions[-1]['predicted_price'] > current_price else 'Sell now - prices may fall'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/analyze/soil', methods=['POST'])
def analyze_soil():
    """
    Analyze soil health and provide recommendations
    Input: {
        "ph": 6.5,
        "nitrogen": 250,
        "phosphorus": 40,
        "potassium": 200,
        "organic_carbon": 0.8,
        "moisture": 25
    }
    """
    try:
        data = request.json
        
        ph = data.get('ph', 6.5)
        n = data.get('nitrogen', 250)
        p = data.get('phosphorus', 40)
        k = data.get('potassium', 200)
        oc = data.get('organic_carbon', 0.8)
        moisture = data.get('moisture', 25)
        
        # Calculate health score
        ph_score = 100 if 6 <= ph <= 7.5 else max(0, 100 - abs(ph - 6.5) * 20)
        npk_score = min(100, (n/300 + p/50 + k/250) * 33.33)
        oc_score = min(100, oc * 100)
        moisture_score = 100 if 20 <= moisture <= 30 else max(0, 100 - abs(moisture - 25) * 4)
        
        overall_score = (ph_score + npk_score + oc_score + moisture_score) / 4
        
        # Generate recommendations
        recommendations = []
        if ph < 6:
            recommendations.append({'type': 'pH', 'action': 'Add lime to increase pH', 'priority': 'high'})
        elif ph > 7.5:
            recommendations.append({'type': 'pH', 'action': 'Add sulfur to decrease pH', 'priority': 'high'})
        
        if n < 200:
            recommendations.append({'type': 'Nitrogen', 'action': 'Apply urea or compost', 'priority': 'medium'})
        if p < 30:
            recommendations.append({'type': 'Phosphorus', 'action': 'Add phosphate fertilizer', 'priority': 'medium'})
        if k < 150:
            recommendations.append({'type': 'Potassium', 'action': 'Apply potash', 'priority': 'medium'})
        
        if oc < 0.5:
            recommendations.append({'type': 'Organic Matter', 'action': 'Increase organic content with compost', 'priority': 'high'})
        
        return jsonify({
            'overall_health_score': round(overall_score, 1),
            'status': 'excellent' if overall_score > 80 else 'good' if overall_score > 60 else 'needs_improvement',
            'component_scores': {
                'ph': round(ph_score, 1),
                'nutrients': round(npk_score, 1),
                'organic_carbon': round(oc_score, 1),
                'moisture': round(moisture_score, 1)
            },
            'recommendations': recommendations,
            'suitable_crops': get_suitable_crops(ph, n, p, k)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_suitable_crops(ph, n, p, k):
    """Recommend crops based on soil parameters"""
    crops = []
    
    if 6 <= ph <= 7 and n > 200:
        crops.append({'name': 'Wheat', 'suitability': 'high'})
        crops.append({'name': 'Rice', 'suitability': 'high'})
    
    if 6.5 <= ph <= 7.5 and p > 30:
        crops.append({'name': 'Corn', 'suitability': 'high'})
    
    if 5.5 <= ph <= 6.5:
        crops.append({'name': 'Potato', 'suitability': 'medium'})
        crops.append({'name': 'Tea', 'suitability': 'high'})
    
    if k > 180:
        crops.append({'name': 'Cotton', 'suitability': 'high'})
        crops.append({'name': 'Sugarcane', 'suitability': 'medium'})
    
    return crops[:5]  # Return top 5


@app.route('/optimize/resources', methods=['POST'])
def optimize_resources():
    """
    Optimize water and fertilizer usage
    Input: {
        "crop": "wheat",
        "area": 10,
        "soil_type": "loamy",
        "current_moisture": 25,
        "growth_stage": "vegetative"
    }
    """
    try:
        data = request.json
        
        area = data.get('area', 10)
        crop = data.get('crop', 'wheat')
        moisture = data.get('current_moisture', 25)
        stage = data.get('growth_stage', 'vegetative')
        
        # Water optimization
        if moisture < 20:
            water_needed = area * 50  # liters per hectare
            water_priority = 'high'
        elif moisture < 25:
            water_needed = area * 30
            water_priority = 'medium'
        else:
            water_needed = area * 15
            water_priority = 'low'
        
        # Fertilizer optimization
        if stage == 'vegetative':
            fertilizer = {'N': area * 120, 'P': area * 60, 'K': area * 40}
        elif stage == 'flowering':
            fertilizer = {'N': area * 80, 'P': area * 100, 'K': area * 60}
        else:  # fruiting
            fertilizer = {'N': area * 60, 'P': area * 80, 'K': area * 100}
        
        return jsonify({
            'crop': crop,
            'area': area,
            'water_optimization': {
                'daily_requirement': round(water_needed, 2),
                'unit': 'liters',
                'priority': water_priority,
                'irrigation_schedule': 'Morning and evening' if water_priority == 'high' else 'Once daily'
            },
            'fertilizer_optimization': {
                'nitrogen': round(fertilizer['N'], 2),
                'phosphorus': round(fertilizer['P'], 2),
                'potassium': round(fertilizer['K'], 2),
                'unit': 'kg',
                'application_method': 'Split application recommended'
            },
            'cost_savings': {
                'water': round(water_needed * 0.02, 2),
                'fertilizer': round(sum(fertilizer.values()) * 0.5, 2),
                'total': round(water_needed * 0.02 + sum(fertilizer.values()) * 0.5, 2),
                'currency': 'INR'
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
