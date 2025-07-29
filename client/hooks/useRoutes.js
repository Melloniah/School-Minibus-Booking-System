'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 

const API_BASE = 'http://localhost:5000';

const getRoutes = () =>
  axios.get(`${API_BASE}/routes/`, { withCredentials: true });

export const useRoutes = (options = {}) => {
  const { 
    autoSelectFirst = true,
    showSuccessToast = false 
  } = options;
  
  const { user, loading } = useAuth(); // Get auth state
  
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Only fetch routes when auth check is complete AND user is authenticated
    if (!loading) {
      if (user) {
        fetchRoutes();
      } else {
        // User not authenticated, stop loading
        setLoadingRoutes(false);
        setRoutes([]);
      }
    }
  }, [loading, user]); // Depend on both loading and user

  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true);
      const response = await getRoutes();
      
      if (response.status === 200) {
        const routeData = response.data;
        setRoutes(routeData);
        
        // Auto-select first route if enabled
        if (autoSelectFirst && routeData.length > 0) {
          setSelectedRoute(routeData[0]);
        }
        
        if (showSuccessToast) {
          toast.success('Routes loaded successfully');
        }
      } else {
        toast.error('Failed to fetch routes');
        setRoutes([]);
      }
    } catch (err) {
      console.error('Failed to fetch routes:', err);
      
      // More specific error handling
      if (err.response?.status === 401) {
        console.log('User not authenticated for routes');
        // Don't show error toast for auth issues
      } else {
        toast.error('Error loading routes');
      }
      setRoutes([]);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setSearchTerm(''); // Clear search when route is selected
  };

  const handleSearchSuggestion = (route) => {
    setSelectedRoute(route);
    setSearchTerm(''); // Clear search when suggestion is selected
  };

  // Filter routes based on search term
  const filteredRoutes = searchTerm
    ? routes.filter(route =>
        route.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : routes;

  return {
    routes,
    selectedRoute,
    loadingRoutes,
    searchTerm,
    filteredRoutes,
    setSearchTerm,
    fetchRoutes,
    handleRouteSelect,
    handleSearchSuggestion,
    setSelectedRoute
  };
};