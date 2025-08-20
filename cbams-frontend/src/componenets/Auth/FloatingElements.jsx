// components/FloatingElements.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sprout, Tractor } from 'lucide-react';

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ 
          y: [-20, 20, -20], 
          rotate: [0, 5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-10 w-16 h-16 bg-green-200/30 rounded-full flex items-center justify-center"
      >
        <Leaf className="w-8 h-8 text-green-500" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [20, -20, 20], 
          rotate: [0, -5, 0],
          scale: [1.1, 1, 1.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-40 right-20 w-20 h-20 bg-yellow-200/20 rounded-full flex items-center justify-center"
      >
        <Sprout className="w-10 h-10 text-yellow-600" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [-15, 15, -15], 
          x: [0, 10, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-32 left-1/4 w-12 h-12 bg-blue-200/25 rounded-full flex items-center justify-center"
      >
        <Tractor className="w-6 h-6 text-blue-600" />
      </motion.div>
    </div>
  );
};

export default FloatingElements;