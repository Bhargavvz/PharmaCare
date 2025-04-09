import React from 'react';

// Re-use the PolicySection component helper from Privacy Policy styling
const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h2>
    <div className="space-y-3 text-gray-600 leading-relaxed">
      {children}
    </div>
  </section>
);

const TermsOfService: React.FC = () => {
  const lastUpdatedDate = "October 26, 2023"; // Example Date

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
       <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white pt-16 pb-12 sm:pt-20 sm:pb-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
             Terms of Service
           </h1>
           <p className="mt-2 text-sm text-teal-100">
             Last updated: {lastUpdatedDate}
           </p>
         </div>
       </div>

      {/* Main Content */}
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
         <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-10">

          <PolicySection title="1. Acceptance of Terms">
            <p>
              Welcome to PharmaCare+ ("we," "us," or "our"). By accessing or using our Service 
              (including website, mobile application, and related features), you agree to be bound by these 
              Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, 
              do not use the Service.
            </p>
          </PolicySection>

          <PolicySection title="2. Description of Service">
            <p>
              PharmaCare+ provides a platform designed to help patients manage their medications and 
              facilitate communication and operations for pharmacies, including features for medication tracking, 
              reminders, inventory management, billing (for pharmacies), and medicine donation coordination. 
              The specific features available may depend on your account type and subscription plan.
            </p>
             <p>
               We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) 
               at any time with or without notice. We will not be liable to you or any third party for 
               any modification, suspension, or discontinuation of the Service.
             </p>
          </PolicySection>

          <PolicySection title="3. User Accounts & Responsibilities">
             <p>To access certain features, you must register for an account. You agree to:</p>
             <ul className="list-disc list-outside space-y-2 pl-5">
               <li>Provide accurate, current, and complete information during registration and keep it updated.</li>
               <li>Maintain the security and confidentiality of your account password.</li>
               <li>Notify us immediately of any unauthorized use of your account.</li>
               <li>Accept responsibility for all activities that occur under your account.</li>
               <li>Use the Service in compliance with all applicable local, state, national, and international laws and regulations.</li>
               <li>Not use the Service for any illegal or unauthorized purpose.</li>
                <li>(For Pharmacies) Ensure compliance with all pharmacy regulations regarding data handling, dispensing, and record-keeping.</li>
             </ul>
          </PolicySection>

           <PolicySection title="4. Medicine Donation Feature">
             <p>The medicine donation feature facilitates connection between potential donors and registered pharmacies. PharmaCare+ does not handle medications directly.</p>
             <ul className="list-disc list-outside space-y-2 pl-5">
                <li>Users listing medications for donation are responsible for ensuring they are unexpired and appropriately stored.</li>
                <li>Pharmacies accepting donations are responsible for verifying medication suitability and complying with all regulations regarding acceptance and potential redistribution.</li>
                <li>PharmaCare+ is not liable for the condition, legality, or handling of donated medications.</li>
             </ul>
           </PolicySection>

          <PolicySection title="5. Intellectual Property">
             <p>The Service and its original content, features, and functionality are owned by PharmaCare+ and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
          </PolicySection>

          <PolicySection title="6. Disclaimers">
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, 
              express or implied, regarding the Service, including but not limited to its accuracy, 
              reliability, or suitability for a particular purpose. PharmaCare+ does not provide medical advice. 
              Always consult with a qualified healthcare professional for any health concerns or before making 
              any decisions related to your health or treatment.
            </p>
          </PolicySection>

          <PolicySection title="7. Limitation of Liability">
            <p>
              To the fullest extent permitted by applicable law, PharmaCare+ shall not be liable for 
              any indirect, incidental, special, consequential, or punitive damages, or any loss of profits 
              or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, 
              or other intangible losses, resulting from (a) your access to or use of or inability to 
              access or use the service; (b) any conduct or content of any third party on the service; 
              or (c) unauthorized access, use, or alteration of your transmissions or content.
            </p>
          </PolicySection>

          <PolicySection title="8. Governing Law">
             <p>These Terms shall be governed and construed in accordance with the laws of [Your State/Country, e.g., the State of California], without regard to its conflict of law provisions.</p>
          </PolicySection>

           <PolicySection title="9. Changes to Terms">
             <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
           </PolicySection>

          <PolicySection title="10. Contact Us">
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
               <a href="mailto:legal@pharmacareplus.com" className="text-teal-600 hover:underline">legal@pharmacareplus.com</a>
            </p>
          </PolicySection>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;