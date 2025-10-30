import cv2
import numpy as np
from PIL import Image
import os

class CropHealthAnalyzer:
    def __init__(self):
        self.color_ranges = {
            'healthy': ([40, 40, 40], [80, 255, 255]),  # Green HSV
            'stressed': ([20, 40, 40], [40, 255, 255]),  # Yellow HSV
            'diseased': ([0, 40, 40], [20, 255, 255])    # Red/Brown HSV
        }
    
    def analyze_image(self, image_path, crop_type='unknown'):
        """Analyze crop health from image"""
        # Load image
        image = cv2.imread(image_path)
        
        if image is None:
            raise Exception("Failed to load image")
        
        # Convert to HSV
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Calculate color percentages
        health_metrics = self.calculate_health_metrics(hsv)
        
        # Overall health score
        health_score = (
            health_metrics['healthy_percent'] * 1.0 +
            health_metrics['stressed_percent'] * 0.5 +
            health_metrics['diseased_percent'] * 0.0
        )
        
        # Determine health status
        if health_score >= 75:
            status = 'Excellent'
            color = 'green'
        elif health_score >= 60:
            status = 'Good'
            color = 'lightgreen'
        elif health_score >= 40:
            status = 'Fair'
            color = 'yellow'
        else:
            status = 'Poor'
            color = 'red'
        
        # Generate recommendations
        recommendations = self.generate_recommendations(health_metrics, crop_type)
        
        return {
            'healthScore': round(health_score, 2),
            'status': status,
            'color': color,
            'metrics': health_metrics,
            'recommendations': recommendations,
            'cropType': crop_type
        }
    
    def calculate_health_metrics(self, hsv_image):
        """Calculate percentage of healthy, stressed, and diseased areas"""
        total_pixels = hsv_image.shape[0] * hsv_image.shape[1]
        
        metrics = {}
        for category, (lower, upper) in self.color_ranges.items():
            mask = cv2.inRange(hsv_image, np.array(lower), np.array(upper))
            pixels = cv2.countNonZero(mask)
            percentage = (pixels / total_pixels) * 100
            metrics[f'{category}_percent'] = round(percentage, 2)
        
        return metrics
    
    def generate_recommendations(self, metrics, crop_type):
        """Generate recommendations based on health metrics"""
        recommendations = []
        
        if metrics['healthy_percent'] < 50:
            recommendations.append("⚠️ Low vegetation cover detected")
            recommendations.append("💧 Increase irrigation frequency")
        
        if metrics['stressed_percent'] > 20:
            recommendations.append("⚠️ Water stress detected")
            recommendations.append("🌱 Apply balanced NPK fertilizer")
        
        if metrics['diseased_percent'] > 10:
            recommendations.append("🔴 Possible disease detected")
            recommendations.append("🧪 Apply fungicide treatment")
            recommendations.append("👨‍🌾 Consult agricultural expert")
        
        if not recommendations:
            recommendations.append("✅ Crop health is optimal")
            recommendations.append("🌾 Continue current farming practices")
        
        return recommendations
