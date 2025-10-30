import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Leaf,
  Menu,
  X,
  Search,
  User,
  Settings,
  MessageCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { languages, translations } from '../constants/languages';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { logout } from '../redux/slices/authSlice';

const Header = ({ sidebarOpen, setSidebarOpen, currentLanguage, setCurrentLanguage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);


  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  const handleProfileAction = (item) => {
    if (item.isAction && item.label.toLowerCase().includes('logout')) {
      dispatch(logout());
      navigate('/login');
    } else if (item.href) {
      navigate(item.href);
    }
    setIsProfileDropdownOpen(false);
  };

  const profileMenuItems = [
    { icon: User, label: t("profile") || "Profile", href: "/profile" },
    { icon: Settings, label: t("settings") || "Settings", href: "/profile"},
    { icon: Bell, label: t("notifications") || "Notifications", href: "/notifications" },
    { icon: MessageCircle, label: t("messages") || "Messages", href: "/messages" },
    { icon: LogOut, label: t("logout") || "Logout", href: "/logout", isAction: true }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-lg border-b border-green-100"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🌾 Kisan Utkarsh</h1>
              <p className="text-sm text-gray-500">{t('dashboard')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Avatar */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 p-1 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center border-2 border-white/30">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-black">{user.name?.split(' ')[0]}</div>
                <div className="text-xs text-green-800">{user.role}</div>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
              >
                {/* User Info Header */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center border-2 border-white shadow-md">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-green-600 font-medium">{user.role}</div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {profileMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleProfileAction(item)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 ${item.isAction ? 'border-t border-gray-100 text-red-600 hover:bg-red-50' : ''
                          }`}
                      >
                        <Icon className={`w-4 h-4 ${item.isAction ? 'text-red-500' : 'text-gray-500'}`} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-green-50 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Time */}
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-gray-800">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-gray-500">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;