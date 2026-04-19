'use client'
import { useRef, useState } from 'react';
import { Star, Heart, Share2, Package, ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const ProductDetails = ({ productId }: { productId: string }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  console.log(productId)

  const product = {
    name: "Premium Bluetooth Headphones",
    price: 79.99,
    rating: 4.5,
    reviewCount: 2347,
    inStock: true,
    description: "Experience premium sound quality with these wireless Bluetooth headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    images: [
      "/images/headphone.jpg",
      "/images/headphone2.jpg",
      "/images/headphone3.jpg",
      "/images/headphone4.jpg",
      "/images/headphone5.jpg",
      "/images/headphone6.jpg",
    ],
    details: [
      "High-definition sound with powerful bass",
      "Active noise cancellation technology",
      "30-hour battery life",
      "Quick charge: 5 minutes for 2 hours of playback",
      "Bluetooth 5.2 connectivity"
    ],
    deliveryDate: "Friday, May 9"
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400" size={18} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="text-yellow-400" size={18} />);
      } else {
        stars.push(<Star key={i} className="text-gray-300" size={18} />);
      }
    }

    return stars;
  };


  const imageContainerRef = useRef(null)
  const zoomFactor = 2.5;
  const [showZoom, setShowZoom] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = () => {
    setShowZoom(true)
    console.log('mouse enter')
  }

  const handleMouseLeave = () => {
    console.log('mouse leave')
    setShowZoom(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (imageContainerRef.current) {
      const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();

      const relativeX = (e.clientX - left) / width;
      const relativeY = (e.clientY - top) / height;

      const boundedX = Math.max(0, Math.min(1, relativeX));
      const boundedY = Math.max(0, Math.min(1, relativeY));

      setCursorPosition({
        x: e.clientX - left,
        y: e.clientY - top
      });

      setZoomPosition({
        x: boundedX * 100,
        y: boundedY * 100
      });
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="hover:text-blue-500 cursor-pointer">Home</span>
        <ChevronRight size={16} />
        <span className="hover:text-blue-500 cursor-pointer">Electronics</span>
        <ChevronRight size={16} />
        <span className="hover:text-blue-500 cursor-pointer">Headphones</span>
        <ChevronRight size={16} />
        <span className="font-medium text-gray-700">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images Section */}
        <div className="w-full md:w-2/5">
          <div className="sticky top-4">
            {/* Main Image */}
            <div className="border border-gray-200 rounded-lg mb-2 p-2 bg-gray-50" ref={imageContainerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
              <Image
                width={500}
                height={500}
                src={product.images[selectedImage]}
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
                >
                </div>
              )}


              {showZoom && (
                <div
                  className="absolute hidden md:block border-2 border-gray-300 rounded-lg bg-white shadow-lg z-10"
                  style={{
                    width: '300px',
                    height: '300px',
                    right: '-320px',
                    top: '0',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      backgroundImage: `url(${product.images[selectedImage]})`,
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

            {/* Image Thumbnails */}
            <div className="flex gap-2 overflow-x-auto py-2">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`border-2 rounded cursor-pointer w-16 h-16 flex-shrink-0 ${selectedImage === index ? 'border-orange-500' : 'border-gray-200'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    width={64}
                    height={64}
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Share buttons */}
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

        {/* Product Info Section */}
        <div className="w-full md:w-3/5">
          <h1 className="text-2xl font-medium mb-1">{product.name}</h1>

          {/* Ratings */}
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {renderStars(product.rating)}
            </div>
            <a href="#reviews" className="text-sm text-blue-500 hover:underline">
              {product.reviewCount} ratings
            </a>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline">
              <span className="text-sm text-gray-500 line-through mr-2">$99.99</span>
              <span className="text-xl font-medium">${product.price}</span>
              <span className="ml-2 text-sm bg-red-100 text-red-700 px-1 rounded">-20%</span>
            </div>
            <p className="text-sm text-gray-500">
              & Free Returns
            </p>
          </div>

          <hr className="my-4" />

          {/* Short Description */}
          <div className="mb-6">
            <p className="text-sm">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">About this item</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {product.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>

          <hr className="my-4" />

          {/* Purchase Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="text-xl font-medium mb-2">${product.price}</div>

            <div className="flex items-center mb-2">
              <Package size={16} className="text-gray-500 mr-2" />
              <p className="text-sm">
                <span className="text-green-700 font-medium">FREE delivery </span>
                <span className="font-medium">{product.deliveryDate}</span>
              </p>
            </div>

            <div className="text-sm mb-4">
              {product.inStock ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded p-1 pr-8 text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
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

            {/* Secure transaction */}
            <div className="mt-4 text-xs flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure transaction
            </div>

          </div>

          {/* Additional Sections Collapsed */}
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
    </div >
  );
};

export default ProductDetails;