import os
import sys

# Add the current directory and models directory to path
sys.path.append(os.getcwd())

from models.crop_recommendation import CropRecommendationModel
from models.yield_predictor import YieldPredictor

print("🚀 Initializing datasets and models...")

# This will trigger the train_model() method which now saves CSVs
recommender = CropRecommendationModel()
recommender.train_model()  # Force generate CSV and retrain

yield_predictor = YieldPredictor()
yield_predictor.train_model() # Force generate CSV and retrain

print("\n✨ Done! Check the 'datasets' folder for the new CSV files.")
