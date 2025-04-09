import React, { useState } from 'react';
import { Plus, Minus, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I get started with PharmaCare+?',
    answer: 'Getting started is easy! Sign up for either a Patient or Pharmacy account, add relevant details (medications or pharmacy info), and explore the dashboard. Our intuitive interface will guide you.',
  },
  {
    question: 'Is my medical information secure?',
    answer: 'Yes, security is our top priority. All data is encrypted using industry-standard protocols, and we adhere to strict privacy regulations (like HIPAA where applicable) to protect your information.',
  },
  {
    question: 'How does the medicine donation feature work?',
    answer: 'Patients can list unused, unexpired medications for donation. Participating pharmacies can view and accept these donations, coordinating pickup or drop-off according to local guidelines.',
  },
  {
    question: 'Can patients manage medications for family members?',
    answer: 'Yes, our Patient Pro plan allows you to create and manage profiles for family members, making it easier for caregivers to track multiple schedules.',
  },
  {
    question: 'How does a pharmacy register?',
    answer: 'Pharmacies can register through the dedicated Pharmacy Signup page. You\'ll need to provide pharmacy details and create an administrator account.',
  },
  {
    question: 'What reporting features are available for pharmacies?',
    answer: 'Pharmacies have access to inventory reports (low stock, expiring soon), sales analytics, and donation tracking to help manage operations efficiently.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl mb-4">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-teal-100 max-w-3xl mx-auto">
            Find answers to common questions about using PharmaCare+ for patients and pharmacies.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h2>
                <button
                  type="button"
                  className="flex justify-between items-center w-full p-5 sm:p-6 text-left text-gray-700 hover:bg-slate-50 focus:outline-none focus-visible:ring focus-visible:ring-teal-500 focus-visible:ring-opacity-75"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span className="text-base font-medium">{faq.question}</span>
                  <ChevronDown 
                     className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
              </h2>
              <div
                 id={`faq-panel-${index}`}
                 className={`px-5 sm:px-6 pb-5 text-sm text-gray-600 leading-relaxed ${openIndex === index ? 'block' : 'hidden'}`}
               >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;