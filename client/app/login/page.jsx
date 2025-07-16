"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Sync user state to localStorage and redirect based on role
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.token) {
        localStorage.setItem("token", user.token);
      }

      // Redirect by role
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/parent/dashboard");
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", { // waiting for the 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user); //  { name, email, role, token, ... }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    // Optional: show logged-in UI or redirect happening
    return (
      <div className="p-4">
        <h2>Welcome, {user.name}!</h2>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto p-6 border rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <label htmlFor="email" className="block mb-1 font-semibold">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-4 p-2 border rounded"
        placeholder="you@example.com"
      />

      <label htmlFor="password" className="block mb-1 font-semibold">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full mb-4 p-2 border rounded"
        placeholder="••••••••"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
