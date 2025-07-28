// client/app/layout.jsx


import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {AuthProvider} from "../context/AuthContext";
import { GoogleMapsProvider } from '../components/GoogleMapsProvider';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "School Minibus Booking",
  description: "Book safe transport for your kids",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Toaster position="top-center" />

        <AuthProvider>
         <GoogleMapsProvider>
          <Navbar />
          <main className="flex-grow pt-20 mb-10">{children}</main>
         <Footer />
        </GoogleMapsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
