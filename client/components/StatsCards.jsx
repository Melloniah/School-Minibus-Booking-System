export default function StatsCards() {
    const stats = [
      { value: '500+', label: '😊 Happy Families' },
      { value: '15', label: '🛣️ Active Routes' },
      { value: '96%', label: '⏰ On-time Rate' },
      { value: '50K+', label: '👥 Students Transported' },
    ]
  
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-100 to-pink-100 p-6 rounded-lg shadow text-center">
              <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-md text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    )
  }