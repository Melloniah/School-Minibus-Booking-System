// This is to help prevent accessing pages eg booking and route from happening before login .

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // adjust path

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Prevent UI flickering while checking auth
  if (loading || (!user && typeof window !== 'undefined')) return null;

  return children;
};

export default ProtectedRoute;
