import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  ShoppingCart, 
  Plus, 
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  MapPin,
  Leaf,
  Store,
  AlertCircle,
  Edit,
  Trash2,
  X,
  Calendar,
  DollarSign,
  BarChart3,
  RefreshCw,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from '../utils/axiosConfig';
import { translations } from '../constants/languages';


const MarketplaceTab = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  const { user } = useSelector((state) => state.auth);
  
  const [marketType, setMarketType] = useState('produce');
  const [activeTab, setActiveTab] = useState('browse'); // browse, myListings, myOrders, mandiPrices
  
  // States
  const [produceListings, setProduceListings] = useState([]);
  const [myProduceListings, setMyProduceListings] = useState([]);
  const [myProduceOrders, setMyProduceOrders] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    searchQuery: ''
  });


  const [newListing, setNewListing] = useState({
    productName: '',
    category: 'Grain',
    quantity: '',
    unit: 'quintal',
    pricePerUnit: '',
    description: '',
    location: '',
    imageUrl: ''
  });


  const [orderData, setOrderData] = useState({
    quantity: '',
    deliveryAddress: '',
    notes: ''
  });


  const categories = ['Grain', 'Vegetable', 'Fruit', 'Pulses', 'Spices', 'Seeds', 'Other'];
  const units = ['kg', 'quintal', 'ton', 'piece', 'bunch'];
  const indianStates = ['Punjab', 'Haryana', 'Maharashtra', 'Gujarat', 'Uttar Pradesh', 'Madhya Pradesh'];


  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };


  useEffect(() => {
    if (activeTab === 'browse') {
      if (marketType === 'produce') {
        fetchProduceListings();
      } else {
        fetchFertilizers();
      }
    } else if (activeTab === 'myListings') {
      fetchMyProduceListings();
    } else if (activeTab === 'myOrders') {
      fetchMyProduceOrders();
    } else if (activeTab === 'mandiPrices') {
      fetchMandiPrices();
    }
  }, [activeTab, marketType, filters]);


  const fetchProduceListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.searchQuery) params.append('searchQuery', filters.searchQuery);
      
      const response = await axios.get(`/marketplace/listings?${params}`);
      setProduceListings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching produce:', error);
      setError('Failed to load listings');
      setProduceListings([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchMyProduceListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/marketplace/my-listings');
      setMyProduceListings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error:', error);
      setMyProduceListings([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchMyProduceOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/marketplace/my-orders');
      setMyProduceOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error:', error);
      setMyProduceOrders([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchMandiPrices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/marketplace/mandi-prices');
      setMandiPrices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error:', error);
      setMandiPrices([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchFertilizers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/seller/fertilizers');
      setFertilizers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error:', error);
      setFertilizers([]);
    } finally {
      setLoading(false);
    }
  };


  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('Image size should be less than 5MB', 'error');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  // Remove image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };


  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      
      // Upload image if exists
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        
        try {
          const uploadResponse = await axios.post('/upload/image', imageFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          imageUrl = uploadResponse.data.imageUrl;
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          // Continue without image if upload fails
        }
      }
      
      const listingData = {
        ...newListing,
        imageUrl: imageUrl || newListing.imageUrl
      };
      
      await axios.post('/marketplace/listings', listingData);
      
      setShowAddModal(false);
      setNewListing({
        productName: '',
        category: 'Grain',
        quantity: '',
        unit: 'quintal',
        pricePerUnit: '',
        description: '',
        location: '',
        imageUrl: ''
      });
      removeImage();
      fetchMyProduceListings();
      showToast('✅ Listing created successfully!', 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast('❌ Failed to create listing', 'error');
    }
  };


  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.delete(`/marketplace/listings/${id}`);
      fetchMyProduceListings();
      showToast('✅ Listing deleted', 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast('❌ Failed to delete listing', 'error');
    }
  };


  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/marketplace/orders', {
        listingId: selectedItem.id,
        ...orderData
      });
      setShowOrderModal(false);
      setOrderData({ quantity: '', deliveryAddress: '', notes: '' });
      showToast('✅ Order placed successfully!', 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast(`❌ ${error.response?.data?.error || 'Failed to place order'}`, 'error');
    }
  };


  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };


  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium flex items-center gap-3`}>
          {toast.type === 'success' ? '✅' : '❌'}
          {toast.message}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto font-bold">✕</button>
        </div>
      )}


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-gray-900">{t('marketplace')}</h2>
          <p className="text-gray-600 mt-2">Buy and sell agricultural products</p>
        </div>
        
        {user?.role === 'FARMER' && activeTab === 'myListings' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Listing
          </button>
        )}
      </div>


      {/* Market Type Switcher */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded-xl">
        <button
          onClick={() => setMarketType('produce')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            marketType === 'produce'
              ? 'bg-green-600 text-white shadow-lg'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Sprout className="w-5 h-5" />
          Farm Produce
        </button>
        <button
          onClick={() => setMarketType('fertilizers')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            marketType === 'fertilizers'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Leaf className="w-5 h-5" />
          Fertilizers
        </button>
      </div>


      {/* Tabs */}
      {marketType === 'produce' && (
        <div className="flex gap-4 border-b-2 border-gray-200">
          {['browse', 'myListings', 'myOrders', 'mandiPrices'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold transition-all ${
                activeTab === tab
                  ? 'text-green-600 border-b-4 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'browse' && '🛒 Browse'}
              {tab === 'myListings' && '📦 My Listings'}
              {tab === 'myOrders' && '🛍️ My Orders'}
              {tab === 'mandiPrices' && '📊 Market Prices'}
            </button>
          ))}
        </div>
      )}


      {/* Browse Tab */}
      {activeTab === 'browse' && marketType === 'produce' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={fetchProduceListings}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700"
              >
                Search
              </button>
            </div>
          </div>


          {/* Listings Grid */}
          {!loading && produceListings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No listings found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produceListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-green-300 transition-all">
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center relative overflow-hidden mb-4">
                    {listing.imageUrl ? (
                      <img 
                        src={listing.imageUrl} 
                        alt={listing.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Sprout className="w-16 h-16 text-green-600 opacity-50" />
                    )}
                    <span className="absolute top-3 right-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      {listing.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{listing.productName}</h3>
                  <p className="text-gray-600 text-sm mb-4">{listing.description || 'No description'}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="text-2xl font-black text-green-600">
                        ₹{listing.pricePerUnit}/{listing.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-bold">{listing.quantity} {listing.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{listing.location}</span>
                    </div>
                  </div>


                  <div className="border-t-2 pt-4 mb-4">
                    <p className="text-sm text-gray-600">Seller: <span className="font-bold">{listing.farmer?.name}</span></p>
                  </div>
                  
                  {listing.farmerId !== user.id ? (
                    <button
                      onClick={() => {
                        setSelectedItem(listing);
                        setShowOrderModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Buy Now
                    </button>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-bold text-center">
                      🌾 Your Listing
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}


      {/* My Listings Tab */}
      {activeTab === 'myListings' && (
        <div className="space-y-6">
          {myProduceListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      {listing.imageUrl ? (
                        <img src={listing.imageUrl} alt={listing.productName} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Sprout className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">{listing.productName}</h3>
                      <p className="text-gray-600">{listing.category} • {listing.quantity} {listing.unit} available</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                      <p className="text-xs text-gray-600">Price per {listing.unit}</p>
                      <p className="text-2xl font-black text-green-600">₹{listing.pricePerUnit}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-xs text-gray-600">Total Value</p>
                      <p className="text-2xl font-black text-blue-600">₹{listing.totalPrice}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                      <p className="text-xs text-gray-600">Orders</p>
                      <p className="text-2xl font-black text-purple-600">{listing.marketOrders?.length || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="p-3 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    listing.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {myProduceListings.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-2xl">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No listings yet</p>
            </div>
          )}
        </div>
      )}


      {/* Mandi Prices Tab */}
      {activeTab === 'mandiPrices' && (
        <div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black mb-2">📊 Live Mandi Prices</h3>
                <p className="text-green-100">Real-time market rates from government mandis</p>
              </div>
              <button
                onClick={fetchMandiPrices}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mandiPrices.map((price, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-black">{price.commodity}</h4>
                    <p className="text-sm text-gray-600">{price.variety}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    {getTrendIcon(price.trend)}
                  </div>
                </div>


                <div className="mb-4">
                  <div className="text-3xl font-black text-green-600 mb-1">
                    ₹{price.modalPrice}
                    <span className="text-sm text-gray-600">/{price.priceUnit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      parseFloat(price.change) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {price.change}%
                    </span>
                    <span className="text-xs text-gray-500">vs yesterday</span>
                  </div>
                </div>


                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between bg-gray-50 rounded-lg p-2">
                    <span className="text-gray-600">Min:</span>
                    <span className="font-bold">₹{price.minPrice}</span>
                  </div>
                  <div className="flex justify-between bg-gray-50 rounded-lg p-2">
                    <span className="text-gray-600">Max:</span>
                    <span className="font-bold">₹{price.maxPrice}</span>
                  </div>
                </div>


                <div className="border-t-2 pt-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{price.market}, {price.district}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Updated: {price.arrivalDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-green-600"></div>
        </div>
      )}


      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-3xl font-black mb-6">📦 List Your Produce</h3>
            <form onSubmit={handleCreateListing} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold mb-2">Product Image (Optional)</label>
                
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newListing.productName}
                    onChange={(e) => setNewListing({ ...newListing, productName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Category *</label>
                  <select
                    required
                    value={newListing.category}
                    onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Quantity *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={newListing.quantity}
                    onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Unit *</label>
                  <select
                    required
                    value={newListing.unit}
                    onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Price per Unit *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={newListing.pricePerUnit}
                    onChange={(e) => setNewListing({ ...newListing, pricePerUnit: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={newListing.location}
                    onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    removeImage();
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Order Modal */}
      {showOrderModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-3xl font-black mb-2">Place Order</h3>
            <p className="text-gray-600 mb-6">{selectedItem.productName}</p>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Quantity ({selectedItem.unit}) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  max={selectedItem.quantity}
                  value={orderData.quantity}
                  onChange={(e) => setOrderData({ ...orderData, quantity: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-600 mt-1">Available: {selectedItem.quantity} {selectedItem.unit}</p>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Delivery Address *</label>
                <textarea
                  required
                  value={orderData.deliveryAddress}
                  onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              {orderData.quantity && (
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                  <p className="text-sm text-gray-700 mb-1">Total Price</p>
                  <p className="text-3xl font-black text-green-600">
                    ₹{(parseFloat(orderData.quantity) * selectedItem.pricePerUnit).toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default MarketplaceTab;
