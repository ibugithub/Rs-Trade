'use client';
import Image from 'next/image';
import { useState } from 'react';

export const  Contact = () => {
  const [email, setEmail] = useState('');
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  const handleSubmit = () => {
    // Handle newsletter subscription logic here
    console.log('Email submitted:', email);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 pt-16">
      {/* Contact Section */}
      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left side with contact information */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-8 lg:mb-0">
              {/* Expert advice */}
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600 mb-1">Expert advice</p>
                <p className="text-2xl font-semibold text-gray-800">123-456-7890</p>
              </div>
              
              {/* Customer service */}
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600 mb-1">Customer service</p>
                <p className="text-2xl font-semibold text-gray-800">1-222-345-6789</p>
              </div>
              
              {/* Have any questions? */}
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600 mb-1">Have any questions?</p>
                <p className="text-2xl font-semibold text-gray-800 cursor-pointer hover:underline">Contact us</p>
              </div>
            </div>
            
            {/* Right side with team image */}
            <div className="flex justify-center">
              <Image
                width={200}
                height={200}
                src="/images/contactImage.png" 
                alt="Support team"
                className="h-32 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left side with newsletter info */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12 mb-6 lg:mb-0">
              {/* Newsletter icon and title */}
              <div className="flex items-center">
                <div className="text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">Subscribe to</h3>
                  <p className="text-xl font-semibold text-gray-800">our newsletter</p>
                </div>
              </div>
              
              {/* Newsletter description */}
              <div className="text-center lg:text-left">
                <p className="text-gray-600">Sign up for all the latest news</p>
                <p className="text-gray-600">and special offers</p>
              </div>
            </div>
            
            {/* Right side with subscription form */}
            <div className="w-full lg:w-2/5">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={handleEmailChange}
                  className="flex-grow px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <button 
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}