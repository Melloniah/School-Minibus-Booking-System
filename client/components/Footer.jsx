export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-green-500 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold mb-2">SafeRide</h3>
          <p className="text-sm mb-4">
            Providing super safe, reliable, and fun school transportation for amazing families across the city.
            Your child's safety and happiness is our top priority! 🚌
          </p>
          <p className="text-sm">📞 +1 (555) 123-4567</p>
          <p className="text-sm">✉️ hello@saferide.com</p>
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
            <li>Daily School Adventures</li>
            <li>Real-time GPS Magic</li>
            <li>Field Trip Fun</li>
            <li>After-school Programs</li>
            <li>Emergency Transport</li>
          </ul>
        </div>

        {/* Office Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-2">⏰ Office Hours</h3>
          <p className="text-sm">Monday - Friday: 6:00 AM - 7:00 PM</p>
          <p className="text-sm">Weekend Support: 8:00 AM - 4:00 PM</p>
          <p className="text-sm mt-2">📞 24/7 Emergency Line: +1 (555) 911-SAFE</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/30 mt-8 pt-4 text-center text-xs">
        © 2025 SafeRide. Made with love for amazing families | Privacy Policy | Terms of Service
      </div>
    </footer>
  );
}