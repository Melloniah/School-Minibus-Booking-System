export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-green-500 text-white py-4 md:py-6 text-sm">

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold mb-2">School Ride</h3>
          <p className="text-sm mb-4">
            Providing super safe, reliable, and comfortable school transportation for school children across the city.
            Your child's safety is our top priority! 
          </p>
          <p className="text-sm">📞+254 737973042</p>
          <p className="text-sm">✉️ hello@schoolride.com</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">⚡ Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li>Home</li>
            <li>Routes & Pricing</li>
            <li>Reviews</li>
            <li>About Us</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h3 className="text-lg font-semibold mb-2">⭐ Our Super Services</h3>
          <ul className="space-y-1 text-sm">
            <li>Daily School pick-up and drop offs</li>
            <li>Real-time GPS Tracking</li>
            <li>Field Trip Fun</li>
            <li>Emergency Transport</li>
          </ul>
        </div>

        {/* Office Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-2">⏰ Office Hours</h3>
          <p className="text-sm">Monday - Friday: 5:30 AM - 7:00 PM</p>
          <p className="text-sm">Weekend Support: 8:00 AM - 4:00 PM</p>
          <p className="text-sm mt-2">📞 24/7 Emergency Line: +254 737973042</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/30 mt-8 pt-4 text-center text-xs">
        © {new Date().getFullYear()} School Ride. The solution to your child's school pick-up and drop off| Privacy Policy | Terms of Service
      </div>
    </footer>
  );
}
