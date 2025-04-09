import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

const posts = [
  {
    title: '5 Tips for Improving Medication Adherence',
    slug: 'medication-adherence-tips',
    excerpt: 'Sticking to your medication schedule is crucial. Here are practical tips to help you stay consistent and improve your health outcomes.',
    date: '2023-10-25',
    author: 'PharmaCare+ Health Team',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'The Impact of Medicine Donations',
    excerpt: 'How our community donation program is making healthcare more accessible for everyone.',
    date: '2024-03-10',
    author: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=500',
  },
  {
    title: 'Digital Health Revolution',
    excerpt: 'Exploring how technology is transforming healthcare management and patient outcomes.',
    date: '2024-03-05',
    author: 'Dr. Emily Rodriguez',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=500',
  },
];

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl mb-4">
            PharmaCare+ Insights
          </h1>
          <p className="mt-4 text-lg text-teal-100 max-w-3xl mx-auto">
            Stay updated with the latest news, health tips, and platform updates from our team.
          </p>
        </div>
      </div>

      {/* Blog Post Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 -mt-16 sm:-mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
               to={`/blog/${post.slug}`} 
               key={post.slug} 
               className="group bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <div className="flex-shrink-0">
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-300"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                 <div className="flex items-center text-gray-500 text-xs mb-3">
                   <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                   <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                   <span className="mx-2">|</span>
                   <span >By {post.author}</span>
                 </div>
                 <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors duration-200">
                    {post.title}
                 </h2>
                 <p className="text-sm text-gray-600 mb-4 flex-grow">
                   {post.excerpt}
                 </p>
                 <div className="mt-auto">
                   <span className="inline-flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700">
                     Read More
                     <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
                   </span>
                 </div>
               </div>
             </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;