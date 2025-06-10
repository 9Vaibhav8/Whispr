
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const PrivateRoute = ({ children }) => {
  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      await checkAuth();
      setLoading(false);
    };
    verifyUser();
  }, []);

  if (loading) return <div className="text-center mt-20">Checking access...</div>;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
