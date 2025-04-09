import React from 'react';

// Helper component for sections
const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h2>
    <div className="space-y-3 text-gray-600 leading-relaxed">
      {children}
    </div>
  </section>
);

const PrivacyPolicy: React.FC = () => {
  // Update date dynamically or manually
  const lastUpdatedDate = "October 26, 2023"; // Example Date

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-teal-100">
            Last updated: {lastUpdatedDate}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-10">
          
          <PolicySection title="Introduction">
            <p>
              Welcome to PharmaCare+ ("we," "us," or "our"). We are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your personal 
              information when you use our website, mobile application, and services (collectively, the "Service"). 
              Please read this policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the Service.
            </p>
          </PolicySection>

          <PolicySection title="Information We Collect">
            <p>We may collect information about you in a variety of ways. The information we may collect via the Service includes:</p>
            <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">Personal Data</h3>
            <p>
              Personally identifiable information, such as your name, email address, phone number, 
              date of birth, and demographic information (like age, gender), that you voluntarily 
              give to us when you register with the Service or when you choose to participate in 
              various activities related to the Service.
            </p>
            <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">Health Information</h3>
            <p>
              Information related to your health, including medications you take, medical conditions, 
              allergies, prescription details, adherence data, and information you choose to share about 
              donated medications. For Pharmacies, this includes inventory data, sales data, and donation records.
            </p>
             <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">Derivative Data</h3>
             <p>
               Information our servers automatically collect when you access the Service, such as your IP address, 
               browser type, operating system, access times, and the pages you have viewed directly before 
               and after accessing the Service. If using our mobile application, this may also include device name 
               and type, operating system, phone number, country, and interactions with the application.
             </p>
          </PolicySection>

          <PolicySection title="How We Use Your Information">
            <p>Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
            <ul className="list-disc list-outside space-y-2 pl-5">
              <li>Create and manage your account.</li>
              <li>Provide the core functionalities of the Service (e.g., medication reminders, inventory management, donation facilitation).</li>
              <li>Email you regarding your account or order.</li>
              <li>Generate personalized health insights and reports (for applicable plans).</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
              <li>Notify you of updates to the Service.</li>
              <li>Offer new products, services, and/or recommendations to you (with opt-out options).</li>
              <li>Perform other business activities as needed.</li>
              <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
              <li>Resolve disputes and troubleshoot problems.</li>
              <li>Respond to product and customer service requests.</li>
            </ul>
          </PolicySection>
          
          <PolicySection title="Disclosure of Your Information">
             <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
             <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">By Law or to Protect Rights</h3>
             <p>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</p>
              <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">Third-Party Service Providers</h3>
              <p>We may share your information with third parties that perform services for us or on our behalf, including data analysis, hosting services, customer service, and marketing assistance. These providers will only have access to the information necessary to perform their functions.</p>
              {/* Add sections for Business Transfers, Affiliates, etc., if applicable */}
              <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">With Your Consent</h3>
              <p>We may disclose your personal information for any other purpose with your consent.</p>
           </PolicySection>

          <PolicySection title="Data Security">
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. 
              While we have taken reasonable steps to secure the personal information you provide to us, please be aware 
              that despite our efforts, no security measures are perfect or impenetrable, and no method of data 
              transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </PolicySection>

          <PolicySection title="Your Privacy Rights">
             <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict the processing of your data. Please contact us using the information below to exercise these rights.</p>
          </PolicySection>

          <PolicySection title="Contact Us">
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
              <br />
              PharmaCare+ Privacy Team
              <br />
              <a href="mailto:privacy@pharmacareplus.com" className="text-teal-600 hover:underline">privacy@pharmacareplus.com</a>
              {/* Add physical address if applicable */}
            </p>
          </PolicySection>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;