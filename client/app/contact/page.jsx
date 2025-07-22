'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");

    const formData = new FormData(event.target);
    formData.append("access_key", "99f7555b-fce8-441f-a30b-28aedfa675b5");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="max-w-[90%] mx-auto my-20 flex flex-col md:flex-row justify-between gap-10">
      {/* Left column */}
      <div className="flex-1 text-gray-600">
        <h3 className="text-[#0f2500] text-2xl font-medium mb-4">
          Send us a message
        </h3>
        <p className="max-w-[450px] leading-relaxed mb-1">
        Got a question or feedback? We’re here to help!
        </p>
        <p className="max-w-[450px] leading-relaxed mb-1">
          We value every message and are always ready to listen.
        </p>
        <p className="max-w-[450px] leading-relaxed mb-1">
          Our team will get back to you as soon as possible.
        </p>
        <p className="max-w-[450px] leading-relaxed mb-4">
        Reach out — let’s make every school ride safer and better.
        </p>

        <ul className="mt-4 space-y-3">
          <strong className="block text-black">Contact Details</strong>
          <li>hello@schoolride.com</li>
          <li>+254737973042</li>
          <li>
            Kilimani <br />
            Nairobi, Kenya
          </li>
        </ul>
      </div>

      {/* Right form */}
      <div className="flex-1">
        <form onSubmit={onSubmit} className="bg-white rounded-md p-4">
          <label className="block mb-1 font-medium">Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            required
            className="w-full bg-[#d7ebc3] p-3 mb-4 border-none outline-none rounded"
          />

          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter Phone No."
            required
            className="w-full bg-[#d7ebc3] p-3 mb-4 border-none outline-none rounded"
          />

          <label className="block mb-1 font-medium">Write Your Message</label>
          <textarea
            name="message"
            rows="6"
            placeholder="Enter Your Message"
            required
            className="w-full bg-[#d7ebc3] p-3 mb-4 border-none outline-none resize-none rounded"
          ></textarea>

          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Submit
          </button>
        </form>
        <span className="block mt-4 text-green-600 font-medium">{result}</span>
      </div>
    </div>
  );
}

