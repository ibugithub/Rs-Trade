import Image from 'next/image';
import Link from 'next/link';

// Star rating component
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Product card component
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-4">
      {product.onSale && (
        <div className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-semibold absolute">
          Sale!
        </div>
      )}
      <div className="flex justify-center mb-4 relative">
        <div className="h-40 w-40 relative">
          <Link href={`/product/${product.id}`} className="block">
            <Image
              width={200}
              height={200}
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-contain p-4"
            />
          </Link>
        </div>
      </div>
      <StarRating rating={product.rating} />
      <h3 className="font-semibold text-sm mt-2 h-12 overflow-hidden">
        {product.title}
      </h3>
      <div className="mt-2 flex items-center">
        {product.originalPrice && (
          <span className="text-gray-500 line-through text-sm mr-2">
            ${product.originalPrice}
          </span>
        )}
        <span className="text-black font-semibold">
          ${product.price}
        </span>
      </div>
    </div>
  );
};

// Product category section
const ProductCategory = ({ title, products, showMoreLink }) => {
  return (
    <div className="bg-white shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {showMoreLink && (
          <Link href="/category_details" className="text-blue-500 hover:underline">See more</Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export const MidCategory2 = () => {
  // Sample kitchen appliances data
  const kitchenAppliances = [
    {
      id: "product21",
      image: "/images/0.9 Cubic Feet Capacity 900 Watts Kitchen Essentials.jpg",
      title: "0.9 Cubic Feet Capacity 900 Watts Kitchen Essentials for the Countertop Stainless Steel",
      rating: 5,
      originalPrice: "599.00",
      price: "559.00",
      onSale: true
    },
    {
      id: "product22",
      image: "/images/Microwave Oven with Smart Sensor.jpg",
      title: "Microwave Oven with Smart Sensor Easy Clean Interior ECO Mode 1.2 Cu Ft Stainless Steel",
      rating: 4,
      originalPrice: "529.00",
      price: "509.00",
      onSale: true
    },
    {
      id: "product23",
      image: "/images/Double Door Mini Fridge with Freezer.jpg",
      title: "Double Door Mini Fridge with Freezer for Office or Dorm with Adjustable Remove Glass Shelves",
      rating: 4,
      price: "479.00",
      onSale: false
    },
    {
      id: "product24",
      image: "/images/2 Door Apartment Size Refrigerator with Freezer.jpg",
      title: "36\" Side-by-Side Refrigerator and Freezer with 25 Cubic Ft. Total Capacity, Black",
      rating: 5,
      originalPrice: "799.00",
      price: "749.00",
      onSale: true
    }
  ];

  // Sample refrigerator data
  const refrigerators = [
    {
      id: "product25",
      image: "/images/Double Door Mini Fridge with Freezer.jpg",
      title: "Double Door Mini Fridge with Freezer for Office or Dorm with Adjustable Remove Glass Shelves",
      rating: 4,
      price: "479.00",
      onSale: false
    },
    {
      id: "product26",
      image: "/images/2 Door Apartment Size Refrigerator with Freezer.jpg",
      title: "36\" Side-by-Side Refrigerator and Freezer with 25 Cubic Ft. Total Capacity, Black",
      rating: 4,
      originalPrice: "799.00",
      price: "749.00",
      onSale: true
    },
    {
      id: "product27",
      image: "/images/Mini Fridge with Freezer for Bedroom.jpg",
      title: "Mini Fridge with Freezer for Bedroom Office or Dorm with Adjustable Remove Glass Shelves Compact Refrigerator",
      rating: 5,
      originalPrice: "499.00",
      price: "449.00",
      onSale: true
    },
    {
      id: "product28",
      image: "/images/2 Door Apartment Size Refrigerator.jpg",
      title: "2 Door Apartment Size Refrigerator with Freezer, 7.2 cu ft, Platinum Series, Stainless Steel",
      rating: 5,
      originalPrice: "899.00",
      price: "849.00",
      onSale: true
    }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <ProductCategory
          title="Kitchen appliances"
          products={kitchenAppliances}
          showMoreLink={true}
        />

        <ProductCategory
          title="Refrigerator"
          products={refrigerators}
          showMoreLink={true}
        />
      </div>
    </>
  );
};

export default MidCategory2;
