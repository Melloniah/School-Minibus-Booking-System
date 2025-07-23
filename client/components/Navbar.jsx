"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        <ul className="hidden md:flex gap-6 text-white font-medium">
          <li>
            <Link href="/">🏠 Home</Link>
          </li>
          <li>
            <Link href="/routes">Routes</Link>
          </li>
          <li>
            <Link href="/book-seat">Book Now</Link>
          </li>
          <li>
            <Link href="/about">👥 About</Link>
          </li>
          <li>
            <Link href="/contact">📞 Contact</Link>
          </li>
          
        </ul>

        {/* Buttons */}
        <div className="hidden md:flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-white">Welcome, {user.name}!</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
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
                className="border border-white text-white px-4 py-1 rounded-full">
                Admin Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          {/* Uncomment and implement mobile menu toggle icon */}
          {/* <Image
            src={menuIcon}
            alt="menu"
            width={30}
            height={30}
            onClick={toggleMenu}
            className="cursor-pointer"
          /> */}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-60 bg-[#0f2500] text-white p-6 z-40 transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-6">
          <li>
            <Link href="/">🏠 Home</Link>
          </li>
          <li>
            <Link href="/routes"> Routes</Link>
          </li>
          <li>
            <Link href="/book-seat">Book Now</Link>
          </li>
          <li>
            <Link href="/about"> About Us</Link>
          </li>
          <li>
            <Link href="/contact">📞 Contact Us</Link>
          </li>
          {!user && (
            <>
              <li>
                <Link href="/login">🔐 Sign In</Link>
              </li>
              <li>
                <Link href="/register">🌠 Get Started</Link>
              </li>
            </>
          )}
          {user && (
            <li>
              <button
                onClick={logout}
                className="bg-red-500 w-full py-2 rounded"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
