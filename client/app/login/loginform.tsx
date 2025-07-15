'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ role, username, password });
    // TODO: Connect to backend later
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label className="mb-1 text-sm">Login as:</label>
      <select 
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
        className="mb-4 border rounded px-3 py-2"
      >
        <option value="" disabled>Select role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <label className="mb-1 text-sm">Username:</label>
      <input 
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        placeholder="Enter username"
        className="mb-4 border rounded px-3 py-2"
      />

      <label className="mb-1 text-sm">Password:</label>
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Enter password"
        className="mb-4 border rounded px-3 py-2"
      />

      <div className="flex justify-end mb-4">
        <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
      </div>

      <button 
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
}