export default function OurSpecialty() {
  return (
    <div className="py-12 px-4 md:px-16 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
        What Makes SchoolRide Special
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Safety First</h3>
          <p className="text-gray-600">
            Advanced GPS tracking, background-checked drivers, and real-time monitoring ensure your child's security.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Smart Routing</h3>
          <p className="text-gray-600">
            Optimized routes covering key areas with convenient pickup and drop-off points.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
          <p className="text-gray-600">
            Live notifications keep parents informed about pickup times and arrival updates.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Community Focused</h3>
          <p className="text-gray-600">
            Empowering low income familes while providing reliable and price friendly school transportation solutions.
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Affordable Pricing</h3>
          <p className="text-gray-600">
            Transparent, family-friendly pricing that makes safe transportation accessible to everyone.
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">⚡ Easy Booking</h3>
          <p className="text-gray-600">
            Simple online booking system with flexible scheduling and easy payment options.
          </p>
        </div>
      </div>
    </div>
  );
}
