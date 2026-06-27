import { useApp } from '../providers/AppProvider';

export const useAuth = () => {
  const { user, isLoading, login, register, forgotPassword, logout, updateProfile } = useApp();
  return { user, isLoading, login, register, forgotPassword, logout, updateProfile };
};
