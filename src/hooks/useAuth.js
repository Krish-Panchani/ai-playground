import { useAuthContext } from "../context/AuthContext";

const useAuth = () => {
  const { user, loading, isAuthenticated } = useAuthContext();
  if (loading) {
    return null;
  }
  if (!isAuthenticated || !user) {
    return null;
  }

  return {
    uid: user.id,
    displayName: user.displayName,
    email: user.email,
    xp: user.xp,
    level: user.level,
  };
};

export default useAuth;
