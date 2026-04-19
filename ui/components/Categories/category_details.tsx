'use client'

import { useState } from 'react';
import { Star, ChevronDown, Heart, ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


export const CategoryDetails = () => {
  const [sortOption, setSortOption] = useState('Featured');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  // const [currentp]
  const products = [
    {
      id: 1,
      title: "Wireless Bluetooth Earbuds with Charging Case, IPX7 Waterproof, Touch Control",
      image: "/images/headphone.jpg",
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.5,
      reviews: 12563,
      prime: true,
      dealOfTheDay: true,
      discount: 33,
      arrivalDate: "Wed, May 8"
    },
    {
      id: 2,
      title: "Laptop Stand, Adjustable Laptop Holder Computer Stand",
      image: "/images/headphone.jpg",
      price: 25.99,
      originalPrice: 32.99,
      rating: 4.3,
      reviews: 8745,
      prime: true,
      discount: 21,
      bestSeller: true
    },
    {
      id: 3,
      title: "Wireless Gaming Mouse with 7 RGB Lighting Modes",
      image: "/images/headphone.jpg",
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.2,
      reviews: 5321,
      prime: true,
      discount: 33
    },
    {
      id: 4,
      title: "Smart Watch Fitness Tracker with Heart Rate Monitor",
      image: "/images/headphone.jpg",
      price: 45.99,
      originalPrice: 69.99,
      rating: 4.0,
      reviews: 3457,
      prime: true,
      discount: 34,
      amazonChoice: true
    },
    {
      id: 5,
      title: "Mechanical Gaming Keyboard with LED Backlit Keys",
      image: "/images/headphone.jpg",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.6,
      reviews: 7823,
      prime: true,
      discount: 29
    },
    {
      id: 6,
      title: "USB C Hub Multiport Adapter with 4K HDMI and USB 3.0 Ports",
      image: "/images/headphone.jpg",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.4,
      reviews: 6214,
      prime: true,
      discount: 25
    },
    {
      id: 7,
      title: "Noise Cancelling Wireless Over-Ear Headphones",
      image: "/images/headphone.jpg",
      price: 79.99,
      originalPrice: 119.99,
      rating: 4.7,
      reviews: 9541,
      prime: true,
      discount: 33,
      limitedTimeDeal: true
    },
    {
      id: 8,
      title: "Portable External Hard Drive 2TB USB 3.0",
      image: "/images/headphone.jpg",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviews: 4562,
      prime: true,
      discount: 25
    },
    {
      id: 9,
      title: "4K Ultra HD Smart TV with HDR and Alexa Built-in",
      image: "/images/headphone.jpg",
      price: 499.99,
      originalPrice: 699.99,
      rating: 4.8,
      reviews: 12345,
      prime: true,
      discount: 29
    },
    {
      id: 10,
      title: "Wireless Charger, Fast Charging Pad for iPhone and Android",
      image: "/images/headphone.jpg",
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.1,
      reviews: 2345,
      prime: true,
      discount: 33
    },
    {
      id: 11,
      title: "Bluetooth Speaker with Deep Bass and 24-Hour Battery Life",
      image: "/images/headphone.jpg",
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.3,
      reviews: 6789,
      prime: true,
      discount: 33
    },
    {
      id: 12,
      title: "HDMI Cable 6ft, High Speed HDMI 2.0 Cable with Ethernet",
      image: "/images/headphone.jpg",
      price: 9.99,
      originalPrice: 14.99,
      rating: 4.5,
      reviews: 3456,
      prime: true,
      discount: 33
    },
    {
      id: 13,
      title: "Wireless Bluetooth Headphones with Noise Isolation",
      image: "/images/headphone.jpg",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.2,
      reviews: 5678,
      prime: true,
      discount: 25
    },
    {
      id: 14,
      title: "Gaming Monitor 24 inch Full HD with FreeSync Technology",
      image: "/images/headphone.jpg",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.6,
      reviews: 7890,
      prime: true,
      discount: 20
    },
    {
      id: 15,
      title: "Smart Home Security Camera with Night Vision",
      image: "/images/headphone.jpg",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.4,
      reviews: 4321,
      prime: true,
      discount: 29
    },
    {
      id: 16,
      title: "Wireless Gaming Headset with RGB Lighting and Microphone",
      image: "/images/headphone.jpg",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.7,
      reviews: 6543,
      prime: true,
      discount: 31
    },
    {
      id: 17,
      title: "USB Microphone for Streaming and Recording",
      image: "/images/headphone.jpg",
      price: 79.99,
      originalPrice: 109.99,
      rating: 4.5,
      reviews: 3210,
      prime: true,
    },
    {
      id: 18,
      title: "Portable Bluetooth Projector with WiFi and HDMI",
      image: "/images/headphone.jpg",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.8,
      reviews: 9876,
    },
    {
      id: 19,
      title: "Smart LED Desk Lamp with Wireless Charging",
      image: "/images/headphone.jpg",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.3,
      reviews: 1234,
      prime: true,
    }
  ];

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" :
          (i < rating && i > Math.floor(rating) - 1 ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
      />
    ));
  };

  const formatPrice = (price) => {
    return price.toFixed(2).split('.');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-medium">Electronics</h1>
        <p className="text-sm text-gray-600">1-24 of over 100,000 results for &quot;electronics&quot;</p>
      </div>

      <div className="bg-gray-100 p-3 mb-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="bg-white border border-gray-300 px-3 py-1 rounded text-sm flex items-center">
            <span>All Departments</span>
            <ChevronDown size={14} className="ml-1" />
          </button>

          <button className="bg-white border border-gray-300 px-3 py-1 rounded text-sm flex items-center">
            <span>Include Out of Stock</span>
            <ChevronDown size={14} className="ml-1" />
          </button>
        </div>

        <div className="relative mt-2 sm:mt-0">
          <button
            className="bg-white border border-gray-300 px-3 py-1 rounded text-sm flex items-center"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <span>Sort by: {sortOption}</span>
            <ArrowUpDown size={14} className="ml-1" />
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded z-10">
              <ul>
                {['Featured', 'Price: Low to High', 'Price: High to Low', 'Customer Review', 'Newest Arrivals'].map(option => (
                  <li
                    key={option}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSortOption(option);
                      setShowSortDropdown(false);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="border border-gray-200 rounded p-4 relative">

            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.amazonChoice && (
                <div className="bg-blue-900 text-white text-xs px-1 py-0.5 rounded">
                  Amazon&apos;s <span className="font-bold">Choice</span>
                </div>
              )}
              {product.bestSeller && (
                <div className="bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                  Best Seller
                </div>
              )}
              {product.dealOfTheDay && (
                <div className="bg-red-600 text-white text-xs px-1 py-0.5 rounded">
                  Deal of the Day
                </div>
              )}
              {product.limitedTimeDeal && (
                <div className="bg-red-600 text-white text-xs px-1 py-0.5 rounded">
                  Limited Time Deal
                </div>
              )}
            </div>

            <Link href={`/product/${product.id}`}>
              <div className="flex justify-center mb-3">
                <Image
                  width={200}
                  height={200}
                  src={product.image}
                  alt={product.title}
                  className="h-48 object-contain cursor-pointer hover:scale-105 transition-transform"
                />
              </div>
            </Link>


            {/* Product Title */}
            <h2 className="text-sm mb-1 line-clamp-2 hover:text-orange-500 cursor-pointer">
              {product.title}
            </h2>

            {/* Product Rating */}
            <div className="flex items-center mb-1">
              <div className="flex mr-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs text-blue-600 hover:text-orange-500 cursor-pointer">
                {product.reviews.toLocaleString()}
              </span>
            </div>

            {/* Product Price */}
            <div className="mb-1">
              {product.discount && (
                <span className="bg-red-600 text-white text-xs px-1 rounded mr-2">
                  {product.discount}% off
                </span>
              )}
              <span className="text-lg font-medium">
                <sup className="text-sm">$</sup>
                {formatPrice(product.price)[0]}
                <sup className="text-sm">{formatPrice(product.price)[1]}</sup>
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex justify-between">
              <button className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded-full text-xs shadow-sm flex-grow">
                Add to Cart
              </button>
              <button className="ml-2 border border-gray-300 p-1 rounded-full hover:bg-gray-100">
                <Heart size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 mb-6">
        <div className="inline-flex border border-gray-300 rounded overflow-hidden">
          <button className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100 disabled:text-gray-400" disabled>
            Previous
          </button>
          {[1, 2, 3, 4, 5].map(page => (
            <button
              key={page}
              className={`px-3 py-1 border-r border-gray-300 ${page === 1 ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};