import axios from 'axios';

class MandiPriceService {
  constructor() {
    // India Government Open Data Platform API
    this.baseUrl = 'https://api.data.gov.in/resource';
    this.apiKey = process.env.DATA_GOV_API_KEY; // Get from https://data.gov.in
    
    // Alternative: Use AGMARKNET data
    this.agmarknetUrl = 'https://agmarknet.gov.in/api';
  }

  /**
   * Fetch live mandi prices by location and commodity
   */
  async getMandiPrices({ state, district, commodity, limit = 10 }) {
    try {
      const params = {
        'api-key': this.apiKey,
        format: 'json',
        limit: limit,
        ...(state && { 'filters[State]': state }),
        ...(district && { 'filters[District]': district }),
        ...(commodity && { 'filters[Commodity]': commodity })
      };

      const response = await axios.get(
        `${this.baseUrl}/9ef84268-d588-465a-a308-a864a43d0070`,
        { params }
      );

      return this.formatMandiData(response.data.records);
    } catch (error) {
      console.error('Error fetching mandi prices:', error);
      // Fallback to cached/static data
      return this.getFallbackPrices({ state, district, commodity });
    }
  }

  /**
   * Get price trends for a commodity over time
   */
  async getPriceTrends({ commodity, state, days = 30 }) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const params = {
        'api-key': this.apiKey,
        format: 'json',
        'filters[Commodity]': commodity,
        'filters[State]': state,
        'filters[Arrival_Date][>=]': startDate.toISOString().split('T')[0],
        'filters[Arrival_Date][<=]': endDate.toISOString().split('T')[0]
      };

      const response = await axios.get(
        `${this.baseUrl}/9ef84268-d588-465a-a308-a864a43d0070`,
        { params }
      );

      return this.calculateTrends(response.data.records);
    } catch (error) {
      console.error('Error fetching price trends:', error);
      return [];
    }
  }

  /**
   * Get nearby mandis based on user's location
   */
  async getNearbyMandis({ latitude, longitude, radius = 50 }) {
    try {
      // This would use geolocation to find nearby mandis
      // For now, we'll use state/district matching
      const userLocation = await this.reverseGeocode(latitude, longitude);
      
      return await this.getMandiPrices({
        state: userLocation.state,
        district: userLocation.district
      });
    } catch (error) {
      console.error('Error finding nearby mandis:', error);
      return [];
    }
  }

  /**
   * Format mandi data to standard structure
   */
  formatMandiData(records) {
    return records.map(record => ({
      commodity: record.commodity,
      variety: record.variety,
      market: record.market,
      district: record.district,
      state: record.state,
      minPrice: parseFloat(record.min_price) || 0,
      maxPrice: parseFloat(record.max_price) || 0,
      modalPrice: parseFloat(record.modal_price) || 0, // Most common price
      arrivalDate: record.arrival_date,
      priceUnit: 'quintal', // Standard Indian agricultural unit
      change: this.calculatePriceChange(record),
      trend: this.determineTrend(record)
    }));
  }

  /**
   * Calculate price change percentage
   */
  calculatePriceChange(record) {
    // Compare with previous day's modal price (you'd need historical data)
    // For now, random mock change
    return (Math.random() * 10 - 5).toFixed(2); // -5% to +5%
  }

  /**
   * Determine price trend (up/down/stable)
   */
  determineTrend(record) {
    const change = parseFloat(this.calculatePriceChange(record));
    if (change > 1) return 'up';
    if (change < -1) return 'down';
    return 'stable';
  }

  /**
   * Calculate price trends over time
   */
  calculateTrends(records) {
    const dailyPrices = {};
    
    records.forEach(record => {
      const date = record.arrival_date;
      if (!dailyPrices[date]) {
        dailyPrices[date] = {
          date,
          avgPrice: 0,
          count: 0
        };
      }
      dailyPrices[date].avgPrice += parseFloat(record.modal_price);
      dailyPrices[date].count++;
    });

    return Object.values(dailyPrices).map(day => ({
      date: day.date,
      price: (day.avgPrice / day.count).toFixed(2)
    }));
  }

  /**
   * Reverse geocode coordinates to location
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      
      return {
        state: response.data.address.state,
        district: response.data.address.county || response.data.address.city,
        city: response.data.address.city || response.data.address.town
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return { state: 'Unknown', district: 'Unknown', city: 'Unknown' };
    }
  }

  /**
   * Fallback prices when API is unavailable
   */
  getFallbackPrices({ state, district, commodity }) {
    const fallbackData = [
      { commodity: 'Wheat', state: 'Punjab', district: 'Amritsar', modalPrice: 2100, minPrice: 2050, maxPrice: 2150, trend: 'up', change: '+2.5' },
      { commodity: 'Rice', state: 'Haryana', district: 'Karnal', modalPrice: 3200, minPrice: 3100, maxPrice: 3300, trend: 'down', change: '-1.2' },
      { commodity: 'Tomato', state: 'Maharashtra', district: 'Pune', modalPrice: 25, minPrice: 20, maxPrice: 30, trend: 'up', change: '+5.8' },
      { commodity: 'Onion', state: 'Maharashtra', district: 'Nashik', modalPrice: 18, minPrice: 15, maxPrice: 22, trend: 'up', change: '+3.1' },
      { commodity: 'Cotton', state: 'Gujarat', district: 'Ahmedabad', modalPrice: 5800, minPrice: 5700, maxPrice: 5900, trend: 'down', change: '-0.5' }
    ];

    let filtered = fallbackData;
    if (state) filtered = filtered.filter(item => item.state === state);
    if (district) filtered = filtered.filter(item => item.district === district);
    if (commodity) filtered = filtered.filter(item => item.commodity === commodity);

    return filtered.map(item => ({
      ...item,
      market: `${item.district} Mandi`,
      variety: 'General',
      arrivalDate: new Date().toISOString().split('T')[0],
      priceUnit: item.commodity === 'Tomato' || item.commodity === 'Onion' ? 'kg' : 'quintal'
    }));
  }

  /**
   * Get popular commodities in a region
   */
  async getPopularCommodities(state) {
    const commodities = {
      'Punjab': ['Wheat', 'Rice', 'Cotton', 'Maize'],
      'Haryana': ['Wheat', 'Rice', 'Mustard', 'Bajra'],
      'Maharashtra': ['Cotton', 'Soybean', 'Onion', 'Tomato'],
      'Gujarat': ['Cotton', 'Groundnut', 'Wheat', 'Bajra'],
      'Uttar Pradesh': ['Wheat', 'Rice', 'Sugarcane', 'Potato'],
      'Madhya Pradesh': ['Wheat', 'Soybean', 'Chickpea', 'Maize'],
      'Karnataka': ['Rice', 'Cotton', 'Maize', 'Ragi'],
      'Andhra Pradesh': ['Rice', 'Cotton', 'Chilli', 'Turmeric']
    };

    return commodities[state] || ['Wheat', 'Rice', 'Cotton', 'Vegetables'];
  }
}

export default new MandiPriceService();
