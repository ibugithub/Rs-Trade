import Link from 'next/link';
import Image from 'next/image';

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
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="relative">
        {product.onSale && (
          <div className="absolute top-0 right-0 bg-white text-gray-800 px-2 py-1 rounded-sm text-xs font-semibold">
            Sale!
          </div>
        )}
        <div className="flex justify-center mb-4">
          <div className="h-48 w-48 relative">
            <Link href={`/product/${product.id}`} >
              <Image
                alt={product.title}
                width={200}
                height={200}
                src={product.image}
                className="w-full h-48 object-contain p-4"
              />
            </Link>
          </div>
        </div>
      </div>
      <StarRating rating={product.rating} />
      <h3 className="font-semibold text-sm mt-2 leading-tight">
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
    <div className="bg-white shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {showMoreLink && (
          <a href="/category_details" className="text-blue-500 text-sm">
            See more
          </a>
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

export const BottomCategory = () => {
  // Sample PC & Laptop data
  const pcLaptops = [
    {
      id: "product29",
      image: "/images/Pc_laptop.jpg",
      title: "14\" FHD Ultrabook (400 nits) with 10th Gen Intel i7-10510U Processor up to 4.90 GHz, 1 TB PCIe SSD, 16GB RAM, and Windows 11 Pro",
      rating: 5,
      price: "1,099.00",
      onSale: false
    },
    {
      id: "product30",
      image: "/images/13 Ultrabook Gaming Laptop.jpg",
      title: "15.6\" Rugged Ultrabook – 4K UHD – 3840 x 2160 – Intel Core i7 11th Gen i7-11957 2.90 GHz – 32 GB RAM – 1 TB SSD – Carbon Gray",
      rating: 4,
      price: "799.00",
      onSale: false
    },
    {
      id: "product31",
      image: "/images/3 Ultrabook Gaming Laptop.jpg",
      title: "13 Ultrabook Gaming Laptop: Intel Core i7-11657 4 Core, NVIDIA GeForce GTX 1650 Ti Max-Q, 13.3\" 1080p 120Hz, 16GB RAM, 512GB SSD, CNC Aluminum, Chroma RGB, Thunderbolt 4",
      rating: 4,
      originalPrice: "1,499.00",
      price: "1,399.00",
      onSale: true
    },
    {
      id: "product32",
      image: "/images/Pc_laptop.jpg",
      title: "15.6\" FHD Display Laptop – Intel i7 – Intel HD Graphics 6000 , Webcam, WiFi, Bluetooth, HDMI, Windows 11,Grey",
      rating: 5,
      originalPrice: "1,029.00",
      price: "999.00",
      onSale: true
    }
  ];

  // Sample Gadget data
  const gadgets = [
    {
      id: "product33",
      image: "/images/Mirrorless Vlogging Camera Polaroid.jpg",
      title: "Mirrorless Vlogging Camera Polaroid Kit with EF-M 15-45mm Lens, Black",
      rating: 4,
      price: "599.00",
      onSale: false
    },
    {
      id: "product34",
      image: "/images/4K Digital Camera, 12-32mm and 45.jpg",
      title: "4K Digital Camera, 12-32mm and 45-150mm Lens Bundle, 16 Megapixel Kit, 5 Axis In-Body Dual Image Stabilization, Black",
      rating: 5,
      price: "799.00",
      onSale: false
    },
    {
      id: "product35",
      image: "/images/gadgets.jpg",
      title: "Android Tablet 10.5\" LCD Screen 64GB Storage Long-Lasting Battery Kids Content Smart Switch Expandable Memory",
      rating: 5,
      price: "599.00",
      onSale: true
    },
    {
      id: "product36",
      image: "/images/Note 10 Pro 128GB 6GB RAM.jpg",
      title: "Note 10 Pro 128GB 6GB RAM Factory Unlocked (GSM ONLY) International Model",
      rating: 5,
      originalPrice: "699.00",
      price: "659.00",
      onSale: true
    }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <ProductCategory
          title="PCs & Laptop"
          products={pcLaptops}
          showMoreLink={true}
        />

        <ProductCategory
          title="Gadget"
          products={gadgets}
          showMoreLink={true}
        />
      </div>
    </>
  );
};

export default BottomCategory;
