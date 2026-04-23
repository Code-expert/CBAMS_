import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Send, 
  Image as ImageIcon,
  TrendingUp,
  Award,
  ThumbsUp,
  Share2,
  Bookmark,
  MoreVertical,
  Search,
  Filter,
  Plus,
  Sprout,
  Tractor,
  Droplet,
  Sun
} from 'lucide-react';
import axios from '../../utils/axiosConfig';

const Community = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [filter, setFilter] = useState('all'); // all, trending, following
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Replace with real API calls
  const mockPosts = [
    {
      id: 'mock-1',
      author: {
        name: 'Rajesh Kumar',
        avatar: '👨‍🌾',
        location: 'Punjab',
        verified: true
      },
      content: 'Just harvested my wheat crop! Yield this year is 20% better than last season. Switching to organic fertilizers really made a difference. 🌾',
      image: null,
      timestamp: '2 hours ago',
      likes: 45,
      comments: 12,
      shares: 5,
      category: 'Success Story',
      tags: ['wheat', 'organic', 'harvest']
    },
    {
      id: 'mock-2',
      author: {
        name: 'Priya Sharma',
        avatar: '👩‍🌾',
        location: 'Maharashtra',
        verified: true
      },
      content: 'Looking for advice on pest control for tomato plants. Has anyone tried neem oil? Would love to hear your experiences!',
      image: null,
      timestamp: '5 hours ago',
      likes: 23,
      comments: 18,
      shares: 2,
      category: 'Question',
      tags: ['tomato', 'pest-control', 'advice']
    },
    {
      id: 'mock-3',
      author: {
        name: 'Amit Patel',
        avatar: '🧑‍🌾',
        location: 'Gujarat',
        verified: false
      },
      content: 'Attended a workshop on drip irrigation today. Amazing technology! Can save up to 60% water. Planning to install it next month. 💧',
      image: null,
      timestamp: '1 day ago',
      likes: 67,
      comments: 24,
      shares: 15,
      category: 'Technology',
      tags: ['irrigation', 'water-saving', 'technology']
    },
    {
      id: 4,
      author: {
        name: 'Sunita Devi',
        avatar: '👵',
        location: 'Haryana',
        verified: true
      },
      content: 'Weather forecast shows heavy rain next week. Make sure to cover your crops and prepare drainage systems!',
      image: null,
      timestamp: '3 hours ago',
      likes: 89,
      comments: 31,
      shares: 42,
      category: 'Alert',
      tags: ['weather', 'alert', 'monsoon']
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/community');
      if (res.data && res.data.length > 0) {
        setPosts(res.data);
      } else {
        setPosts(mockPosts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      // Fallback to mock if API fails
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    // Optimistically update UI
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    try {
      if (typeof postId !== 'string' || !postId.startsWith('mock-')) {
        await axios.post(`/community/${postId}/like`);
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleComment = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
  };

  const handleShare = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
  };

  const handleCreatePost = async () => {
    if (newPost.trim()) {
      try {
        const payload = {
          content: newPost,
          category: 'General',
          tags: [],
          imageUrl: null
        };
        const res = await axios.post('/community', payload);
        setPosts([res.data, ...posts]);
        setNewPost('');
        setShowNewPost(false);
      } catch (err) {
        console.error('Failed to create post:', err);
        alert('Failed to post. Are you logged in?');
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Success Story': 'bg-green-100 text-green-700',
      'Question': 'bg-blue-100 text-blue-700',
      'Technology': 'bg-purple-100 text-purple-700',
      'Alert': 'bg-red-100 text-red-700',
      'General': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
          <p className="text-gray-600 text-lg">{t("Loading community...") || "Loading community..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Users className="w-10 h-10 text-green-600" />
                {t("Farmer Community") || "Farmer Community"}
              </h1>
              <p className="text-gray-600 mt-2">{t("Connect, learn, and grow together") || "Connect, learn, and grow together"}</p>
            </div>
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              {t("New Post") || "New Post"}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { icon: Users, label: t('Members') || 'Members', value: '12.5K', color: 'blue' },
              { icon: MessageCircle, label: t('Posts Today') || 'Posts Today', value: '234', color: 'green' },
              { icon: TrendingUp, label: t('Trending') || 'Trending', value: '45', color: 'purple' },
              { icon: Award, label: t('Experts') || 'Experts', value: '89', color: 'yellow' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-4 items-center bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts, topics, or farmers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'trending', 'following'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    filter === filterType
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* New Post Form */}
        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t("Create a Post") || "Create a Post"}</h3>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder={t("Share your farming experience, ask questions, or give advice...") || "Share your farming experience, ask questions, or give advice..."}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <ImageIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowNewPost(false)}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="text-5xl">{post.author.avatar}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800 text-lg">{post.author.name}</h3>
                        {post.author.verified && (
                          <div className="bg-blue-500 rounded-full p-0.5">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{post.author.location} · {post.timestamp}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Category Badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>

                {/* Post Content */}
                <p className="text-gray-700 text-lg leading-relaxed mb-4">{post.content}</p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-lg transition-all group"
                  >
                    <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                    <span className="text-gray-700 font-medium">{post.likes}</span>
                  </button>
                  <button onClick={() => handleComment(post.id)} className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-lg transition-all group">
                    <MessageCircle className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                    <span className="text-gray-700 font-medium">{post.comments}</span>
                  </button>
                  <button onClick={() => handleShare(post.id)} className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-lg transition-all group">
                    <Share2 className="w-5 h-5 text-gray-600 group-hover:text-green-500 transition-colors" />
                    <span className="text-gray-700 font-medium">{post.shares}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-lg transition-all group">
                    <Bookmark className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
