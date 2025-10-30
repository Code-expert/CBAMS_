from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
from datetime import datetime
import os
from werkzeug.utils import secure_filename

# Import models
from models.crop_recommendation import CropRecommendationModel
from models.crop_health_analyzer import CropHealthAnalyzer
from models.disease_detector import DiseaseDetector

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('trained_models', exist_ok=True)

# Initialize models
print("🚀 Initializing ML models...")
crop_recommender = CropRecommendationModel()
health_analyzer = CropHealthAnalyzer()
disease_detector = DiseaseDetector()
print("✅ Models loaded successfully!")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ========== CROP RECOMMENDATION ==========
@app.route('/api/ml/crop-recommendation', methods=['POST'])
def recommend_crop():
    try:
        data = request.json
        recommendations = crop_recommender.predict(data)
        return jsonify({
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== CROP HEALTH ANALYSIS ==========
@app.route('/api/ml/analyze-crop-health', methods=['POST'])
def analyze_crop_health():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file'}), 400
        
        # Get metadata
        user_id = request.form.get('userId', 'unknown')
        crop_type = request.form.get('cropType', 'unknown')
        farm_id = request.form.get('farmId', 'default')
        
        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{user_id}_{farm_id}_{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        # Analyze
        analysis = health_analyzer.analyze_image(filepath, crop_type)
        
        return jsonify({
            'success': True,
            'analysis': analysis,
            'imageUrl': f'/uploads/{unique_filename}',
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== DISEASE DETECTION ==========
@app.route('/api/ml/detect-disease', methods=['POST'])
def detect_disease():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Save temporarily
        filename = secure_filename(file.filename)
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f'temp_{filename}')
        file.save(temp_path)
        
        # Detect
        detection = disease_detector.detect(temp_path)
        
        # Cleanup
        os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'detection': detection,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== HEALTH CHECK ==========
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'CBAMS ML Service',
        'timestamp': datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🌾 CBAMS ML Service Starting...")
    print("="*50)
    app.run(host='0.0.0.0', port=5001, debug=True)
