import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './UserContext';
import { CircularProgress } from '@mui/material';

const ProtectedRoute = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <CircularProgress />;
  }

  return user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
