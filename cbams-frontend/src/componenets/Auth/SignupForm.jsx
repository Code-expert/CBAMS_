import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock,   
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserCircle,
  AlertCircle 
} from 'lucide-react';
import { validateEmail } from '../../utils/validation';
import { registerUser, reset } from '../../redux/slices/authSlice';

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    farmSize: '',
    role: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});

  // Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const farmSizeOptions = [
    { value: '', label: 'Select farm size' },
    { value: 'small', label: 'Small (< 2 acres)' },
    { value: 'medium', label: 'Medium (2-10 acres)' },
    { value: 'large', label: 'Large (10+ acres)' }
  ];

  const roleOptions = [
    { value: '', label: 'Select your role' },
    { value: 'FARMER', label: 'Farmer' },
    { value: 'SELLER', label: 'Seller' },
  ];

  // Handle Redux state changes
  useEffect(() => {
    if (isError) {
      console.error('Registration error:', message);
    }

    if (isSuccess && user) {
      navigate('/dashboard');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation logic (keep your existing validation)
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role selection is required';
    }

    if (formData.role === 'farmer' && !formData.farmSize) {
      newErrors.farmSize = 'Farm size is required for farmers';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Prepare data for backend (combine first and last name)
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
      role: formData.role.toUpperCase(),
      location: formData.location,
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.role === 'FARMER' && { farmSize: formData.farmSize })
    };

    // Dispatch Redux action
    dispatch(registerUser(userData));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Show Redux error message */}
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 ${
                errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              placeholder="First name"
            />
          </div>
          {errors.firstName && (
            <div className="text-red-600 text-xs mt-1">{errors.firstName}</div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 ${
                errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              placeholder="Last name"
            />
          </div>
          {errors.lastName && (
            <div className="text-red-600 text-xs mt-1">{errors.lastName}</div>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
            }`}
            placeholder="your.email@example.com"
          />
        </div>
        {errors.email && (
          <div className="text-red-600 text-xs mt-1">{errors.email}</div>
        )}
      </div>

      {/* Location & Role */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 ${
                errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              placeholder="Your location"
            />
          </div>
          {errors.location && (
            <div className="text-red-600 text-xs mt-1">{errors.location}</div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Role
          </label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 ${
                errors.role ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {errors.role && (
            <div className="text-red-600 text-xs mt-1">{errors.role}</div>
          )}
        </div>
      </div>

      {/* Farm Size - Only show for farmers */}
      {formData.role === 'farmer' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Farm Size
          </label>
          <select
            value={formData.farmSize}
            onChange={(e) => handleInputChange('farmSize', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 ${
              errors.farmSize ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
            }`}
          >
            {farmSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.farmSize && (
            <div className="text-red-600 text-xs mt-1">{errors.farmSize}</div>
          )}
        </motion.div>
      )}

      {/* Password Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 ${
                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <div className="text-red-600 text-xs mt-1">{errors.password}</div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full pl-4 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 ${
                errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="text-red-600 text-xs mt-1">{errors.confirmPassword}</div>
          )}
        </div>
      </div>

      {/* Terms Agreement */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 mt-1"
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <button type="button" className="text-green-600 hover:text-green-700 font-medium">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-green-600 hover:text-green-700 font-medium">
              Privacy Policy
            </button>
          </span>
        </label>
        {errors.agreeTerms && (
          <div className="flex items-center gap-1 mt-2 text-red-600 text-xs">
            <AlertCircle className="w-3 h-3" />
            {errors.agreeTerms}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default SignupForm;
