'use client'

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, ChevronDown, Heart, ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  categorySlug: string;
  onSale?: boolean;
};

const products: Product[] = [
  { id: "product1", category: "Today's best deal", categorySlug: "todays-best-deal", title: "Multigroomer All-in-One Trimmer Series 5000, 23 Piece Mens Grooming Kit", image: "/images/trimmer.png", originalPrice: 49.99, price: 44, rating: 4, reviews: 2347, onSale: true },
  { id: "product2", category: "Today's best deal", categorySlug: "todays-best-deal", title: "Smart Speaker with Alexa Voice Control Built-in Compact Size with Incredible Sound for Any Room", image: "/images/Smart Speaker with Alexa Voice.jpg", originalPrice: 249, price: 219, rating: 4, reviews: 1186, onSale: true },
  { id: "product3", category: "Today's best deal", categorySlug: "todays-best-deal", title: "Home Speaker 500: Smart Bluetooth Speaker with Alexa Voice Control Built-In, White", image: "/images/Smart Bluetooth Speaker with Alexa Voice.jpg", originalPrice: 229, price: 209, rating: 4, reviews: 984, onSale: true },
  { id: "product4", category: "Today's best deal", categorySlug: "todays-best-deal", title: "Note 10 Pro 128GB 6GB RAM Factory Unlocked (GSM ONLY) International Model", image: "/images/Note 10 Pro 128GB 6GB RAM.jpg", originalPrice: 699, price: 659, rating: 4, reviews: 721, onSale: true },
  { id: "product5", category: "Today's best deal", categorySlug: "todays-best-deal", title: "5G Unlocked Smartphone,12GB RAM+256GB Storage120Hz Fluid Display Hasselblad Quad Camera 65W Ultra Fast Charge 50W Wireless Charge", image: "/images/5G Unlocked Smartphone,12GB RAM+256GB Storage.jpg", originalPrice: 1299, price: 1199, rating: 4, reviews: 643, onSale: true },
  { id: "product6", category: "Today's best deal", categorySlug: "todays-best-deal", title: "5G Factory Unlocked Android Cell Phone 128GB Pro-Grade Camera 30X Space Zoom Night Mode, Space Grey", image: "/images/5G Unlocked Smartphone,12GB RAM+256GB Storage.jpg", originalPrice: 1099, price: 999, rating: 4, reviews: 512, onSale: true },
  { id: "product7", category: "Today's best deal", categorySlug: "todays-best-deal", title: "13 Ultrabook Gaming Laptop: Intel Core i7-1165G7 4 Core, NVIDIA GeForce GTX 1650 Ti Max-Q, 13.3\" 1080p 120Hz, 16GB RAM, 512GB SSD, CNC Aluminum, Chroma RGB, Thunderbolt 4", image: "/images/3 Ultrabook Gaming Laptop.jpg", originalPrice: 1499, price: 1399, rating: 4, reviews: 438, onSale: true },
  { id: "product8", category: "Today's best deal", categorySlug: "todays-best-deal", title: "15.6\" FHD Display Laptop - Intel i7 - Intel HD Graphics 6000, Webcam, WiFi, Bluetooth, HDMI, Windows 11,Grey", image: "/images/Pc_laptop.jpg", originalPrice: 1029, price: 999, rating: 4, reviews: 370, onSale: true },
  { id: "product9", category: "Audio & Video", categorySlug: "audio-video", title: "Max 5.1 Home Theater", image: "/images/Max 5.1 Home Theater.jpg", price: 620, rating: 5, reviews: 316 },
  { id: "product10", category: "Audio & Video", categorySlug: "audio-video", title: "V-Series 5.1 Home Theater", image: "/images/V-Series 5.1 Home Theater.jpg", originalPrice: 799, price: 499, rating: 4, reviews: 294, onSale: true },
  { id: "product11", category: "Audio & Video", categorySlug: "audio-video", title: "OLED C4 Series 55” 4K TV", image: "/images/OLED C4 Series 55” 4K TV.jpg", price: 1249, rating: 5, reviews: 248 },
  { id: "product12", category: "Audio & Video", categorySlug: "audio-video", title: "X90J 65 Inch TV 4K", image: "/images/Audio.jpg", originalPrice: 1499, price: 1329, rating: 5, reviews: 221, onSale: true },
  { id: "product13", category: "Home appliances", categorySlug: "home-appliances", title: "Multigroomer Grooming Kit", image: "/images/Multigroomer Grooming Kit.jpg", originalPrice: 60, price: 44, rating: 5, reviews: 206, onSale: true },
  { id: "product14", category: "Home appliances", categorySlug: "home-appliances", title: "Compact Pulsator Washer", image: "/images/Compact Pulsator Washer.jpg", originalPrice: 319, price: 259, rating: 5, reviews: 186 },
  { id: "product15", category: "Home appliances", categorySlug: "home-appliances", title: "Full-Auto Compact Washer", image: "/images/Full-Auto Compact Washer.jpg", originalPrice: 309, price: 270, rating: 5, reviews: 177, onSale: true },
  { id: "product16", category: "Home appliances", categorySlug: "home-appliances", title: "Small Space Dryer", image: "/images/Small Space Dryer.jpg", price: 349, rating: 5, reviews: 162 },
  { id: "product17", category: "Air conditioner", categorySlug: "air-conditioner", title: "AC 5000 BTU for Small Rooms", image: "/images/AC 5000 BTU for Small Rooms.jpg", originalPrice: 159, price: 139, rating: 5, reviews: 312, onSale: true },
  { id: "product18", category: "Air conditioner", categorySlug: "air-conditioner", title: "Dual Hose Portable AC", image: "/images/Dual Hose Portable AC.jpg", price: 184, rating: 5, reviews: 244 },
  { id: "product19", category: "Air conditioner", categorySlug: "air-conditioner", title: "Star 5,000 BTU AC w/ Wi-Fi", image: "/images/star 5,000 btu ac with_ wi-fi.jpg", price: 199, rating: 5, reviews: 192 },
  { id: "product20", category: "Air conditioner", categorySlug: "air-conditioner", title: "BTU Window AC w/ Remote", image: "/images/btu window ac with_remote.jpg", price: 179, rating: 5, reviews: 176 },
  { id: "product21", category: "Kitchen appliances", categorySlug: "kitchen-appliances", title: "0.9 Cubic Feet Capacity 900 Watts Kitchen Essentials for the Countertop Stainless Steel", image: "/images/0.9 Cubic Feet Capacity 900 Watts Kitchen Essentials.jpg", originalPrice: 599, price: 559, rating: 5, reviews: 228, onSale: true },
  { id: "product22", category: "Kitchen appliances", categorySlug: "kitchen-appliances", title: "Microwave Oven with Smart Sensor Easy Clean Interior ECO Mode 1.2 Cu Ft Stainless Steel", image: "/images/Microwave Oven with Smart Sensor.jpg", originalPrice: 529, price: 509, rating: 4, reviews: 207, onSale: true },
  { id: "product23", category: "Kitchen appliances", categorySlug: "kitchen-appliances", title: "Double Door Mini Fridge with Freezer for Office or Dorm with Adjustable Remove Glass Shelves", image: "/images/Double Door Mini Fridge with Freezer.jpg", price: 479, rating: 4, reviews: 196 },
  { id: "product24", category: "Kitchen appliances", categorySlug: "kitchen-appliances", title: "36\" Side-by-Side Refrigerator and Freezer with 25 Cubic Ft. Total Capacity, Black", image: "/images/2 Door Apartment Size Refrigerator with Freezer.jpg", originalPrice: 799, price: 749, rating: 5, reviews: 164, onSale: true },
  { id: "product25", category: "Refrigerator", categorySlug: "refrigerator", title: "Double Door Mini Fridge with Freezer for Office or Dorm with Adjustable Remove Glass Shelves", image: "/images/Double Door Mini Fridge with Freezer.jpg", price: 479, rating: 4, reviews: 156 },
  { id: "product26", category: "Refrigerator", categorySlug: "refrigerator", title: "36\" Side-by-Side Refrigerator and Freezer with 25 Cubic Ft. Total Capacity, Black", image: "/images/2 Door Apartment Size Refrigerator with Freezer.jpg", originalPrice: 799, price: 749, rating: 4, reviews: 143, onSale: true },
  { id: "product27", category: "Refrigerator", categorySlug: "refrigerator", title: "Mini Fridge with Freezer for Bedroom Office or Dorm with Adjustable Remove Glass Shelves Compact Refrigerator", image: "/images/Mini Fridge with Freezer for Bedroom.jpg", originalPrice: 499, price: 449, rating: 5, reviews: 137, onSale: true },
  { id: "product28", category: "Refrigerator", categorySlug: "refrigerator", title: "2 Door Apartment Size Refrigerator with Freezer, 7.2 cu ft, Platinum Series, Stainless Steel", image: "/images/2 Door Apartment Size Refrigerator.jpg", originalPrice: 899, price: 849, rating: 5, reviews: 121, onSale: true },
  { id: "product29", category: "PCs & Laptop", categorySlug: "pcs-laptop", title: "14\" FHD Ultrabook (400 nits) with 10th Gen Intel i7-10510U Processor up to 4.90 GHz, 1 TB PCIe SSD, 16GB RAM, and Windows 11 Pro", image: "/images/Pc_laptop.jpg", price: 1099, rating: 5, reviews: 299 },
  { id: "product30", category: "PCs & Laptop", categorySlug: "pcs-laptop", title: "15.6\" Rugged Ultrabook - 4K UHD - 3840 x 2160 - Intel Core i7 11th Gen i7-11957 2.90 GHz - 32 GB RAM - 1 TB SSD - Carbon Gray", image: "/images/13 Ultrabook Gaming Laptop.jpg", price: 799, rating: 4, reviews: 188 },
  { id: "product31", category: "PCs & Laptop", categorySlug: "pcs-laptop", title: "13 Ultrabook Gaming Laptop: Intel Core i7-11657 4 Core, NVIDIA GeForce GTX 1650 Ti Max-Q, 13.3\" 1080p 120Hz, 16GB RAM, 512GB SSD, CNC Aluminum, Chroma RGB, Thunderbolt 4", image: "/images/3 Ultrabook Gaming Laptop.jpg", originalPrice: 1499, price: 1399, rating: 4, reviews: 164, onSale: true },
  { id: "product32", category: "PCs & Laptop", categorySlug: "pcs-laptop", title: "15.6\" FHD Display Laptop - Intel i7 - Intel HD Graphics 6000 , Webcam, WiFi, Bluetooth, HDMI, Windows 11,Grey", image: "/images/Pc_laptop.jpg", originalPrice: 1029, price: 999, rating: 5, reviews: 151, onSale: true },
  { id: "product33", category: "Gadget", categorySlug: "gadget", title: "Mirrorless Vlogging Camera Polaroid Kit with EF-M 15-45mm Lens, Black", image: "/images/Mirrorless Vlogging Camera Polaroid.jpg", price: 599, rating: 4, reviews: 142 },
  { id: "product34", category: "Gadget", categorySlug: "gadget", title: "4K Digital Camera, 12-32mm and 45-150mm Lens Bundle, 16 Megapixel Kit, 5 Axis In-Body Dual Image Stabilization, Black", image: "/images/4K Digital Camera, 12-32mm and 45.jpg", price: 799, rating: 5, reviews: 128 },
  { id: "product35", category: "Gadget", categorySlug: "gadget", title: "Android Tablet 10.5\" LCD Screen 64GB Storage Long-Lasting Battery Kids Content Smart Switch Expandable Memory", image: "/images/gadgets.jpg", price: 599, rating: 5, reviews: 114, onSale: true },
  { id: "product36", category: "Gadget", categorySlug: "gadget", title: "Note 10 Pro 128GB 6GB RAM Factory Unlocked (GSM ONLY) International Model", image: "/images/Note 10 Pro 128GB 6GB RAM.jpg", originalPrice: 699, price: 659, rating: 5, reviews: 103, onSale: true },
];

const categoryNames: Record<string, string> = {
  "air-conditioner": "Air conditioner",
  "audio-video": "Audio & Video",
  "gadget": "Gadget",
  "home-appliances": "Home appliances",
  "kitchen-appliances": "Kitchen appliances",
  "pcs-laptop": "PCs & Laptop",
  "refrigerator": "Refrigerator",
  "smart-home": "Smart Home",
};

export const CategoryDetails = () => {
  const [sortOption, setSortOption] = useState('Featured');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

  const filteredProducts = useMemo(() => {
    const items = selectedCategory
      ? products.filter((product) => product.categorySlug === selectedCategory)
      : products;

    if (sortOption === 'Price: Low to High') {
      return [...items].sort((a, b) => a.price - b.price);
    }

    if (sortOption === 'Price: High to Low') {
      return [...items].sort((a, b) => b.price - a.price);
    }

    if (sortOption === 'Customer Review') {
      return [...items].sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [selectedCategory, sortOption]);

  const pageTitle = categoryNames[selectedCategory] || "All Products";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={index < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const formatPrice = (price: number) => price.toFixed(2).split('.');

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-medium">{pageTitle}</h1>
        <p className="text-sm text-gray-600">
          1-{filteredProducts.length} of {filteredProducts.length} results
        </p>
      </div>

      <div className="bg-gray-100 p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          <Link
            href="/category_details"
            className={`border border-gray-300 px-3 py-1 rounded text-sm whitespace-nowrap ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            All Departments
          </Link>
          {Object.entries(categoryNames).map(([slug, name]) => (
            <Link
              key={slug}
              href={`/category_details?category=${slug}`}
              className={`border border-gray-300 px-3 py-1 rounded text-sm whitespace-nowrap ${selectedCategory === slug ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              {name}
            </Link>
          ))}
        </div>

        <div className="relative">
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
                {['Featured', 'Price: Low to High', 'Price: High to Low', 'Customer Review'].map((option) => (
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
        {filteredProducts.map((product) => {
          const discount = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div key={product.id} className="border border-gray-200 rounded p-4 relative bg-white">
              {product.onSale && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                  Sale!
                </div>
              )}

              <Link href={`/product/${product.id}`} className="block">
                <div className="flex justify-center mb-3">
                  <Image
                    width={220}
                    height={220}
                    src={product.image}
                    alt={product.title}
                    className="h-48 w-full object-contain cursor-pointer hover:scale-105 transition-transform"
                  />
                </div>
              </Link>

              <Link href={`/product/${product.id}`}>
                <h2 className="text-sm mb-1 line-clamp-2 hover:text-orange-500 cursor-pointer min-h-10">
                  {product.title}
                </h2>
              </Link>

              <div className="flex items-center mb-1">
                <div className="flex mr-1">{renderStars(product.rating)}</div>
                <span className="text-xs text-blue-600">{product.reviews.toLocaleString()}</span>
              </div>

              <div className="mb-1">
                {discount > 0 && (
                  <span className="bg-red-600 text-white text-xs px-1 rounded mr-2">
                    {discount}% off
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

              <div className="mt-3 flex justify-between">
                <button className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded-full text-xs shadow-sm flex-grow">
                  Add to Cart
                </button>
                <button className="ml-2 border border-gray-300 p-1 rounded-full hover:bg-gray-100">
                  <Heart size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-8 mb-6">
        <div className="inline-flex border border-gray-300 rounded overflow-hidden">
          <button className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100 disabled:text-gray-400" disabled>
            Previous
          </button>
          <button className="px-3 py-1 border-r border-gray-300 bg-orange-500 text-white">1</button>
          <button className="px-3 py-1 hover:bg-gray-100" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
