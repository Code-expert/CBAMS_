import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X, ChevronDown, Leaf, User, Settings, LogOut, Bell, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice.js';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux user data
  const { user } = useSelector((state) => state.auth);

  // Get navigation items based on login status and role
  const getNavItems = () => {
    if (!user) {
      // Logged-out navigation
      return [
        { href: "/", label: t("home") || "Home", key: "home" },
        { href: "/about", label: t("about") || "About", key: "about" },
        { href: "/features", label: t("features") || "Features", key: "features" },
      ];
    }

    // Logged-in navigation - role based
    const baseItems = [
      // ✅ Dynamic dashboard based on role
      { 
        href: user.role === 'EXPERT' ? "/expert/dashboard" : "/dashboard", 
        label: t("dashboard") || "Dashboard", 
        key: "dashboard" 
      }
    ];

    return baseItems;
  };

  const navItems = getNavItems();

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "hi", label: "हिंदी", flag: "🇮🇳" },
    { code: "bn", label: "বাংলা", flag: "🇧🇩" },
    { code: "te", label: "తెలుగు", flag: "🇮🇳" }
  ];
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleProfileAction = (item) => {
    if (item.isAction && item.label.toLowerCase().includes('logout')) {
      dispatch(logout());
      navigate('/login');
    } else if (item.href) {
      navigate(item.href);
    }
    setIsProfileDropdownOpen(false);
  };

  // ✅ Dynamic profile menu items based on role
  const getProfileMenuItems = () => {
    const baseItems = [
      { icon: User, label: t("profile") || "Profile", href: "/profile" },
      { icon: Settings, label: t("settings") || "Settings", href: "/settings" },
    ];

    // Add expert-specific menu item
    if (user?.role === 'EXPERT') {
      baseItems.splice(1, 0, {
        icon: Settings,
        label: t("expertProfile") || "Edit Expert Profile",
        href: "/expert/profile/edit"
      });
    }

    // Add logout at the end
    baseItems.push({
      icon: LogOut,
      label: t("logout") || "Logout",
      href: "/logout",
      isAction: true
    });

    return baseItems;
  };

  const profileMenuItems = user ? getProfileMenuItems() : [];

  // ✅ Helper function to get dashboard route
  const getDashboardRoute = () => {
    return user?.role === 'EXPERT' ? '/expert/dashboard' : '/dashboard';
  };

  return (
    <motion.nav // ✅ FIXED: Removed stray 'S'
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white shadow-xl backdrop-blur-sm border-b border-green-500/20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(user ? getDashboardRoute() : "/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Leaf className="w-6 h-6 text-yellow-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Kisan Utkarsh
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.key}
                onClick={() => navigate(item.href)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="relative px-3 py-2 text-sm font-medium hover:text-yellow-200 transition-all duration-300 group bg-transparent border-none cursor-pointer"
              >
                {item.label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </motion.button>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              // LOGGED-IN USER CONTROLS
              <>
                {/* Notification Bell */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex relative p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </motion.button>

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
                      <div className="text-sm font-medium text-white">{user.name?.split(' ')[0]}</div>
                      <div className="text-xs text-green-200">{user.role}</div>
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
                              className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 ${
                                item.isAction ? 'border-t border-gray-100 text-red-600 hover:bg-red-50' : ''
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
              </>
            ) : (
              // LOGGED-OUT USER CONTROLS
              <>
                {/* Login Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="cursor-pointer hidden sm:block px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20"
                >
                  {t("login") || "Login"}
                </motion.button>

                {/* Signup Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="hidden sm:block px-4 py-2 text-sm font-medium bg-yellow-400 text-green-800 hover:bg-yellow-300 rounded-xl transition-all duration-300 font-semibold shadow-lg"
                >
                  {t("signup") || "Sign Up"}
                </motion.button>
              </>
            )}

            {/* Language Dropdown */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20"
              >
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="hidden sm:block text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Language Dropdown Menu */}
              {isLanguageDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors duration-200 ${
                        i18n.language === lang.code ? 'bg-green-100 text-green-800' : ''
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/20 mt-4 pt-4"
          >
            <div className="flex flex-col gap-2 pb-4">
              {/* Navigation Items */}
              {navItems.map((item, index) => (
                <motion.button
                  key={item.key}
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/10 rounded-xl transition-all duration-300 bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Mobile Auth Buttons */}
              {!user && (
                <>
                  <motion.button
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="mx-4 mt-2 px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20"
                  >
                    {t("login") || "Login"}
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="mx-4 px-4 py-2 text-sm font-medium bg-yellow-400 text-green-800 hover:bg-yellow-300 rounded-xl transition-all duration-300 font-semibold shadow-lg"
                  >
                    {t("signup") || "Sign Up"}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Close dropdowns when clicking outside */}
      {(isLanguageDropdownOpen || isProfileDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsLanguageDropdownOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
    </motion.nav>
  );
};

export default Navbar;
