import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

/**
 * @desc    Get logged-in user's profile
 * @route   GET /profile/me
 * @access  Private
 */


export const getMyProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update logged-in user's profile
 * @route   PUT /profile/update
 * @access  Private
 */
export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone,role, address, bio } = req.body;

    let latitude = null;
    let longitude = null;

    // 🧭 Fetch latitude & longitude using LocationIQ if address is provided
    if (address) {
      try {
        const geoRes = await axios.get("https://us1.locationiq.com/v1/search.php", {
          params: {
            key: process.env.LOCATIONIQ_API_KEY,
            q: address,
            format: "json",
            limit: 1,
          },
        });

        if (geoRes.data.length > 0) {
          latitude = parseFloat(geoRes.data[0].lat);
          longitude = parseFloat(geoRes.data[0].lon);
        }
      } catch (err) {
        console.error("LocationIQ error:", err.response?.data || err.message);
      }
    }

    // 🧑‍💻 Update user's name if provided
    if (name) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { name },
      });
    }

    if(role){
      await prisma.user.update({
        where: { id: req.user.id },
        data: { role },
      });
    }

    // 🧱 Check if profile exists or create one
    let profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: req.user.id,
          phone,
          address,
          bio,
          latitude,
          longitude,
        },
      });
    } else {
      profile = await prisma.profile.update({
        where: { userId: req.user.id },
        data: { phone, address, bio, latitude, longitude },
      });
    }

    // 🔁 Fetch updated combined user with profile
    const updatedUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
