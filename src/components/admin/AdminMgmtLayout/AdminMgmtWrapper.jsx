import { motion } from 'framer-motion';

const AdminMgmtWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      {children}
    </motion.div>
  );
};

export default AdminMgmtWrapper;