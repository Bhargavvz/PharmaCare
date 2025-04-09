import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import NotFound from './NotFound'; // Assuming NotFound component exists for handling invalid slugs

// TEMPORARY: Ideally, fetch posts from an API or import from a shared data source.
// Make sure slugs here match the ones used in Blog.tsx links.
// NOTE: Added full HTML content for the first post and placeholder slugs/content for others.
const posts = [
  {
    title: '5 Tips for Improving Medication Adherence',
    slug: 'medication-adherence-tips',
    excerpt: 'Sticking to your medication schedule is crucial. Here are practical tips to help you stay consistent and improve your health outcomes.',
    date: '2023-10-25',
    author: 'PharmaCare+ Health Team',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Higher res image
    // Example HTML content - Use Tailwind prose classes for styling
    content: `
      <p class="lead mb-6">Maintaining consistent medication adherence is fundamental to managing chronic conditions and achieving the best possible health outcomes. However, juggling multiple prescriptions, complex schedules, and daily life can make it challenging. Here are five practical tips to help you stay on track:</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">1. Establish a Routine</h2>
      <p>Integrate taking your medication into your daily habits. Link it to activities you already do consistently, like brushing your teeth, eating breakfast, or preparing for bed. Setting daily alarms or using a pill organizer can also provide helpful structure.</p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">2. Use Reminder Tools</h2>
      <p>Leverage technology! Use smartphone apps (like PharmaCare+!), calendar alerts, or smart home devices to set reminders for each dose. Visual cues, such as placing your pillbox in a visible spot, can also be effective.</p>
      <figure class="mt-6 mb-6">
        <img src="https://images.unsplash.com/photo-1607619056574-7484ec7f907b?auto=format&fit=crop&q=80&w=800" alt="Pill organizer" class="rounded-lg shadow-md mx-auto" />
        <figcaption class="text-center text-sm text-gray-500 mt-2">Using a pill organizer can simplify weekly medication management.</figcaption>
      </figure>

      <h2 class="text-2xl font-semibold mt-8 mb-4">3. Organize Your Medications</h2>
      <p>A pill organizer sorted weekly or monthly can simplify managing multiple medications. Ensure prescriptions are refilled in advance to avoid running out. Keep an updated list of all your medications, including dosage and frequency, and share it with your healthcare providers during appointments.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">4. Understand Your Treatment</h2>
      <p>Talk to your doctor or pharmacist about why each medication is important, how it works, and potential side effects. Knowing the benefits and purpose of your treatment plan can strengthen your motivation to adhere to it. Don't be afraid to ask questions until you feel confident.</p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">5. Communicate with Your Doctor</h2>
      <p>If you're struggling with adherence due to side effects, cost, or a complex regimen, don't hesitate to speak with your healthcare provider. They may be able to adjust your dosage, suggest more affordable alternatives, simplify your schedule, or provide resources to help overcome barriers.</p>
      
      <p class="mt-8">By implementing these strategies, you can significantly improve your medication adherence, leading to better health management and overall well-being. Remember, consistency is key!</p>
    `
  },
   {
    title: 'The Impact of Medicine Donations',
    // *** Ensure this slug matches the one in Blog.tsx ***
    slug: 'impact-of-medicine-donations', // Placeholder - ensure this is unique and correct
    excerpt: 'How our community donation program is making healthcare more accessible for everyone.',
    date: '2024-03-10',
    author: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1200', // Higher res image
    // *** Add actual HTML content here ***
    content: '<p>Medicine donation programs play a vital role in bridging healthcare gaps, providing essential treatments to underserved populations and reducing medication waste. Our platform facilitates this by connecting donors with verified non-profits...</p> <h2 class="text-2xl font-semibold mt-8 mb-4">How it Works</h2> <p>Learn about the simple steps to donate medication safely through PharmaCare+...</p>'
  },
  {
    title: 'Digital Health Revolution',
    // *** Ensure this slug matches the one in Blog.tsx ***
    slug: 'digital-health-revolution', // Placeholder - ensure this is unique and correct
    excerpt: 'Exploring how technology is transforming healthcare management and patient outcomes.',
    date: '2024-03-05',
    author: 'Dr. Emily Rodriguez',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200', // Higher res image
     // *** Add actual HTML content here ***
    content: '<p>The advent of digital technology is reshaping the healthcare landscape, empowering patients with tools for better self-management and providing clinicians with valuable data insights. From telehealth consultations to AI-driven diagnostics...</p> <h2 class="text-2xl font-semibold mt-8 mb-4">Benefits for Patients</h2> <p>Explore how apps like PharmaCare+ enhance patient engagement and adherence...</p>'
  },
];


const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Post Header */}
      <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="absolute inset-0 opacity-10">
            {/* Optional subtle background pattern or image */}
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <Link to="/blog" className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-800 mb-6 transition-colors">
             <ArrowLeft className="h-4 w-4 mr-1.5" />
             Back to All Posts
           </Link>
           <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl mb-4">{post.title}</h1>
           <div className="flex items-center justify-center text-gray-500 text-sm space-x-4">
             <span className="inline-flex items-center">
               <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
               {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
             </span>
             <span className="inline-flex items-center">
               <User className="h-4 w-4 mr-1.5 text-gray-400" />
               By {post.author}
             </span>
           </div>
        </div>
      </div>

       {/* Featured Image */}
       <div className="aspect-w-16 aspect-h-7 -mt-12 sm:-mt-16 relative z-10 max-w-5xl mx-auto">
           <img 
              src={post.image} 
              alt={`Featured image for ${post.title}`} 
              className="w-full h-full object-cover rounded-xl shadow-lg border-4 border-white" 
            />
       </div>


      {/* Post Content Area */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
         <article 
           className="prose prose-lg lg:prose-xl prose-slate mx-auto"
           // Renders the HTML string from post.content.
           // WARNING: Ensure the source of this HTML is trusted or properly sanitized in a real application
           // to prevent XSS attacks.
           dangerouslySetInnerHTML={{ __html: post.content }} 
         />
      </div>
    </div>
  );
};

export default BlogPost;
