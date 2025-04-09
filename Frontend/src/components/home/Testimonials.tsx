import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Thompson',
    role: 'Patient',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    content: 'PharmaCare+ has simplified my life! The reminders are spot-on, and tracking my meds is effortless. Highly recommend!',
  },
  {
    name: 'City Pharmacy',
    role: 'Pharmacy Owner',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200',
    content: 'Inventory management and billing are so much easier with PharmaCare+. It saves us time and helps us serve patients better.',
  },
  {
    name: 'David Chen',
    role: 'Caregiver',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    content: 'Managing my father\'s medications used to be stressful. This app makes it straightforward, and the family sharing is perfect.',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Patients and Pharmacies
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Hear from those who benefit from PharmaCare+ every day.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-center text-center transform transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <Quote className="h-8 w-8 text-teal-300 mb-4" />
              <p className="text-gray-600 italic mb-6 flex-grow">"{testimonial.content}"</p>
              <img
                src={testimonial.image}
                alt={`Photo of ${testimonial.name}`}
                className="w-16 h-16 rounded-full mb-3 object-cover ring-4 ring-white shadow-sm"
              />
              <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
              <p className="text-sm text-teal-600 font-medium">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;