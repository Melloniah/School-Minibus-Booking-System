


import { FaStar } from 'react-icons/fa';


const testimonials = [
  
  {
    quote: "The app is super easy to use and I love tracking the minibus in real-time.",
    name: "Peter Wanyonyi",
    role: "Father & Tech Professional",
    rating: 4,
  },
  {
    quote: "My twins love the fun ride and I love the peace of mind it brings me!",
    name: "Mary Mwamburi",
    role: "Mother of Twins",
    rating: 5,
  },
  {
    quote: "Reliable, affordable, and always on time. Couldn't ask for more.",
    name: "John Ochieng",
    role: "Single Dad",
    rating: 4,
  },
 
  {
    quote: "Excellent service and clear communication. I never worry about delays.",
    name: "Samuel Kariuki",
    role: "Busy Executive & Father",
    rating: 4,
  },
  {
    quote: "Super safe and super smooth! Even my shy daughter loves going to school now.",
    name: "Ann Mbithe",
    role: "Parent of a Kindergartener",
    rating: 5,
  },
  {
    quote: "The booking process is seamless, and the support team is very responsive.",
    name: "Ruth Kerubo",
    role: "Mother of 1",
    rating: 4,
  }
];

export default function TestimonialsSection() {
  const renderStars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);

  return (
    <section className="py-12 px-4 md:px-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10">💬 What Parents Are Saying</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-xl transition duration-300"
          >
            <p className="text-gray-700 italic mb-4">“{t.message}”</p>
            <div className="text-yellow-400 text-sm mb-1">{renderStars(t.stars)}</div>
            <div className="text-sm font-semibold">{t.name}</div>
            <div className="text-xs text-gray-500">{t.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}