import React from 'react';
import { motion } from 'framer-motion';
import AuthModal from '../components/auth/AuthModal';

const AuthPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full mx-auto">
        <AuthModal />
      </div>
    </motion.div>
  );
};

export default AuthPage;