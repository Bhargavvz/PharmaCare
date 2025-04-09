import React from 'react';
import { Bell, QrCode, Heart, LineChart, Shield, Users, Smartphone, Gift, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Feature {
  name: string;
  description: string;
  icon: React.ElementType;
  theme: {
    iconBg: string;
    iconText: string;
    bulletBg: string;
  };
  benefits: string[];
  details: string;
}

const themes = {
  teal: { iconBg: 'bg-teal-100', iconText: 'text-teal-600', bulletBg: 'bg-teal-500' },
  emerald: { iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', bulletBg: 'bg-emerald-500' },
  sky: { iconBg: 'bg-sky-100', iconText: 'text-sky-600', bulletBg: 'bg-sky-500' },
  violet: { iconBg: 'bg-violet-100', iconText: 'text-violet-600', bulletBg: 'bg-violet-500' },
  amber: { iconBg: 'bg-amber-100', iconText: 'text-amber-600', bulletBg: 'bg-amber-500' },
  rose: { iconBg: 'bg-rose-100', iconText: 'text-rose-600', bulletBg: 'bg-rose-500' },
  cyan: { iconBg: 'bg-cyan-100', iconText: 'text-cyan-600', bulletBg: 'bg-cyan-500' },
  orange: { iconBg: 'bg-orange-100', iconText: 'text-orange-600', bulletBg: 'bg-orange-500' },
};

const features: Feature[] = [
  {
    name: 'Smart Reminders',
    description: 'Never miss a dose with our intelligent reminder system that adapts to your schedule.',
    icon: Bell,
    theme: themes.sky,
    benefits: [
      'Customizable reminder schedules',
      'Smart notification system',
      'Multiple reminder methods (push, SMS, email)',
      'Medication adherence tracking'
    ],
    details: 'Our AI-powered reminder system learns from your habits and schedule to send notifications at the most effective times. Set up custom schedules, get notifications across multiple devices, and maintain perfect medication adherence.'
  },
  {
    name: 'QR Prescriptions',
    description: 'Scan and manage prescriptions easily with our QR code system.',
    icon: QrCode,
    theme: themes.violet,
    benefits: [
      'Instant prescription scanning',
      'Digital prescription storage',
      'Easy medication information access',
      'Share prescriptions with healthcare providers'
    ],
    details: 'Simply scan your prescription using our mobile app to digitize and store it securely. Access your prescription history anytime, anywhere, and easily share them with healthcare providers when needed.'
  },
  {
    name: 'Medicine Donation',
    description: 'Contribute to community health by donating unused medicines safely.',
    icon: Heart,
    theme: themes.rose,
    benefits: [
      'Safe medicine donation process',
      'Verified recipient organizations',
      'Impact tracking',
      'Tax deduction receipts'
    ],
    details: 'Make a difference in your community by safely donating unused medicines. We partner with verified NGOs and healthcare organizations to ensure your donations reach those in need, while providing you with tax deduction receipts.'
  },
  {
    name: 'Real-time Tracking',
    description: 'Monitor your medication intake and inventory with detailed analytics.',
    icon: LineChart,
    theme: themes.emerald,
    benefits: [
      'Detailed medication history',
      'Inventory management',
      'Usage analytics',
      'Exportable reports'
    ],
    details: 'Keep track of your medication inventory in real-time, view detailed analytics about your medication adherence, and generate comprehensive reports for your healthcare providers.'
  },
  {
    name: 'Secure Platform',
    description: 'Your health data is protected with enterprise-grade security.',
    icon: Shield,
    theme: themes.teal,
    benefits: [
      'End-to-end encryption',
      'HIPAA compliance (or relevant standard)',
      'Regular security audits',
      'Data backup and recovery'
    ],
    details: 'Your health data is protected with enterprise-grade security measures. We use end-to-end encryption, maintain relevant compliance standards, and conduct regular security audits to ensure your information stays private and secure.'
  },
  {
    name: 'Family Management',
    description: 'Manage medications for your entire family in one place.',
    icon: Users,
    theme: themes.amber,
    benefits: [
      'Multiple user profiles',
      'Role-based access control',
      'Family sharing features',
      'Caregiver support'
    ],
    details: 'Create profiles for family members, set up role-based access for caregivers, and manage everyone\'s medications in one place. Perfect for families and caregivers managing multiple medication schedules.'
  },
  {
    name: 'Mobile App',
    description: 'Access your medication information anywhere with our mobile app.',
    icon: Smartphone,
    theme: themes.cyan,
    benefits: [
      'iOS and Android support',
      'Offline access capabilities',
      'Cloud synchronization',
      'Intuitive user interface'
    ],
    details: 'Take PharmaCare+ with you wherever you go with our mobile app. Access your medication information offline, sync data across devices, and enjoy a user-friendly interface designed for ease of use.'
  },
  {
    name: 'Rewards Program',
    description: 'Earn points for medication adherence and donations.',
    icon: Gift,
    theme: themes.orange,
    benefits: [
      'Points for adherence milestones',
      'Donation rewards points',
      'Exclusive partner discounts',
      'Redeemable health benefits'
    ],
    details: 'Get rewarded for taking care of your health! Earn points for medication adherence and donations, then redeem them for partner discounts and other valuable benefits.'
  }
];

const Features: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-teal-50 via-white to-emerald-50 min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Powerful Features for Better Health
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Discover all the ways PharmaCare+ helps you manage medications effectively and contribute to community wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start sm:items-center mb-5 sm:mb-6">
                  <div className={`flex-shrink-0 p-3 rounded-xl ${feature.theme.iconBg}`}>
                    <feature.icon className={`h-7 w-7 sm:h-8 sm:w-8 ${feature.theme.iconText}`} aria-hidden="true" />
                  </div>
                  <h3 className="ml-4 text-xl sm:text-2xl font-semibold text-gray-900">{feature.name}</h3>
                </div>
                
                <p className="text-base text-gray-600 mb-6 leading-relaxed">{feature.details}</p>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className={`flex-shrink-0 h-4 w-4 ${feature.theme.iconText} mr-2.5`} aria-hidden="true" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20 text-center">
          <Link
            to="/signup"
            className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-base font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg active:from-teal-700 active:to-teal-800 focus-visible:outline-teal-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;