import Image from "next/image";


export const Hero = () => {
  return (
    <div className="relative w-full bg-gray-100 py-12 overflow-hidden">
      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          <div className="w-full md:w-3/5 relative h-64 md:h-96">
            <Image
              src="/images/heroImage.jpg"
              alt="Hero Image"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right side content */}
          <div className="w-full md:w-2/5 bg-white p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center mr-1">
                <span className="text-blue-500 font-bold">Rs</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-4xl font-bold text-gray-800 mb-4">
              The best electronic accessories are here!
            </h1>

            <p className="text-gray-600 mb-6">
              Sit diam odio eget rhoncus volutpat est nibh velit posuere egestas.
            </p>

            <button className="text-blue-500 font-medium hover:text-blue-700 transition-colors">
              Shop now
            </button>
          </div>
        </div>
      </div>

      {/* Features bar at bottom */}
      <div className="max-w-7xl mx-auto mt-16 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Free shipping */}
          <div className="p-6 flex items-center border-b md:border-r md:border-b-0 border-gray-200">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Free shipping</h3>
              <p className="text-sm text-gray-500">When you spend $80 or more</p>
            </div>
          </div>

          {/* 24/7 support */}
          <div className="p-6 flex items-center border-b lg:border-r lg:border-b-0 border-gray-200">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">We are available 24/7</h3>
              <p className="text-sm text-gray-500">Need help? contact us anytime</p>
            </div>
          </div>

          {/* Satisfied or return */}
          <div className="p-6 flex items-center border-b md:border-b-0 md:border-r border-gray-200">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Satisfied or return</h3>
              <p className="text-sm text-gray-500">Easy 30-day return policy</p>
            </div>
          </div>

          {/* Secure payments */}
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">100% secure payments</h3>
              <p className="text-sm text-gray-500">Visa, Mastercard, Stripe, PayPal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};