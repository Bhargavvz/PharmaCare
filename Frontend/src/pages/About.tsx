import React from 'react';
import { Heart, Shield, Users, ArrowRight, Award, Globe, Sparkles, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { number: '50K+', label: 'Active Users' },
  { number: '100K+', label: 'Medications Tracked' },
  { number: '25K+', label: 'Medicines Donated' },
  { number: '99.9%', label: 'Service Uptime' },
];

const values = [
  {
    icon: Heart,
    title: 'Patient-Centric Care',
    description: 'Empowering individuals with tools for better health management and accessibility.',
    theme: 'text-rose-600 bg-rose-50'
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Protecting your health data with robust security measures and strict privacy controls.',
    theme: 'text-teal-600 bg-teal-50'
  },
  {
    icon: Users,
    title: 'Community Wellbeing',
    description: 'Fostering a supportive community focused on collective health and responsible medication use.',
    theme: 'text-amber-600 bg-amber-50'
  },
];

const milestones = [
  {
    year: '2022',
    title: 'Foundation',
    description: 'PharmaCare+ was founded to revolutionize medication management and donation.',
  },
  {
    year: '2023',
    title: 'Platform Launch',
    description: 'Launched our integrated platform with pharmacy tools and patient features.',
  },
  {
    year: '2024',
    title: 'Growing Impact',
    description: 'Expanding our reach, adding advanced analytics and enhancing community features.',
  },
];

const team = [
  {
    name: 'Dr. Evelyn Reed',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Visionary leader with 15+ years in health tech and pharmacy operations.',
  },
  {
    name: 'Kenji Tanaka',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Expert in scalable platforms, data security, and healthcare software architecture.',
  },
  {
    name: 'Aisha Khan',
    role: 'Head of Pharmacy Relations',
    image: 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?auto=format&fit=crop&q=80&w=300&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Dedicated to building strong partnerships within the pharmacy community.',
  },
];

const achievements = [
  {
    icon: Award,
    title: 'Health Tech Innovator 2023',
    description: 'Recognized for outstanding innovation in digital pharmacy solutions.',
    theme: 'text-violet-600 bg-violet-50'
  },
  {
    icon: Globe,
    title: 'Community Impact Award',
    description: 'Awarded for significant contributions to medication accessibility.',
    theme: 'text-sky-600 bg-sky-50'
  },
  {
    icon: Sparkles,
    title: 'Top Pharmacy Platform',
    description: 'Voted leading platform by independent pharmacists for efficiency and features.',
    theme: 'text-emerald-600 bg-emerald-50'
  },
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - Teal/Emerald Gradient */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              About PharmaCare+
            </h1>
            <p className="text-xl text-teal-100 leading-relaxed">
              We are dedicated to bridging the gap between patients, pharmacies, and community health through intuitive technology and a commitment to accessibility.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section - Updated styling */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 border border-gray-100">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-teal-600">{stat.number}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section - Refined layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">Our Story</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            PharmaCare+ started with a vision to simplify medication management and foster a healthier, more connected community. We empower pharmacies and patients alike.
          </p>
        </div>

        {/* Milestones - Updated styling */}
        <div className="grid md:grid-cols-3 gap-8">
          {milestones.map((milestone) => (
            <div key={milestone.year} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-teal-600 mb-2">{milestone.year}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{milestone.title}</h3>
              <p className="text-sm text-gray-600">{milestone.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Values Section - Updated styling */}
      <div className="bg-gradient-to-b from-white to-teal-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide our decisions, shape our culture, and drive our mission forward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl shadow-lg border border-gray-100 text-center p-6 sm:p-8 transform hover:-translate-y-1 transition duration-300 ease-in-out">
                <div className={`inline-flex items-center justify-center h-14 w-14 rounded-full ${value.theme} mb-5`}>
                   <value.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section - Updated styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">Meet the Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our passionate team blends expertise in healthcare, technology, and community building.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-xl shadow-md border border-gray-100 text-center p-6 sm:p-8">
              <img
                src={member.image}
                alt={`Photo of ${member.name}`}
                className="w-28 h-28 rounded-full mx-auto mb-5 object-cover ring-4 ring-white shadow-sm"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm text-teal-600 font-medium mb-3">{member.role}</p>
              <p className="text-sm text-gray-500">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section - Updated styling */}
      <div className="bg-slate-100 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">Recognition & Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are proud of the milestones achieved and the recognition received for our work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement) => (
               <div key={achievement.title} className="bg-white rounded-xl shadow-sm border border-gray-100 text-center p-6 sm:p-8">
                 <div className={`inline-flex items-center justify-center h-14 w-14 rounded-full ${achievement.theme} mb-5`}>
                   <achievement.icon className="h-7 w-7" />
                 </div>
                 <h3 className="text-xl font-semibold text-gray-800 mb-3">{achievement.title}</h3>
                 <p className="text-sm text-gray-600 leading-relaxed">{achievement.description}</p>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action - Updated styling */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to enhance your pharmacy or manage your health?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-teal-100">
            Join PharmaCare+ today and experience the future of medication management.
          </p>
          <Link
            to="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-full shadow-md text-teal-600 bg-white hover:bg-teal-50 sm:w-auto transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Get Started Free
             <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;