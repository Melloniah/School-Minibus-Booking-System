"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import logo from "@/public/logo.png";
// import menuIcon from "@/public/menu_icon.svg";

export default function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <div className="flex items-center gap-2">
            {/* <Image src={logo} alt="SafeRide Logo" width={40} height={40} /> */}
            <span className="text-white font-bold text-xl">SafeRide</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-white font-medium">
          <li>
            <Link href="/">🏠 Home</Link>
          </li>
          <li>
            <Link href="/routes">🗺️ Routes</Link>
          </li>
          <li>
            <Link href="/book-seat">📅 Book Now</Link>
          </li>
          <li>
            <Link href="/about">👥 About</Link>
          </li>
          <li>
            <Link href="/contact">📞 Contact</Link>
          </li>
        </ul>

        {/* Buttons */}
        <div className="hidden md:flex gap-2">
          <Link href="/login">
            <button className="border border-white text-white px-4 py-1 rounded-full">
              Sign In
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-yellow-400 px-4 py-1 rounded-full text-black font-semibold">
            🌠 Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
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
            <Link href="/routes">🗺️ Routes</Link>
          </li>
          <li>
            <Link href="/book-seat">📅 Book Now</Link>
          </li>
          <li>
            <Link href="/about">👥 About</Link>
          </li>
          <li>
            <Link href="/contact">📞 Contact</Link>
          </li>
          <li>
            <Link href="/login">🔐 Sign In</Link>
          </li>
          <li>
            <Link href="/register">🌠 Get Started</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}