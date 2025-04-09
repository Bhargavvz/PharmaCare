import React from 'react';
  import { Check, ArrowRight, Building2, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Patient Basic',
    icon: User,
    price: 'Free',
    description: 'Manage your own medications effectively.',
    features: [
      'Medication tracking & history',
      'Customizable reminders',
      'Basic adherence reports',
      'Secure data storage',
    ],
    buttonLabel: 'Get Started',
    buttonLink: '/signup',
    theme: {
      primary: 'teal',
      accentText: 'text-teal-600',
      accentBg: 'bg-teal-50',
      buttonOutline: 'ring-teal-500 text-teal-600 hover:bg-teal-50 focus-visible:ring-teal-300'
    }
  },
  {
    name: 'Patient Pro',
    icon: Users,
    price: '$4.99',
    period: 'month',
    description: 'Ideal for families and caregivers.',
    features: [
      'Everything in Basic',
      'Manage multiple profiles',
      'Share data with caregivers/doctors',
      'Advanced analytics & insights',
      'Medication interaction checker',
      'Priority email support',
    ],
    popular: true,
    buttonLabel: 'Upgrade to Pro',
    buttonLink: '/signup?plan=pro',
    theme: {
      primary: 'emerald',
      accentText: 'text-emerald-600',
      accentBg: 'bg-emerald-50',
      buttonGradient: 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus-visible:outline-emerald-600',
    }
  },
  {
    name: 'Pharmacy Suite',
    icon: Building2,
    price: 'Custom',
    description: 'Comprehensive tools for pharmacies.',
    features: [
      'Patient management portal',
      'Inventory tracking & alerts',
      'Billing and reporting tools',
      'Donation management features',
      'Staff accounts & permissions',
      'Dedicated account manager',
    ],
    buttonLabel: 'Contact Sales',
    buttonLink: '/contact?reason=pharmacy',
    theme: {
      primary: 'sky',
      accentText: 'text-sky-600',
      accentBg: 'bg-sky-50',
      buttonOutline: 'ring-sky-500 text-sky-600 hover:bg-sky-50 focus-visible:ring-sky-300'
    }
  },
];

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white pt-16 pb-24 sm:pt-20 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-teal-100 max-w-3xl mx-auto">
            Choose the PharmaCare+ plan that fits your needs, whether you're managing your own health, your family's, or running a pharmacy.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 -mt-16 sm:-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col ${plan.popular ? 'ring-2 ring-emerald-500 scale-105 z-10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-4 -translate-y-1/2 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold shadow">
                  Most Popular
                </div>
              )}
              <div className="p-6 sm:p-8 flex-grow">
                <div className="flex items-center mb-5">
                  <div className={`inline-flex p-3 rounded-lg ${plan.theme.accentBg}`}>
                    <plan.icon className={`h-6 w-6 ${plan.theme.accentText}`} aria-hidden="true" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">{plan.name}</h3>
                </div>

                <div className="mt-4 mb-3">
                  <span className={`text-4xl font-bold ${plan.theme.accentText}`}>{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm font-medium text-gray-500">/ {plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-6 h-10">{plan.description}</p>

                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className={`flex-shrink-0 h-5 w-5 ${plan.theme.accentText} mr-2 mt-0.5`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 sm:p-8 bg-gray-50 rounded-b-xl mt-auto">
                <Link
                  to={plan.buttonLink}
                  className={`w-full group inline-flex items-center justify-center rounded-md py-3 px-6 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 transition duration-300 ease-in-out transform hover:-translate-y-px ${plan.theme.buttonGradient
                      ? `bg-gradient-to-r ${plan.theme.buttonGradient} text-white shadow hover:shadow-md focus-visible:outline-${plan.theme.primary}-600`
                      : `bg-transparent ring-1 ring-inset ${plan.theme.buttonOutline} focus-visible:outline-${plan.theme.primary}-600`
                  }`}
                >
                  {plan.buttonLabel}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;