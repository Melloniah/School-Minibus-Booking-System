import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    quote: "This service has been a game-changer for our family. I trust the drivers completely.",
    name: "Jane Kamau",
    role: "Happy Mother of 2",
    rating: 5,
  },
  {
    quote: "The app is super easy to use and I love tracking the minibus in real-time.",
    name: "Peter Mwangi",
    role: "Father & Tech Professional",
    rating: 4,
  },
  {
    quote: "My twins love the fun ride and I love the peace of mind it brings me!",
    name: "Mary Njeri",
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
    quote: "The drivers are so friendly and professional. My kids feel safe and happy.",
    name: "Grace Wambui",
    role: "Working Mom of 3",
    rating: 5,
  },
  {
    quote: "Excellent service and clear communication. I never worry about delays.",
    name: "Samuel Kariuki",
    role: "Busy Executive & Father",
    rating: 4,
  },
  {
    quote: "Super safe and super smooth! Even my shy daughter loves going to school now.",
    name: "Ann Muthoni",
    role: "Parent of a Kindergartener",
    rating: 5,
  },
  {
    quote: "The booking process is seamless, and the support team is very responsive.",
    name: "Daniel Otieno",
    role: "Father of 1",
    rating: 4,
  },
  {
    quote: "I tell all my friends about it — it’s the best transport solution out there!",
    name: "Lucy Ndegwa",
    role: "Parent & Teacher",
    rating: 5,
  },
  {
    quote: "Honestly, I sleep better knowing my son is in safe hands every morning.",
    name: "Felix Mwangi",
    role: "Concerned Father",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">What Parents Are Saying</h2>
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