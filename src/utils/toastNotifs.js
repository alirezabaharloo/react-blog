import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configure default toast options
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    ...defaultOptions,
    style: {
      background: '#F0FDF4',
      color: '#166534',
      border: '1px solid #BBF7D0',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    ...defaultOptions,
    autoClose: 4000,
    style: {
      background: '#FEF2F2',
      color: '#991B1B',
      border: '1px solid #FECACA',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
  });
};

export const showInfoToast = (message) => {
  toast.info(message, {
    ...defaultOptions,
    style: {
      background: '#EFF6FF',
      color: '#1E40AF',
      border: '1px solid #BFDBFE',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
  });
};  