'use client';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export const TopCategory = () => {
  const [ratings] = useState({
    // Simulating product ratings (0-5)
    product1: 0,
    product2: 0,
    product3: 0,
    product4: 0,
    product5: 0,
    product6: 0,
    product7: 0,
    product8: 0,
  });

  // Sample product data
  const products = [
    {
      id: 'product1',
      name: 'Multigroomer All-in-One Trimmer Series 5000, 23 Piece Mens Grooming Kit',
      image: "/images/trimmer.png",
      originalPrice: 49.99,
      salePrice: 44.00,
      rating: ratings.product1,
    },
    {
      id: 'product2',
      name: 'Smart Speaker with Alexa Voice Control Built-in Compact Size with Incredible Sound for Any Room',
      image: "/images/trimmer.png",
      originalPrice: 249.00,
      salePrice: 219.00,
      rating: ratings.product2,
    },
    {
      id: 'product3',
      name: 'Home Speaker 500: Smart Bluetooth Speaker with Alexa Voice Control Built-In, White',
      image: "/images/trimmer.png",
      originalPrice: 229.00,
      salePrice: 209.00,
      rating: ratings.product3,
    },
    {
      id: 'product4',
      name: 'Note 10 Pro 128GB 6GB RAM Factory Unlocked (GSM ONLY) International Model',
      image: "/images/trimmer.png",
      originalPrice: 699.00,
      salePrice: 659.00,
      rating: ratings.product4,
    },
    {
      id: 'product5',
      name: '5G Unlocked Smartphone,12GB RAM+256GB Storage120Hz Fluid Display Hasselblad Quad Camera 65W Ultra Fast Charge 50W Wireless Charge',
      image: "/images/trimmer.png",
      originalPrice: 1299.00,
      salePrice: 1199.00,
      rating: ratings.product5,
    },
    {
      id: 'product6',
      name: '5G Factory Unlocked Android Cell Phone 128GB Pro-Grade Camera 30X Space Zoom Night Mode, Space Grey',
      image: "/images/trimmer.png",
      originalPrice: 1099.00,
      salePrice: 999.00,
      rating: ratings.product6,
    },
    {
      id: 'product7',
      name: '13 Ultrabook Gaming Laptop: Intel Core i7-1165G7 4 Core, NVIDIA GeForce GTX 1650 Ti Max-Q, 13.3" 1080p 120Hz, 16GB RAM, 512GB SSD, CNC Aluminum, Chroma RGB, Thunderbolt 4',
      image: "/images/trimmer.png",
      originalPrice: 1499.00,
      salePrice: 1399.00,
      rating: ratings.product7,
    },
    {
      id: 'product8',
      name: '15.6" FHD Display Laptop – Intel i7 – Intel HD Graphics 6000, Webcam, WiFi, Bluetooth, HDMI, Windows 11,Grey',
      image: "/images/trimmer.png",
      originalPrice: 1029.00,
      salePrice: 999.00,
      rating: ratings.product8,
    },
  ];

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white mt-16">
      {/* Today's Best Deal Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Today&apos;s best deal</h2>
        <Link href="/category_details" className="text-blue-500 hover:underline">See more</Link>

      </div>

      {/* First Row of Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="relative">
              <span className="absolute top-2 left-2 bg-white py-1 px-2 rounded-full text-xs font-medium text-gray-600">
                Sale!
              </span>
              <Link href={`/product/${product.id}`} className="block">
                <Image
                  width={200}
                  height={200}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain p-4"
                />
              </Link>
            </div>
            <div className="p-4">
              {renderStars(product.rating)}
              <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2 h-10">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center">
                <span className="text-gray-400 line-through text-sm mr-2">${product.originalPrice.toFixed(2)}</span>
                <span className="text-lg font-bold text-gray-900">${product.salePrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row of Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(4, 8).map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="relative">
              <span className="absolute top-2 left-2 bg-white py-1 px-2 rounded-full text-xs font-medium text-gray-600">
                Sale!
              </span>
              <Link href={`/product/${product.id}`} className="block">
                <Image
                  width={200}
                  height={200}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain p-4"
                />
              </Link>
            </div>
            <div className="p-4">
              {renderStars(product.rating)}
              <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2 h-10">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center">
                <span className="text-gray-400 line-through text-sm mr-2">${product.originalPrice.toFixed(2)}</span>
                <span className="text-lg font-bold text-gray-900">${product.salePrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};