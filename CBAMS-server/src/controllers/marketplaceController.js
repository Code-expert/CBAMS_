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

// GET Mandi Prices (Mock data for now)
export const getMandiPrices = async (req, res) => {
  try {
    // Mock data - in production, fetch from real API
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
    
    res.json(mockPrices);
  } catch (error) {
    console.error('❌ GET MANDI PRICES ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};
