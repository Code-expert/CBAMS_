import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all experts
export const getExperts = async (req, res) => {
  try {
    const experts = await prisma.user.findMany({
      where: { role: 'EXPERT' },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {
            bio: true,
            specialty: true,
            experience: true,
            rating: true,
            phone: true
          }
        }
      }
    });

    res.json(experts);
  } catch (error) {
    console.error('Error fetching experts:', error);
    res.status(500).json({ message: 'Failed to fetch experts' });
  }
};

// Add expert (Admin/Registration flow)
export const addExpert = async (req, res) => {
  try {
    const { name, email, password, bio, specialty, experience } = req.body;
    
    // This would typically be part of registration
    // For now, just update existing user
    res.status(400).json({ message: 'Use registration flow to create experts' });
  } catch (error) {
    console.error('Error adding expert:', error);
    res.status(500).json({ message: 'Failed to add expert' });
  }
};

// Update expert profile
export const updateExpert = async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, specialty, experience, rating } = req.body;
    const userId = req.user.id;

    // Only the expert themselves can update their profile
    if (parseInt(id) !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const profile = await prisma.profile.upsert({
      where: { userId: parseInt(id) },
      update: {
        bio: bio || undefined,
        specialty: specialty || undefined,
        experience: experience || undefined,
        rating: rating || undefined
      },
      create: {
        userId: parseInt(id),
        bio,
        specialty,
        experience,
        rating
      }
    });

    res.json(profile);
  } catch (error) {
    console.error('Error updating expert:', error);
    res.status(500).json({ message: 'Failed to update expert' });
  }
};

// Remove expert (Admin only - just changes role)
export const removeExpert = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role: 'FARMER' }
    });

    res.json({ message: 'Expert role removed', user });
  } catch (error) {
    console.error('Error removing expert:', error);
    res.status(500).json({ message: 'Failed to remove expert' });
  }
};
