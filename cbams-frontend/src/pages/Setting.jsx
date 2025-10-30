import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Globe,
  Moon,
  Sun,
  Shield,
  Camera,
  Save,
  Trash2,
  LogOut,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon,
  Key,
  Database,
  Download,
  Upload,
  Smartphone
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import axios from '../utils/axiosConfig';

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [darkMode, setDarkMode] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    taskReminders: true,
    marketplaceUpdates: true,
    sessionReminders: true
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    dataSharing: false
  });

  // Show Toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Profile Picture Upload
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('profile', file);

    try {
      setLoading(true);
      const response = await axios.post('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      showToast('✅ Profile picture updated!', 'success');
      // Update profile picture in state/redux
    } catch (error) {
      showToast('❌ Failed to upload image', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put('/profile', profile);
      showToast('✅ Profile updated successfully!', 'success');
    } catch (error) {
      showToast('❌ Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('❌ Passwords do not match', 'error');
      return;
    }

    if (passwords.newPassword.length < 6) {
      showToast('❌ Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      await axios.put('/profile/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      
      showToast('✅ Password changed successfully!', 'success');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast('❌ Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update Notification Settings
  const handleUpdateNotifications = async () => {
    try {
      setLoading(true);
      await axios.put('/profile/notifications', notifications);
      showToast('✅ Notification preferences saved!', 'success');
    } catch (error) {
      showToast('❌ Failed to update notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update Privacy Settings
  const handleUpdatePrivacy = async () => {
    try {
      setLoading(true);
      await axios.put('/profile/privacy', privacy);
      showToast('✅ Privacy settings updated!', 'success');
    } catch (error) {
      showToast('❌ Failed to update privacy', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (!window.confirm('⚠️ Are you sure you want to delete your account? This action cannot be undone!')) {
      return;
    }

    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation !== 'DELETE') {
      showToast('❌ Account deletion cancelled', 'error');
      return;
    }

    try {
      setLoading(true);
      await axios.delete('/profile');
      showToast('✅ Account deleted successfully', 'success');
      setTimeout(() => dispatch(logout()), 2000);
    } catch (error) {
      showToast('❌ Failed to delete account', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Export Data
  const handleExportData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/profile/export-data', { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cbams-data-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showToast('✅ Data exported successfully!', 'success');
    } catch (error) {
      showToast('❌ Failed to export data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'account', name: 'Account Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Lock },
    { id: 'appearance', name: 'Appearance', icon: darkMode ? Moon : Sun },
    { id: 'data', name: 'Data & Storage', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium flex items-center gap-3`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
            <SettingsIcon className="text-green-600" />
            Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    dispatch(logout());
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-4 text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-6">Profile Information</h2>

                  {/* Profile Picture */}
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b-2 border-gray-100">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-black">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 border-2 border-gray-200">
                        <Camera className="w-4 h-4 text-gray-700" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* Account Security Section */}
              {activeSection === 'account' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-6">Account Security</h2>

                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="password"
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="password"
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="password"
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Shield className="w-5 h-5" />
                      {loading ? 'Updating...' : 'Change Password'}
                    </button>
                  </form>

                  {/* Two-Factor Authentication */}
                  <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <Smartphone className="w-5 h-5" />
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-6">Notification Preferences</h2>

                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-bold text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-sm text-gray-600">Receive notifications for this activity</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [key]: !value })}
                          className={`w-14 h-7 rounded-full transition-colors ${
                            value ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            value ? 'translate-x-8' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={handleUpdateNotifications}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-6">Privacy Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Profile Visibility</label>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>

                    {['showEmail', 'showPhone', 'dataSharing'].map((key) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-bold text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-sm text-gray-600">Allow access to this information</p>
                        </div>
                        <button
                          onClick={() => setPrivacy({ ...privacy, [key]: !privacy[key] })}
                          className={`w-14 h-7 rounded-full transition-colors ${
                            privacy[key] ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            privacy[key] ? 'translate-x-8' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={handleUpdatePrivacy}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save Privacy Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-6">Appearance</h2>

                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            Dark Mode
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">Switch between light and dark theme</p>
                        </div>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`w-14 h-7 rounded-full transition-colors ${
                            darkMode ? 'bg-gray-800' : 'bg-yellow-400'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            darkMode ? 'translate-x-8' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Language</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                          <option value="en">English</option>
                          <option value="hi">हिंदी (Hindi)</option>
                          <option value="mr">मराठी (Marathi)</option>
                          <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Storage Section */}
              {activeSection === 'data' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-6">Data & Storage</h2>

                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                      <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Export Your Data
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">Download a copy of all your data</p>
                      <button
                        onClick={handleExportData}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                      >
                        Export Data
                      </button>
                    </div>

                    <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                      <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        Delete Account
                      </h3>
                      <p className="text-sm text-red-600 mb-4">Permanently delete your account and all data</p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
