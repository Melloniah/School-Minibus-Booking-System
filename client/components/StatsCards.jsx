'use client'


import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

export default function StatsCards() {
  const stats = [
    { value: 500, suffix: '+', label: '😊 Happy Families' },
    { value: 15, suffix: '', label: '🛣️ Active Routes' },
    { value: 96, suffix: '%', label: '⏰ On-time Rate' },
    { value: 50000, suffix: '+', label: '👥 Students Transported' },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {stats.map((stat, index) => (
          <StatCard key={index} value={stat.value} suffix={stat.suffix} label={stat.label} />
        ))}
      </div>
    </section>
  )
}

function StatCard({ value, suffix, label }) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.5,
  })

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-blue-100 to-pink-100 p-6 rounded-lg shadow text-center"
    >
      <div className="text-3xl font-bold text-gray-800">
        {inView ? (
          <CountUp end={value} duration={2} suffix={suffix} />
        ) : (
          <span>0{suffix}</span>
        )}
      </div>
      <div className="text-md text-gray-600 mt-1">{label}</div>
    </div>
  )
}
