import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllListings = async (req, res) => {
  try {
    const { category, location, searchQuery } = req.query;
    
    const where = { status: 'ACTIVE' };
    
    if (category) where.category = category;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (searchQuery) {
      where.productName = { contains: searchQuery, mode: 'insensitive' };
    }
    
    const listings = await prisma.marketplaceListing.findMany({
      where,
      include: {
        farmer: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('✅ GET LISTINGS:', listings.length);
    res.json(listings);
  } catch (error) {
    console.error('❌ GET LISTINGS ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllFertilizers = async (req, res) => {
  try {
    const fertilizers = await prisma.fertilizer.findMany({
      include: {
        shop: {
          select: { id: true, name: true, ownerId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('✅ GET ALL FERTILIZERS:', fertilizers.length);
    res.json(fertilizers);
  } catch (error) {
    console.error('❌ GET FERTILIZERS ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createListing = async (req, res) => {
  try {
    const { productName, category, quantity, unit, pricePerUnit, description, location, imageUrl } = req.body;
    
    const listing = await prisma.marketplaceListing.create({
      data: {
        farmerId: req.user.id,
        productName,
        category,
        quantity: parseFloat(quantity),
        unit,
        pricePerUnit: parseFloat(pricePerUnit),
        totalPrice: parseFloat(quantity) * parseFloat(pricePerUnit),
        description: description || '',
        location,
        imageUrl: imageUrl || '',
        status: 'ACTIVE'
      }
    });
    
    console.log('✅ CREATED LISTING:', listing.id);
    res.status(201).json(listing);
  } catch (error) {
    console.error('❌ CREATE LISTING ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const listings = await prisma.marketplaceListing.findMany({
      where: { farmerId: req.user.id },
      include: {
        marketOrders: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('✅ GET MY LISTINGS:', listings.length);
    res.json(listings);
  } catch (error) {
    console.error('❌ GET MY LISTINGS ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, pricePerUnit, status, description } = req.body;
    
    // Check ownership
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: id }
    });
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    if (listing.farmerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }
    
    const updated = await prisma.marketplaceListing.update({
      where: { id: id },
      data: {
        ...(quantity && { quantity: parseFloat(quantity) }),
        ...(pricePerUnit && { pricePerUnit: parseFloat(pricePerUnit) }),
        ...(status && { status }),
        ...(description && { description }),
        ...(quantity && pricePerUnit && { totalPrice: parseFloat(quantity) * parseFloat(pricePerUnit) })
      }
    });
    
    console.log('✅ UPDATED LISTING:', id);
    res.json(updated);
  } catch (error) {
    console.error('❌ UPDATE LISTING ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ DELETE REQUEST for listing:', id);
    
    // Check if listing exists and belongs to user
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: id }
    });
    
    if (!listing) {
      console.log('❌ Listing not found:', id);
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    if (listing.farmerId !== req.user.id) {
      console.log('❌ Unauthorized delete attempt by user:', req.user.id);
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }
    
    // Delete the listing
    await prisma.marketplaceListing.delete({
      where: { id: id }
    });
    
    console.log('✅ DELETED LISTING:', id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('❌ DELETE LISTING ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

// CREATE order
export const createMarketOrder = async (req, res) => {
  try {
    const { listingId, quantity, deliveryAddress, notes } = req.body;
    
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: listingId }
    });
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Prevent self-purchase
    if (listing.farmerId === req.user.id) {
      return res.status(400).json({ error: 'You cannot buy your own listing!' });
    }
    
    if (listing.quantity < parseFloat(quantity)) {
      return res.status(400).json({ error: 'Insufficient quantity available' });
    }
    
    const order = await prisma.marketOrder.create({
      data: {
        listingId: listingId,
        buyerId: req.user.id,
        quantity: parseFloat(quantity),
        totalPrice: parseFloat(quantity) * listing.pricePerUnit,
        deliveryAddress,
        notes: notes || '',
        status: 'PENDING'
      }
    });
    
    // Update listing quantity
    await prisma.marketplaceListing.update({
      where: { id: listingId },
      data: { 
        quantity: listing.quantity - parseFloat(quantity),
        status: (listing.quantity - parseFloat(quantity)) === 0 ? 'SOLD' : 'ACTIVE'
      }
    });
    
    console.log('✅ CREATED ORDER:', order.id);
    res.status(201).json(order);
  } catch (error) {
    console.error('❌ CREATE ORDER ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET my orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.marketOrder.findMany({
      where: { buyerId: req.user.id },
      include: {
        listing: {
          include: {
            farmer: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('✅ GET MY ORDERS:', orders.length);
    res.json(orders);
  } catch (error) {
    console.error('❌ GET MY ORDERS ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await prisma.marketOrder.update({
      where: { id: id },
      data: { status }
    });
    
    console.log('✅ UPDATED ORDER STATUS:', id);
    res.json(order);
  } catch (error) {
    console.error('❌ UPDATE ORDER STATUS ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getMandiPrices = async (req, res) => {
  try {
    const { state, commodity } = req.query;
    const apiKey = process.env.DATA_GOV_API_KEY;

    // If API key is configured, fetch live data from Government Data Portal (APMC)
    if (apiKey) {
      let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=50`;
      
      if (state) url += `&filters[state.keyword]=${encodeURIComponent(state)}`;
      if (commodity) url += `&filters[commodity.keyword]=${encodeURIComponent(commodity)}`;

      const apiResponse = await fetch(url);
      const data = await apiResponse.json();

      if (data && data.records && data.records.length > 0) {
        const livePrices = data.records.map((record) => ({
          commodity: record.commodity || 'Unknown',
          variety: record.variety || 'Standard',
          market: record.market || 'Local Mandi',
          district: record.district || '',
          state: record.state || '',
          arrivalDate: record.arrival_date || new Date().toLocaleDateString(),
          minPrice: parseFloat(record.min_price) || 0,
          maxPrice: parseFloat(record.max_price) || 0,
          modalPrice: parseFloat(record.modal_price) || 0,
          priceUnit: 'quintal',
          trend: 'stable',
          change: '0.0'
        }));
        
        console.log(`✅ FETCHED ${livePrices.length} LIVE MANDI PRICES`);
        return res.json(livePrices);
      } else {
        console.warn('⚠️ No live APMC records found for filters, falling back to mock...');
      }
    } else {
      console.warn('⚠️ DATA_GOV_API_KEY not found in .env. Falling back to mock Mandi data.');
    }

    // Mock data fallback if API key missing or endpoint returns empty
    const mockPrices = [
      {
        commodity: 'Wheat',
        variety: 'Durum',
        market: 'Azadpur',
        district: 'New Delhi',
        state: 'Delhi',
        arrivalDate: new Date().toLocaleDateString(),
        minPrice: 2000,
        maxPrice: 2500,
        modalPrice: 2250,
        priceUnit: 'quintal',
        trend: 'up',
        change: '+2.5'
      },
      {
        commodity: 'Rice',
        variety: 'Basmati',
        market: 'Karnal',
        district: 'Karnal',
        state: 'Haryana',
        arrivalDate: new Date().toLocaleDateString(),
        minPrice: 3500,
        maxPrice: 4200,
        modalPrice: 3850,
        priceUnit: 'quintal',
        trend: 'stable',
        change: '0.0'
      },
      {
        commodity: 'Potato',
        variety: 'Local',
        market: 'Agra',
        district: 'Agra',
        state: 'Uttar Pradesh',
        arrivalDate: new Date().toLocaleDateString(),
        minPrice: 800,
        maxPrice: 1200,
        modalPrice: 1000,
        priceUnit: 'quintal',
        trend: 'down',
        change: '-3.2'
      }
    ];
    
    // Simple filter logic for mock data
    const filteredMock = mockPrices.filter(item => {
      let matches = true;
      if (state && item.state.toLowerCase() !== state.toLowerCase()) matches = false;
      if (commodity && item.commodity.toLowerCase() !== commodity.toLowerCase()) matches = false;
      return matches;
    });

    res.json(filteredMock);
  } catch (error) {
    console.error('❌ GET MANDI PRICES ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};
