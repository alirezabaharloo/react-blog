import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BaseModal = ({ 
  isOpen, 
  onClose, 
  icon, 
  title, 
  body, 
  cancelText = "Cancel", 
  operationObj = { text: "Confirm", navigate: null },
  onConfirm
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const modalVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0,
      y: 20
    },
    visible: { 
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: { 
      scale: 0.8,
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const handleOperation = () => {
    if (onConfirm) {
      onConfirm();
    }
    
    if (operationObj.navigate) {
      navigate(operationObj.navigate);
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {icon && (
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gray-100 rounded-full">
                {icon}
              </div>
            </div>
          )}

          <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">{title}</h3>
          <div className="text-gray-600 text-center mb-8">{body}</div>
          
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              {cancelText}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOperation}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {operationObj.text}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BaseModal;



