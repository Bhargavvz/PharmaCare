import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-10 sm:py-16 md:py-20 md:px-12 lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-grow">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to take control?</span>
                <span className="block text-teal-100 mt-1">Join PharmaCare+ today and simplify your health journey.</span>
              </h2>
              <p className="mt-4 text-lg text-teal-200">
                Sign up now for easy medication management, reminders, and pharmacy tools.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:flex-shrink-0 lg:ml-10">
              <Link
                to="/signup"
                className="group w-full inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-full shadow-md text-teal-600 bg-white hover:bg-teal-50 sm:w-auto transition duration-300 ease-in-out transform hover:-translate-y-0.5"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;