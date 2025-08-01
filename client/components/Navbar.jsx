"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const userMenuRef = useRef();
  const mobileMenuRef = useRef();

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

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
        <Link href="/" onClick={closeMobileMenu}>
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-white font-bold text-xl">
              <span className="text-4xl animate-bounce-gentle"> 🚌</span> School
              Ride
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-6 text-white font-medium ml-16">
          <li>
            <Link 
              href="/" 
              className="text-white hover:text-black transition-colors duration-200 cursor-pointer"
            >
              🏠 Home
            </Link>
          </li>
          <li>
            <Link 
              href="/book-seat" 
              className="text-white hover:text-black transition-colors duration-200 cursor-pointer"
            >
              Book Now
            </Link>
          </li>
          <li>
            <Link 
              href="#about" 
              className="text-white hover:text-black transition-colors duration-200 cursor-pointer"
            >
              👥 About
            </Link>
          </li>
          <li>
            <Link 
              href="/contact" 
              className="text-white hover:text-black transition-colors duration-200 cursor-pointer"
            >
              📞 Contact
            </Link>
          </li>
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex gap-4 items-center">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={toggleUserMenu} 
                className="text-white hover:text-gray-200 transition-colors duration-200 p-2"
                aria-label="User menu"
              >
                <FaUserCircle size={28} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li className="px-4 py-2 border-b">👋 {user.name}</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)}>
                        Profile
                      </Link>
                    </li>
                    <li
                      onClick={handleLogout}
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
                className="border border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-blue-500 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link href="/register">
                <button className="bg-yellow-400 px-4 py-2 rounded-full text-black font-semibold hover:bg-yellow-300 transition-colors duration-200">
                  🌠 Get Started
                </button>
              </Link>
              <Link
                href="/admin"
                className="border border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-blue-500 transition-all duration-200"
              >
                Admin Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white p-2 hover:text-gray-200 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden bg-white shadow-lg border-t border-gray-200 absolute top-full left-0 w-full z-40"
        >
          <div className="px-4 py-2">
            {/* Mobile Navigation Links */}
            <ul className="space-y-2 mb-4">
              <li>
                <Link 
                  href="/" 
                  onClick={closeMobileMenu}
                  className="block py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/book-seat" 
                  onClick={closeMobileMenu}
                  className="block py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  Book Now
                </Link>
              </li>
              <li>
                <Link 
                  href="#about" 
                  onClick={closeMobileMenu}
                  className="block py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  👥 About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={closeMobileMenu}
                  className="block py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  📞 Contact
                </Link>
              </li>
            </ul>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 py-2 px-2">
                    <FaUserCircle size={24} className="text-gray-600" />
                    <span className="text-gray-700 font-medium">👋 {user.name}</span>
                  </div>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="block py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-2 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block w-full text-center border border-blue-500 text-blue-500 py-3 px-4 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="block w-full text-center bg-yellow-400 text-black py-3 px-4 rounded-full font-semibold hover:bg-yellow-300 transition-colors duration-200"
                  >
                    🌠 Sign-Up 
                  </Link>
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="block w-full text-center border border-gray-400 text-gray-700 py-3 px-4 rounded-full hover:bg-gray-100 transition-all duration-200"
                  >
                    Admin Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}