import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os

class PricePredictor:
    def __init__(self):
        # Simulated base prices for different crops (per Quintal/100kg)
        self.base_prices = {
            'Rice': 2200, 'Maize': 1900, 'Cotton': 6500,
            'Wheat': 2100, 'Soya': 4500, 'Tomato': 3000,
            'Potato': 1500, 'Onion': 2500, 'Sugarcane': 350
        }
        
    def predict_forecast(self, crop, current_date=None):
        """Predict price for the next 8 weeks for a given crop"""
        if current_date is None:
            current_date = datetime.now()
            
        base = self.base_prices.get(crop.title(), 2000)
        
        # Seasonality factor (sine wave)
        # Assuming peak prices every 12 months
        day_of_year = current_date.timetuple().tm_yday
        seasonal_peak = 180 # July peak (hypothetical)
        
        forecast = []
        for week in range(1, 9):
            future_date = current_date + timedelta(weeks=week)
            future_day = future_date.timetuple().tm_yday
            
            # Sine wave for seasonality
            seasonality = 1.0 + 0.15 * np.sin(2 * np.pi * (future_day - seasonal_peak) / 365)
            
            # Add some random market volatility (trend)
            volatility = 1.0 + np.random.uniform(-0.02, 0.05)
            
            price = round(base * seasonality * volatility, 2)
            
            forecast.append({
                'week': week,
                'date': future_date.strftime('%Y-%m-%d'),
                'price': price,
                'unit': 'INR/Quintal',
                'trend': 'Up' if price > base else 'Down'
            })
            
        return {
            'crop': crop.title(),
            'currentPrice': base,
            'forecast': forecast,
            'marketRecommendation': 'Sell' if forecast[-1]['price'] < base else 'Hold'
        }
        
    def predict_best_time_to_sell(self, crop):
        """Predict best time to sell in the next 3 months"""
        forecast = self.predict_forecast(crop)['forecast']
        best_week = max(forecast, key=lambda x: x['price'])
        
        return {
            'crop': crop.title(),
            'optimalSellDate': best_week['date'],
            'estimatedMaxPrice': best_week['price'],
            'profitMargin': round((best_week['price'] - self.base_prices.get(crop.title(), 2000)) / 100, 2)
        }
