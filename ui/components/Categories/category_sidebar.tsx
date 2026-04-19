'use client'

import { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';

export const Sidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    departments: true,
    customerReviews: true,
    priceRange: true,
    brands: true,
    deals: true
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Render stars for ratings
  const renderStars = (count) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i}
        size={16}
        className={i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  return (
    <div className="w-64 text-sm border-r border-gray-200 px-8 py-4 pb-6">
      {/* Department Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('departments')}
          className="flex items-center justify-between w-full font-bold text-left mb-2"
        >
          Department
          {expandedSections.departments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {expandedSections.departments && (
          <ul className="space-y-2 pl-2">
            <li className=" hover:text-orange-500 cursor-pointer">Electronics</li>
            <li className=" hover:text-orange-500 cursor-pointer">Computers</li>
            <li className=" hover:text-orange-500 cursor-pointer">Smart Home</li>
            <li className=" hover:text-orange-500 cursor-pointer">Arts & Crafts</li>
            <li className=" hover:text-orange-500 cursor-pointer">Automotive</li>
            <li className=" hover:text-orange-500 cursor-pointer">Baby</li>
            <li className=" hover:text-orange-500 cursor-pointer font-semibold">See All Departments</li>
          </ul>
        )}
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* Customer Reviews Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('customerReviews')}
          className="flex items-center justify-between w-full font-bold text-left mb-2"
        >
          Customer Reviews
          {expandedSections.customerReviews ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {expandedSections.customerReviews && (
          <ul className="space-y-2 pl-2">
            <li className="flex items-center hover:text-orange-500 cursor-pointer">
              <div className="flex">{renderStars(4)}</div>
              <span className="ml-2">& Up</span>
            </li>
            <li className="flex items-center hover:text-orange-500 cursor-pointer">
              <div className="flex">{renderStars(3)}</div>
              <span className="ml-2">& Up</span>
            </li>
            <li className="flex items-center hover:text-orange-500 cursor-pointer">
              <div className="flex">{renderStars(2)}</div>
              <span className="ml-2">& Up</span>
            </li>
            <li className="flex items-center hover:text-orange-500 cursor-pointer">
              <div className="flex">{renderStars(1)}</div>
              <span className="ml-2">& Up</span>
            </li>
          </ul>
        )}
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* Price Range Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('priceRange')}
          className="flex items-center justify-between w-full font-bold text-left mb-2"
        >
          Price
          {expandedSections.priceRange ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {expandedSections.priceRange && (
          <ul className="space-y-2 pl-2">
            <li className="hover:text-orange-500 cursor-pointer">Under $25</li>
            <li className="hover:text-orange-500 cursor-pointer">$25 to $50</li>
            <li className="hover:text-orange-500 cursor-pointer">$50 to $100</li>
            <li className="hover:text-orange-500 cursor-pointer">$100 to $200</li>
            <li className="hover:text-orange-500 cursor-pointer">$200 & Above</li>
            <li className="mt-3">
              <div className="flex items-center space-x-2">
                <input type="text" placeholder="Min" className="w-16 h-8 border border-gray-300 px-2 text-xs" />
                <span>-</span>
                <input type="text" placeholder="Max" className="w-16 h-8 border border-gray-300 px-2 text-xs" />
                <button className="bg-gray-200 text-xs px-2 py-1 rounded">Go</button>
              </div>
            </li>
          </ul>
        )}
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* Deals Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('deals')}
          className="flex items-center justify-between w-full font-bold text-left mb-2"
        >
          Deals & Discounts
          {expandedSections.deals ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {expandedSections.deals && (
          <ul className="space-y-2 pl-2">
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="hover:text-orange-500 cursor-pointer">Today&apos;s Deals</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="hover:text-orange-500 cursor-pointer">Lightning Deals</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="hover:text-orange-500 cursor-pointer">Savings</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="hover:text-orange-500 cursor-pointer">Prime Deals</span>
            </li>
          </ul>
        )}
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* Brands Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('brands')}
          className="flex items-center justify-between w-full font-bold text-left mb-2"
        >
          Brands
          {expandedSections.brands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {expandedSections.brands && (
          <>
            <div className="mb-2 pl-2">
              <input 
                type="text" 
                placeholder="Search brands" 
                className="w-full border border-gray-300 px-2 py-1 text-xs"
              />
            </div>
            <ul className="space-y-2 pl-2">
              <li className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="hover:text-orange-500 cursor-pointer">Apple</span>
              </li>
              <li className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="hover:text-orange-500 cursor-pointer">Samsung</span>
              </li>
              <li className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="hover:text-orange-500 cursor-pointer">Logitech</span>
              </li>
              <li className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="hover:text-orange-500 cursor-pointer">Sony</span>
              </li>
              <li className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="hover:text-orange-500 cursor-pointer">Microsoft</span>
              </li>
              <li className="text-blue-600 hover:text-orange-500 cursor-pointer mt-2">See more</li>
            </ul>
          </>
        )}
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* Availability */}
      <div className="mb-4">
        <div className="font-bold mb-2">Availability</div>
        <ul className="space-y-2 pl-2">
          <li className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>Include Out of Stock</span>
          </li>
        </ul>
      </div>
    </div>
  );
};