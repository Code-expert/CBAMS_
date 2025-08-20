import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    token,
    isLoading,
    isError,
    isSuccess,
    message,
    isAuthenticated: !!user && !!token,
    userRole: user?.role
  };
};
