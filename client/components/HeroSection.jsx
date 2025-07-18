"use client";

import Image from "next/image";
import { MapPin, Shield, Clock, Heart, Star } from "lucide-react";

export default function HeroSection() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookNow = () =>{
    router.push('/book')
  }

  return (
    <section id="home" className="bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 py-20 relative overflow-hidden">
       <div className="px-4 py-8 text-center drop-shadow-md">
        <h1 className="text-3xl font-bold">Welcome to the School Minibus Booking System</h1>
        <p className="text-grey-800 mt-2">Book a seat for your child quickly and easily.</p>
      </div>
        {/* decorative bubbles */}
            <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-20 right-20 w-12 h-12 bg-pink-400 rounded-full opacity-20 animate-bounce-gentle"></div>
            <div className="absolute bottom-20 left-20 w-20 h-20 bg-green-400 rounded-full opacity-20 animate-float"></div>
            <div className="absolute bottom-10 right-10 w-14 h-14 bg-purple-400 rounded-full opacity-20 animate-bounce-gentle"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* left side content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-4xl animate-bounce-gentle"> 🚌</span>
                                <span className="text-2xl animate-bounce-gentle">✨</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                                Safe, Comfortable and Reliable Bus Ride for Every Child. 
                            </h1>
                            <p className="text-lg text-gray-700 max-w-lg">
                                 🌟 Book super safe minibus rides for your children with real-time tracking, 
                friendly prices, and amazing drivers.
                            </p>
                        </div>
                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4">
                            <Feature icon={<Shield className="h-5 w-5 text-green-600" />} label="🛡️ Super Safe" />
                            <Feature icon={<Clock className="h-5 w-5 text-blue-600" />} label="📍 Live Tracking" />
                            <Feature icon={<MapPin className="h-5 w-5 text-purple-600" />} label="🗺️ Fixed Routes" />
                            <Feature icon={<Heart className="h-5 w-5 text-pink-600" />} label="💰 Great Prices" />
                        </div>
                        {/* Call to action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                      className="text-lg px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 shadow-lg transform hover:scale-105 transition-all"
              >
                🚌 Book a Ride Now
              </button>

              <button
                onClick={() => scrollToSection("routes")}
                className="text-lg px-8 py-3 border-2 border-purple-400 text-purple-700 rounded-lg hover:bg-purple-50 shadow-lg transform hover:scale-105 transition-all"
              >
                View Routes & Pricing
              </button>
              </div>
              {/* statistics */}
              <div className="flex items-center space-x-8 pt-8">
                <Stat label="😊 Happy Families" value="500+" color="text-blue-600"/>
                <Stat label="🛣️ Reliable Routes" value="15" color="text-green-600" />
                <Stat label="⏰ On-time Rate" value="96%" color="text-purple-600" />
                <Stat label="🚌 Safe Rides" value="99.8%" color="text-pink-600" />
              </div>
            </div>
            {/* Right Image */}
            <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-8 shadow-2xl">
                    <Image
                    src="/school-minibus.jpg"
                    alt="A safe school minibus"
                    width={600}
                    height={400}
                    className="w-full h-80 object-cover rounded-xl shadow-xl"
                    priority
                    />
                </div>
                {/* Floating information */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border-2 border-green-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-100 rounded-full p-2 animate-bounce-gentle">
                            <Shield className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium">Gracie was picked up safely! 🎉</div>
                            <div className="text-xs text-gray-500">2 minutes ago</div>
                        </div>
                    </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce-gentle">
                   <Star className="h-6 w-6 text-white" />
                </div>
            </div>
            </div>
            </div>

    </section>
  );
}

function Feature ({icon, label}){
    return(
        <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl shadow-sm">
            <div className="bg-white rounded-full p-2">{icon}</div>
            <span className="font-medium">{label}</span>
        </div>
    );
}

function Stat({label, value, color}){
    return(
        <div className="text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-600">{label}</div>

        </div>
    )
}

    
   
