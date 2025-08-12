


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

export default function Testimonials() {
  return (
    <section id="about" className="bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">What Other Parents Are Saying</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-gray-700 italic mb-4">“{testimonial.quote}”</p>
              <div className="flex items-center text-yellow-500 mb-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="font-semibold text-gray-900">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}