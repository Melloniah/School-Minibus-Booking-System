"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const menuRef = useRef();

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        sticky
          ? "bg-gradient-to-r from-pink-500 to-blue-500 shadow-2xl"
          : "bg-gradient-to-r from-blue-500 to-pink-500"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-white font-bold text-xl">
              <span className="text-4xl animate-bounce-gentle"> 🚌</span> School
              Ride
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-white font-medium ml-16">
          <li><Link href="/" className="text-white hover:text-black transition-colors duration-200 cursor-pointer">🏠 Home</Link></li>
          <li><Link href="/book-seat" className="text-white hover:text-black transition-colors duration-200 cursor-pointer">Book Now</Link></li>
          <li><Link href="#about" className="text-white hover:text-black transition-colors duration-200 cursor-pointer">👥 About</Link></li>
          <li><Link href="/contact" className="text-white hover:text-black transition-colors duration-200 cursor-pointer">📞 Contact</Link></li>
        </ul>

        {/* Buttons */}
        <div className="hidden md:flex gap-4 items-center">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
                <FaUserCircle size={28} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li className="px-4 py-2 border-b">👋 {user.name}</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link href="/profile">Profile</Link>
                    </li>
                    <li
                      onClick={logout}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="border border-white text-white px-4 py-1 rounded-full"
              >
                Sign In
              </Link>
              <Link href="/register">
                <button className="bg-yellow-400 px-4 py-1 rounded-full text-black font-semibold">
                  🌠 Get Started
                </button>
              </Link>
              <Link
                href="/admin"
                className="border border-white text-white px-4 py-1 rounded-full"
              >
                Admin Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu icon placeholder */}
        <div className="md:hidden">{/* mobile icon logic here */}</div>
      </div>
    </nav>
  );
}
