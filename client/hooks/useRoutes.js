'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const getRoutes = () =>
  axios.get(`${API_BASE}/routes/`, { withCredentials: true });

export const useRoutes = (options = {}) => {
  const { 
    autoSelectFirst = true,
    showSuccessToast = false 
  } = options;
  
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

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
      toast.error('Error loading routes');
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