'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { user, login } = useAuth(); // Use context user
  const router = useRouter();

  // Remove local user state - use context instead
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if already logged in and redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'user') {
        router.push('/');
      }
    }
  }, [user, router]);

  // Handle form submit to login
 async function handleLogin(e) {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Login failed');
      return;
    }

    login(data.user); // sets user in context


  } catch (err) {
    setError('Server error');
    console.error(err);
  }
}


  if (user) {
    return <p>You are already logged in as {user.name}</p>;
  }

  return (
    <div className="max-w-md mx-auto pt-20 pb-20">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}