'use client';

export default function SpecialtySection() {
  const specialties = [
    {

      
      title: 'Safety First',
      description: 'Advanced GPS tracking, background-checked drivers, and real-time monitoring ensure your child’s security.',
      bgColor: 'bg-red-300',
    },
    {
      
      title: 'Smart Routing',
      description: 'Optimized routes covering key areas with convenient pickup and drop-off points.',
      bgColor: 'bg-blue-300',
    },
    {
      
      title: 'Real-Time Updates',
      description: 'Live notifications keep parents informed about pickup times and arrival updates.',
      bgColor: 'bg-green-300',
    },
    {
      
      title: 'Community Focused',
      description: 'Empowering low-income families by providing reliable transportation solutions.',
      bgColor: 'bg-purple-400',
    },
    {
      title: 'Easy Booking',
      description: 'Simple online booking system with flexible scheduling and easy payment options.',
      bgColor: 'bg-pink-300',

    },
     {
     
      title: 'Affordable Pricing',
      description: 'Transparent, family-friendly pricing that makes safe transportation accessible to everyone.',
      bgColor: 'bg-yellow-400',
    },
  ];

  return (
    <section className="py-10 px-4 md:px-16 bg-gray-100">

      <h2 className="text-3xl font-bold text-center mb-8">What Makes School Ride Special</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {specialties.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg p-6 shadow-lg text-white ${item.bgColor} 
                        transition-transform transform hover:scale-105 active:scale-95 cursor-pointer`}
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}