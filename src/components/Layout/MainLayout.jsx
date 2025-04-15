import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import useAuth from '../../hooks/useAuth';
import { getUserProfile } from '../../store/auth/authActions';

const MainLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    // Refresh user profile on layout mount
    if (isAuthenticated && !user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 lg:ml-64">
        <Header />
        
        <main className="flex-1 p-4 overflow-y-auto sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;