import BaseModal from '../UI/BaseModal';
import useAuth from '../../../hooks/useAuth';

const LogoutConfirmationModal = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const logoutIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      icon={logoutIcon}
      title="Confirm Logout"
      body={<p>Are you sure you want to logout from your account?</p>}
      cancelText="Cancel"
      operationObj={{
        text: "Logout",
        navigate: "/login"
      }}
      onConfirm={logout}
    />
  );
};

export default LogoutConfirmationModal; 