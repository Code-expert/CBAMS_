import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect as auth } from '../middlewares/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all community posts
router.get('/', async (req, res) => {
    try {
        const posts = await prisma.communityPost.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profile: {
                            select: {
                                address: true,
                                bio: true,
                                specialty: true
                            }
                        }
                    }
                }
            }
        });

        // Format for frontend
        const formattedPosts = posts.map(post => ({
            id: post.id,
            content: post.content,
            category: post.category,
            tags: post.tags ? JSON.parse(post.tags) : [],
            imageUrl: post.imageUrl,
            timestamp: post.createdAt,
            likes: post.likes,
            comments: post.comments,
            shares: post.shares,
            author: {
                id: post.author.id,
                name: post.author.name,
                avatar: '👨‍🌾', // Fallback avatar
                location: post.author.profile?.address || 'India',
                verified: !!post.author.profile?.specialty
            }
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error('Error fetching community posts:', error);
        res.status(500).json({ error: 'Failed to fully load community posts' });
    }
});

// Create a new post
router.post('/', auth, async (req, res) => {
    try {
        const { content, category, tags, imageUrl } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Post content is required' });
        }

        const newPost = await prisma.communityPost.create({
            data: {
                content,
                category: category || 'General',
                tags: tags ? JSON.stringify(tags) : '[]',
                imageUrl,
                authorId: req.user.id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profile: true
                    }
                }
            }
        });

        const formattedPost = {
            id: newPost.id,
            content: newPost.content,
            category: newPost.category,
            tags: newPost.tags ? JSON.parse(newPost.tags) : [],
            imageUrl: newPost.imageUrl,
            timestamp: newPost.createdAt,
            likes: newPost.likes,
            comments: newPost.comments,
            shares: newPost.shares,
            author: {
                id: newPost.author.id,
                name: newPost.author.name,
                avatar: '👨‍🌾',
                location: newPost.author.profile?.address || 'India',
                verified: !!newPost.author.profile?.specialty
            }
        };

        res.status(201).json(formattedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Like a post
router.post('/:id/like', auth, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = await prisma.communityPost.update({
            where: { id: postId },
            data: {
                likes: {
                    increment: 1
                }
            }
        });
        res.json({ message: 'Post liked', likes: post.likes });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
});

export default router;
