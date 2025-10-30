import cv2
import numpy as np
from PIL import Image

class DiseaseDetector:
    def __init__(self):
        # Disease categories
        self.diseases = {
            'healthy': {
                'name': 'Healthy',
                'confidence': 0,
                'description': 'No disease detected',
                'treatment': 'Continue regular care'
            },
            'bacterial_blight': {
                'name': 'Bacterial Blight',
                'confidence': 0,
                'description': 'Bacterial infection causing leaf spots',
                'treatment': 'Apply copper-based bactericide'
            },
            'leaf_spot': {
                'name': 'Leaf Spot Disease',
                'confidence': 0,
                'description': 'Fungal infection with circular spots',
                'treatment': 'Use fungicide spray, remove infected leaves'
            },
            'rust': {
                'name': 'Rust Disease',
                'confidence': 0,
                'description': 'Orange/brown pustules on leaves',
                'treatment': 'Apply sulfur-based fungicide'
            },
            'powdery_mildew': {
                'name': 'Powdery Mildew',
                'confidence': 0,
                'description': 'White powdery coating on leaves',
                'treatment': 'Spray with neem oil or fungicide'
            }
        }
    
    def detect(self, image_path):
        """
        Detect plant diseases from image
        Returns: disease detection results
        """
        try:
            # Load image
            image = cv2.imread(image_path)
            
            if image is None:
                raise Exception("Failed to load image")
            
            # Analyze image for disease indicators
            analysis = self.analyze_disease_indicators(image)
            
            # Determine most likely disease
            detected_disease = self.classify_disease(analysis)
            
            return {
                'diseaseDetected': detected_disease['name'] != 'Healthy',
                'disease': detected_disease,
                'severity': self.calculate_severity(analysis),
                'recommendations': self.get_recommendations(detected_disease),
                'confidence': detected_disease['confidence']
            }
            
        except Exception as e:
            return {
                'diseaseDetected': False,
                'error': str(e),
                'disease': self.diseases['healthy']
            }
    
    def analyze_disease_indicators(self, image):
        """Analyze image for disease indicators"""
        # Convert to different color spaces
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Calculate color distribution
        color_hist = cv2.calcHist([hsv], [0], None, [180], [0, 180])
        
        # Detect spots and abnormalities
        spots = self.detect_spots(gray)
        
        # Calculate texture features
        texture = self.analyze_texture(gray)
        
        return {
            'color_distribution': color_hist,
            'spots_detected': spots,
            'texture_variance': texture,
            'brown_percentage': self.calculate_color_percentage(hsv, 'brown'),
            'yellow_percentage': self.calculate_color_percentage(hsv, 'yellow'),
            'white_percentage': self.calculate_color_percentage(hsv, 'white')
        }
    
    def detect_spots(self, gray_image):
        """Detect spots and abnormalities"""
        # Apply Gaussian blur
        blurred = cv2.GaussianBlur(gray_image, (5, 5), 0)
        
        # Threshold to detect dark spots
        _, thresh = cv2.threshold(blurred, 100, 255, cv2.THRESH_BINARY_INV)
        
        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Count significant spots
        significant_spots = len([c for c in contours if cv2.contourArea(c) > 50])
        
        return significant_spots
    
    def analyze_texture(self, gray_image):
        """Analyze texture variance"""
        # Calculate Laplacian variance (texture measure)
        laplacian = cv2.Laplacian(gray_image, cv2.CV_64F)
        variance = laplacian.var()
        return variance
    
    def calculate_color_percentage(self, hsv_image, color):
        """Calculate percentage of specific color in image"""
        color_ranges = {
            'brown': ([10, 50, 20], [20, 255, 200]),
            'yellow': ([20, 50, 50], [30, 255, 255]),
            'white': ([0, 0, 200], [180, 30, 255])
        }
        
        if color not in color_ranges:
            return 0
        
        lower, upper = color_ranges[color]
        mask = cv2.inRange(hsv_image, np.array(lower), np.array(upper))
        
        total_pixels = hsv_image.shape[0] * hsv_image.shape[1]
        color_pixels = cv2.countNonZero(mask)
        
        return (color_pixels / total_pixels) * 100
    
    def classify_disease(self, analysis):
        """Classify disease based on analysis"""
        # Simple rule-based classification
        # In production, use trained ML model
        
        brown_pct = analysis['brown_percentage']
        yellow_pct = analysis['yellow_percentage']
        white_pct = analysis['white_percentage']
        spots = analysis['spots_detected']
        
        # Rule-based detection
        if white_pct > 10:
            disease = self.diseases['powdery_mildew'].copy()
            disease['confidence'] = min(white_pct * 5, 95)
        elif brown_pct > 15 and spots > 10:
            disease = self.diseases['rust'].copy()
            disease['confidence'] = min((brown_pct + spots) * 2, 92)
        elif yellow_pct > 20 and spots > 5:
            disease = self.diseases['leaf_spot'].copy()
            disease['confidence'] = min((yellow_pct + spots) * 2, 88)
        elif spots > 20:
            disease = self.diseases['bacterial_blight'].copy()
            disease['confidence'] = min(spots * 3, 85)
        else:
            disease = self.diseases['healthy'].copy()
            disease['confidence'] = 95
        
        return disease
    
    def calculate_severity(self, analysis):
        """Calculate disease severity"""
        spots = analysis['spots_detected']
        abnormal_colors = (
            analysis['brown_percentage'] + 
            analysis['yellow_percentage'] + 
            analysis['white_percentage']
        )
        
        severity_score = (spots * 2 + abnormal_colors) / 3
        
        if severity_score < 10:
            return {'level': 'Low', 'score': severity_score, 'color': 'green'}
        elif severity_score < 25:
            return {'level': 'Moderate', 'score': severity_score, 'color': 'yellow'}
        elif severity_score < 40:
            return {'level': 'High', 'score': severity_score, 'color': 'orange'}
        else:
            return {'level': 'Severe', 'score': severity_score, 'color': 'red'}
    
    def get_recommendations(self, disease):
        """Get treatment recommendations"""
        recommendations = [disease['treatment']]
        
        if disease['name'] != 'Healthy':
            recommendations.extend([
                'Remove and destroy infected plant parts',
                'Improve air circulation around plants',
                'Avoid overhead watering',
                'Monitor plants regularly',
                'Consult agricultural expert if condition worsens'
            ])
        else:
            recommendations.extend([
                'Continue regular watering schedule',
                'Maintain proper nutrition',
                'Monitor for early signs of disease'
            ])
        
        return recommendations
