import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

const AdminSomethingWentWrong = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="text-center"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="mb-8"
        >
          <FiAlertCircle className="w-24 h-24 text-red-500 mx-auto" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-gray-800 mb-4"
        >
          500
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-gray-600 mb-6"
        >
          Something Went Wrong
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-8 max-w-md mx-auto"
        >
          An unexpected error occurred on the server. Please try refreshing the page or return to the dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 mr-4"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
          <Link
            to="/admin"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-sm text-gray-400"
      >
        Admin Panel • {new Date().getFullYear()}
      </motion.div>
    </motion.div>
  );
};

export default AdminSomethingWentWrong;