'use client'

import { useRef, useState } from 'react';
import { Star, Heart, Share2, Package, ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
};

const details = [
  "Reliable performance for everyday home and office use",
  "Modern design with practical controls",
  "Built for long-term value and easy setup",
  "Carefully selected by RS Trade",
  "Support available after purchase",
];

const products: Product[] = [
  { id: "product1", category: "Today's best deal", name: "Multigroomer All-in-One Trimmer Series 5000, 23 Piece Mens Grooming Kit", image: "/images/trimmer.png", oldPrice: 49.99, price: 44, rating: 4, reviewCount: 2347 },
  { id: "product2", category: "Today's best deal", name: "Smart Speaker with Alexa Voice Control Built-in Compact Size with Incredible Sound for Any Room", image: "/images/Smart Speaker with Alexa Voice.jpg", oldPrice: 249, price: 219, rating: 4, reviewCount: 1186 },
  { id: "product3", category: "Today's best deal", name: "Home Speaker 500: Smart Bluetooth Speaker with Alexa Voice Control Built-In, White", image: "/images/Smart Bluetooth Speaker with Alexa Voice.jpg", oldPrice: 229, price: 209, rating: 4, reviewCount: 984 },
  { id: "product4", category: "Today's best deal", name: "Note 10 Pro 128GB 6GB RAM Factory Unlocked (GSM ONLY) International Model", image: "/images/Note 10 Pro 128GB 6GB RAM.jpg", oldPrice: 699, price: 659, rating: 4, reviewCount: 721 },
  { id: "product5", category: "Today's best deal", name: "5G Unlocked Smartphone,12GB RAM+256GB Storage120Hz Fluid Display Hasselblad Quad Camera 65W Ultra Fast Charge 50W Wireless Charge", image: "/images/5G Unlocked Smartphone,12GB RAM+256GB Storage.jpg", oldPrice: 1299, price: 1199, rating: 4, reviewCount: 643 },
  { id: "product6", category: "Today's best deal", name: "5G Factory Unlocked Android Cell Phone 128GB Pro-Grade Camera 30X Space Zoom Night Mode, Space Grey", image: "/images/5G Unlocked Smartphone,12GB RAM+256GB Storage.jpg", oldPrice: 1099, price: 999, rating: 4, reviewCount: 512 },
  { id: "product7", category: "Today's best deal", name: "13 Ultrabook Gaming Laptop: Intel Core i7-1165G7 4 Core, NVIDIA GeForce GTX 1650 Ti Max-Q, 13.3\" 1080p 120Hz, 16GB RAM, 512GB SSD, CNC Aluminum, Chroma RGB, Thunderbolt 4", image: "/images/3 Ultrabook Gaming Laptop.jpg", oldPrice: 1499, price: 1399, rating: 4, reviewCount: 438 },
  { id: "product8", category: "Today's best deal", name: "15.6\" FHD Display Laptop - Intel i7 - Intel HD Graphics 6000, Webcam, WiFi, Bluetooth, HDMI, Windows 11,Grey", image: "/images/Pc_laptop.jpg", oldPrice: 1029, price: 999, rating: 4, reviewCount: 370 },
  { id: "product9", category: "Audio & Video", name: "Max 5.1 Home Theater", image: "/images/Max 5.1 Home Theater.jpg", price: 620, rating: 5, reviewCount: 316 },
  { id: "product10", category: "Audio & Video", name: "V-Series 5.1 Home Theater", image: "/images/V-Series 5.1 Home Theater.jpg", oldPrice: 799, price: 499, rating: 4, reviewCount: 294 },
  { id: "product11", category: "Audio & Video", name: "OLED C4 Series 55” 4K TV", image: "/images/OLED C4 Series 55” 4K TV.jpg", price: 1249, rating: 5, reviewCount: 248 },
  { id: "product12", category: "Audio & Video", name: "X90J 65 Inch TV 4K", image: "/images/Audio.jpg", oldPrice: 1499, price: 1329, rating: 5, reviewCount: 221 },
  { id: "product13", category: "Home appliances", name: "Multigroomer Grooming Kit", image: "/images/Multigroomer Grooming Kit.jpg", oldPrice: 60, price: 44, rating: 5, reviewCount: 206 },
  { id: "product14", category: "Home appliances", name: "Compact Pulsator Washer", image: "/images/Compact Pulsator Washer.jpg", oldPrice: 319, price: 259, rating: 5, reviewCount: 186 },
  { id: "product15", category: "Home appliances", name: "Full-Auto Compact Washer", image: "/images/Full-Auto Compact Washer.jpg", oldPrice: 309, price: 270, rating: 5, reviewCount: 177 },
  { id: "product16", category: "Home appliances", name: "Small Space Dryer", image: "/images/Small Space Dryer.jpg", price: 349, rating: 5, reviewCount: 162 },
  { id: "product17", category: "Air conditioner", name: "AC 5000 BTU for Small Rooms", image: "/images/AC 5000 BTU for Small Rooms.jpg", oldPrice: 159, price: 139, rating: 5, reviewCount: 312 },
  { id: "product18", category: "Air conditioner", name: "Dual Hose Portable AC", image: "/images/Dual Hose Portable AC.jpg", price: 184, rating: 5, reviewCount: 244 },
  { id: "product19", category: "Air conditioner", name: "Star 5,000 BTU AC w/ Wi-Fi", image: "/images/star 5,000 btu ac with_ wi-fi.jpg", price: 199, rating: 5, reviewCount: 192 },
  { id: "product20", category: "Air conditioner", name: "BTU Window AC w/ Remote", image: "/images/btu window ac with_remote.jpg", price: 179, rating: 5, reviewCount: 176 },
  { id: "product21", category: "Kitchen appliances", name: "0.9 Cubic Feet Capacity 900 Watts Kitchen Essentials for the Countertop Stainless Steel", image: "/images/0.9 Cubic Feet Capacity 900 Watts Kitchen Essentials.jpg", oldPrice: 599, price: 559, rating: 5, reviewCount: 228 },
  { id: "product22", category: "Kitchen appliances", name: "Microwave Oven with Smart Sensor Easy Clean Interior ECO Mode 1.2 Cu Ft Stainless Steel", image: "/images/Microwave Oven with Smart Sensor.jpg", oldPrice: 529, price: 509, rating: 4, reviewCount: 207 },
  { id: "product23", category: "Kitchen appliances", name: "Double Door Mini Fridge with Freezer for Office or Dorm with Adjustable Remove Glass Shelves", image: "/images/Double Door Mini Fridge with Freezer.jpg", price: 479, rating: 4, reviewCount: 196 },
  { id: "product24", category: "Kitchen appliances", name: "36\" Side-by-Side Refrigerator and Freezer with 25 Cubic Ft. Total Capacity, Black", image: "/images/2 Door Apartment Size Refrigerator with Freezer.jpg", oldPrice: 799, price: 749, rating: 5, reviewCount: 164 },
  { id: "product25", category: "Refrigerator", name: "Double Door Mini Fridge with Freezer for Office or Dorm with Adjustable Remove Glass Shelves", image: "/images/Double Door Mini Fridge with Freezer.jpg", price: 479, rating: 4, reviewCount: 156 },
  { id: "product26", category: "Refrigerator", name: "36\" Side-by-Side Refrigerator and Freezer with 25 Cubic Ft. Total Capacity, Black", image: "/images/2 Door Apartment Size Refrigerator with Freezer.jpg", oldPrice: 799, price: 749, rating: 4, reviewCount: 143 },
  { id: "product27", category: "Refrigerator", name: "Mini Fridge with Freezer for Bedroom Office or Dorm with Adjustable Remove Glass Shelves Compact Refrigerator", image: "/images/Mini Fridge with Freezer for Bedroom.jpg", oldPrice: 499, price: 449, rating: 5, reviewCount: 137 },
  { id: "product28", category: "Refrigerator", name: "2 Door Apartment Size Refrigerator with Freezer, 7.2 cu ft, Platinum Series, Stainless Steel", image: "/images/2 Door Apartment Size Refrigerator.jpg", oldPrice: 899, price: 849, rating: 5, reviewCount: 121 },
  { id: "product29", category: "PCs & Laptop", name: "14\" FHD Ultrabook (400 nits) with 10th Gen Intel i7-10510U Processor up to 4.90 GHz, 1 TB PCIe SSD, 16GB RAM, and Windows 11 Pro", image: "/images/Pc_laptop.jpg", price: 1099, rating: 5, reviewCount: 299 },
  { id: "product30", category: "PCs & Laptop", name: "15.6\" Rugged Ultrabook - 4K UHD - 3840 x 2160 - Intel Core i7 11th Gen i7-11957 2.90 GHz - 32 GB RAM - 1 TB SSD - Carbon Gray", image: "/images/13 Ultrabook Gaming Laptop.jpg", price: 799, rating: 4, reviewCount: 188 },
  { id: "product31", category: "PCs & Laptop", name: "13 Ultrabook Gaming Laptop: Intel Core i7-11657 4 Core, NVIDIA GeForce GTX 1650 Ti Max-Q, 13.3\" 1080p 120Hz, 16GB RAM, 512GB SSD, CNC Aluminum, Chroma RGB, Thunderbolt 4", image: "/images/3 Ultrabook Gaming Laptop.jpg", oldPrice: 1499, price: 1399, rating: 4, reviewCount: 164 },
  { id: "product32", category: "PCs & Laptop", name: "15.6\" FHD Display Laptop - Intel i7 - Intel HD Graphics 6000 , Webcam, WiFi, Bluetooth, HDMI, Windows 11,Grey", image: "/images/Pc_laptop.jpg", oldPrice: 1029, price: 999, rating: 5, reviewCount: 151 },
  { id: "product33", category: "Gadget", name: "Mirrorless Vlogging Camera Polaroid Kit with EF-M 15-45mm Lens, Black", image: "/images/Mirrorless Vlogging Camera Polaroid.jpg", price: 599, rating: 4, reviewCount: 142 },
  { id: "product34", category: "Gadget", name: "4K Digital Camera, 12-32mm and 45-150mm Lens Bundle, 16 Megapixel Kit, 5 Axis In-Body Dual Image Stabilization, Black", image: "/images/4K Digital Camera, 12-32mm and 45.jpg", price: 799, rating: 5, reviewCount: 128 },
  { id: "product35", category: "Gadget", name: "Android Tablet 10.5\" LCD Screen 64GB Storage Long-Lasting Battery Kids Content Smart Switch Expandable Memory", image: "/images/gadgets.jpg", price: 599, rating: 5, reviewCount: 114 },
  { id: "product36", category: "Gadget", name: "Note 10 Pro 128GB 6GB RAM Factory Unlocked (GSM ONLY) International Model", image: "/images/Note 10 Pro 128GB 6GB RAM.jpg", oldPrice: 699, price: 659, rating: 5, reviewCount: 103 },
];

const productDetailsById = Object.fromEntries(products.map((product) => [product.id, product]));

export const ProductDetails = ({ productId }: { productId: string }) => {
  const [quantity, setQuantity] = useState(1);
  const product = productDetailsById[productId] || productDetailsById.product1;
  const oldPrice = product.oldPrice || product.price;
  const discount = oldPrice > product.price ? Math.round(((oldPrice - product.price) / oldPrice) * 100) : 0;
  const zoomImageUrl = encodeURI(product.image);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={index < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        size={18}
      />
    ));
  };

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const zoomFactor = 2.5;
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (imageContainerRef.current) {
      const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - left) / width;
      const relativeY = (e.clientY - top) / height;
      const boundedX = Math.max(0, Math.min(1, relativeX));
      const boundedY = Math.max(0, Math.min(1, relativeY));

      setCursorPosition({ x: e.clientX - left, y: e.clientY - top });
      setZoomPosition({ x: boundedX * 100, y: boundedY * 100 });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="hover:text-blue-500 cursor-pointer">Home</span>
        <ChevronRight size={16} />
        <span className="hover:text-blue-500 cursor-pointer">{product.category}</span>
        <ChevronRight size={16} />
        <span className="font-medium text-gray-700">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/5">
          <div className="sticky top-4">
            <div
              className="relative border border-gray-200 rounded-lg mb-2 p-2 bg-gray-50"
              ref={imageContainerRef}
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                width={500}
                height={500}
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-contain"
              />

              {showZoom && (
                <div
                  className="absolute pointer-events-none border border-gray-400"
                  style={{
                    left: cursorPosition.x - 50,
                    top: cursorPosition.y - 50,
                    width: '100px',
                    height: '100px',
                    opacity: 0.3,
                    backgroundColor: 'rgba(200, 200, 200, 0.3)',
                  }}
                />
              )}

              {showZoom && (
                <div
                  className="absolute hidden lg:block border-2 border-gray-300 rounded-lg bg-white shadow-lg z-20"
                  style={{
                    width: '300px',
                    height: '300px',
                    left: 'calc(100% + 20px)',
                    top: '0',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      backgroundImage: `url("${zoomImageUrl}")`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: `${zoomFactor * 100}%`,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto py-2">
              <div className="border-2 rounded cursor-pointer w-16 h-16 flex-shrink-0 border-orange-500">
                <Image
                  width={64}
                  height={64}
                  src={product.image}
                  alt={`${product.name} view`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex mt-4 gap-4">
              <button className="flex items-center text-sm text-blue-600 hover:underline">
                <Share2 size={16} className="mr-1" /> Share
              </button>
              <button className="flex items-center text-sm text-blue-600 hover:underline">
                <Heart size={16} className="mr-1" /> Add to List
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5">
          <h1 className="text-2xl font-medium mb-1">{product.name}</h1>

          <div className="flex items-center mb-2">
            <div className="flex mr-2">{renderStars(product.rating)}</div>
            <a href="#reviews" className="text-sm text-blue-500 hover:underline">
              {product.reviewCount} ratings
            </a>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline">
              {discount > 0 && (
                <span className="text-sm text-gray-500 line-through mr-2">${oldPrice.toFixed(2)}</span>
              )}
              <span className="text-xl font-medium">${product.price.toFixed(2)}</span>
              {discount > 0 && (
                <span className="ml-2 text-sm bg-red-100 text-red-700 px-1 rounded">-{discount}%</span>
              )}
            </div>
            <p className="text-sm text-gray-500">& Free Returns</p>
          </div>

          <hr className="my-4" />

          <div className="mb-6">
            <p className="text-sm">
              View details for {product.name}. This product image and price come from the item you clicked.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">About this item</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>

          <hr className="my-4" />

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="text-xl font-medium mb-2">${product.price.toFixed(2)}</div>

            <div className="flex items-center mb-2">
              <Package size={16} className="text-gray-500 mr-2" />
              <p className="text-sm">
                <span className="text-green-700 font-medium">FREE delivery </span>
                <span className="font-medium">Friday, May 9</span>
              </p>
            </div>

            <div className="text-sm mb-4">
              <span className="text-green-600 font-medium">In Stock</span>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded p-1 pr-8 text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Link href="/cart/add-to-cart" className="block">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded-full text-sm font-medium transition">
                  Add to Cart
                </button>
              </Link>
              <Link href="/checkout" className="block">
                <button className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded-full text-sm font-medium transition">
                  Buy Now
                </button>
              </Link>
            </div>

            <div className="mt-4 text-xs flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure transaction
            </div>
          </div>

          <div className="space-y-2">
            <div className="border border-gray-200 rounded p-3">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="font-medium">Product Details</h3>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="border border-gray-200 rounded p-3">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="font-medium">Customer Reviews</h3>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="border border-gray-200 rounded p-3">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="font-medium">Questions & Answers</h3>
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
