import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, QrCode, Heart, LineChart, Shield, Users, Smartphone, Gift, ChevronRight, CheckCircle } from 'lucide-react';

// Define theme colors (can be reused or defined locally)
const themes = {
  teal: { iconBg: 'bg-teal-100', iconText: 'text-teal-600', activeBg: 'bg-teal-600', hoverBg: 'hover:bg-teal-50', bulletBg: 'bg-teal-500', borderHover: 'hover:border-teal-300' },
  emerald: { iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', activeBg: 'bg-emerald-600', hoverBg: 'hover:bg-emerald-50', bulletBg: 'bg-emerald-500', borderHover: 'hover:border-emerald-300' },
  sky: { iconBg: 'bg-sky-100', iconText: 'text-sky-600', activeBg: 'bg-sky-600', hoverBg: 'hover:bg-sky-50', bulletBg: 'bg-sky-500', borderHover: 'hover:border-sky-300' },
  violet: { iconBg: 'bg-violet-100', iconText: 'text-violet-600', activeBg: 'bg-violet-600', hoverBg: 'hover:bg-violet-50', bulletBg: 'bg-violet-500', borderHover: 'hover:border-violet-300' },
  amber: { iconBg: 'bg-amber-100', iconText: 'text-amber-600', activeBg: 'bg-amber-600', hoverBg: 'hover:bg-amber-50', bulletBg: 'bg-amber-500', borderHover: 'hover:border-amber-300' },
  rose: { iconBg: 'bg-rose-100', iconText: 'text-rose-600', activeBg: 'bg-rose-600', hoverBg: 'hover:bg-rose-50', bulletBg: 'bg-rose-500', borderHover: 'hover:border-rose-300' },
  cyan: { iconBg: 'bg-cyan-100', iconText: 'text-cyan-600', activeBg: 'bg-cyan-600', hoverBg: 'hover:bg-cyan-50', bulletBg: 'bg-cyan-500', borderHover: 'hover:border-cyan-300' },
  orange: { iconBg: 'bg-orange-100', iconText: 'text-orange-600', activeBg: 'bg-orange-600', hoverBg: 'hover:bg-orange-50', bulletBg: 'bg-orange-500', borderHover: 'hover:border-orange-300' },
};

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  benefits: string[];
  theme: typeof themes[keyof typeof themes]; // Use defined theme type
}

// Assign themes to features
const features: Feature[] = [
  {
    id: 1, title: 'Smart Reminders', description: 'Never miss a dose with customizable schedules and intelligent alerts.', 
    icon: Bell, theme: themes.sky,
    benefits: ['Customizable schedules', 'Smart notifications', 'Adherence tracking'] 
  },
  {
    id: 2, title: 'QR Prescriptions', description: 'Easily scan, store, and manage your prescriptions digitally.', 
    icon: QrCode, theme: themes.violet,
    benefits: ['Instant scanning', 'Digital storage', 'Easy sharing with pharmacy']
  },
  {
    id: 3, title: 'Medicine Donation', description: 'Safely donate unused medication to those in need within the community.', 
    icon: Heart, theme: themes.rose,
    benefits: ['Secure donation platform', 'Verified recipient organizations', 'Track your impact']
  },
  {
    id: 4, title: 'Real-time Tracking', description: 'Monitor medication intake, inventory levels, and view adherence history.', 
    icon: LineChart, theme: themes.emerald,
    benefits: ['Detailed intake history', 'Low stock alerts', 'Usage analytics & reports']
  },
  {
    id: 5, title: 'Secure Platform', description: 'Your health data is protected with end-to-end encryption and compliance.', 
    icon: Shield, theme: themes.teal,
    benefits: ['End-to-end encryption', 'HIPAA/GDPR compliant options', 'Regular security audits']
  },
  {
    id: 6, title: 'Family Management', description: 'Oversee medications and schedules for multiple family members or dependents.', 
    icon: Users, theme: themes.amber,
    benefits: ['Multiple user profiles', 'Caregiver access controls', 'Shared medication history']
  },
  {
    id: 7, title: 'Mobile App Access', description: 'Access all features on the go with our intuitive mobile application.', 
    icon: Smartphone, theme: themes.cyan,
    benefits: ['iOS & Android compatible', 'Offline access capabilities', 'Seamless cloud synchronization']
  },
  {
    id: 8, title: 'Rewards Program', description: 'Earn points for consistent medication adherence and participation.', 
    icon: Gift, theme: themes.orange,
    benefits: ['Points for adherence milestones', 'Rewards for donations', 'Exclusive partner discounts']
  }
];

const HomeFeatures: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 
            id="features-heading"
            className="text-base text-teal-600 font-semibold tracking-wide uppercase"
          >
            How We Help
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Simplify Your Medication Management
          </p>
          <p className="mt-4 max-w-3xl text-lg text-gray-600 mx-auto">
            PharmaCare+ provides a comprehensive suite of tools designed to make managing health simpler and more effective for everyone involved.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group relative bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ease-in-out ${feature.theme.borderHover} hover:shadow-lg hover:scale-[1.03]`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`inline-flex p-3 rounded-lg ${feature.theme.iconBg} transition-colors duration-300 group-hover:${feature.theme.activeBg}`}>
                  <feature.icon className={`h-6 w-6 ${feature.theme.iconText} transition-colors duration-300 group-hover:text-white`} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">{feature.title}</h3>
              </div>

              <p className="text-sm text-gray-600 mb-4 h-20 overflow-hidden">
                {feature.description}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-screen transition-all duration-500 ease-in-out overflow-hidden">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Benefits:</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className={`flex-shrink-0 h-4 w-4 ${feature.theme.iconText} mt-0.5`} />
                      <span className="text-xs text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={`absolute bottom-0 left-0 h-1 w-full rounded-b-xl ${feature.theme.activeBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            to="/features"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700 transition-colors duration-200"
          >
            Explore All Features in Detail
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;