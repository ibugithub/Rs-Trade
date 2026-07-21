import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Audio & Video",
    link: "#",
    products: [
      {
        id: 'product1',
        title: "Max 5.1 Home Theater",
        price: "$620.00",
        oldPrice: null,
        image: "/images/Max 5.1 Home Theater.jpg",
        isOnSale: false,
      },
      {
        id: 'product2',
        title: "V-Series 5.1 Home Theater",
        price: "$499.00",
        oldPrice: "$799.00",
        image: "/images/V-Series 5.1 Home Theater.jpg",
        isOnSale: true,
      },
      {
        id: 'product3',
        title: "OLED C4 Series 55” 4K TV",
        price: "$1,249.00",
        oldPrice: null,
        image: "/images/OLED C4 Series 55” 4K TV.jpg",
        isOnSale: false,
      },
      {
        id: 'product4',
        title: "X90J 65 Inch TV 4K",
        price: "$1,329.00",
        oldPrice: "$1,499.00",
        image: "/images/Audio.jpg",
        isOnSale: true,
      },
    ],
  },
  {
    title: "Home appliances",
    link: "#",
    products: [
      {
        id: 'product5',
        title: "Multigroomer Grooming Kit",
        price: "$44.00",
        oldPrice: "$60.00",
        image: "/images/Multigroomer Grooming Kit.jpg",
        isOnSale: true,
      },
      {
        id: 'product6',
        title: "Compact Pulsator Washer",
        price: "$259.00",
        oldPrice: "$319.00",
        image: "/images/Compact Pulsator Washer.jpg",
        isOnSale: false,
      },
      {
        id: 'product7',
        title: "Full-Auto Compact Washer",
        price: "$270.00",
        oldPrice: "$309.00",
        image: "/images/Full-Auto Compact Washer.jpg",
        isOnSale: true,
      },
      {
        id: 'product8',
        title: "Small Space Dryer",
        price: "$349.00",
        oldPrice: null,
        image: "/images/Small Space Dryer.jpg",
        isOnSale: false,
      },
    ],
  },
  {
    title: "Air conditioner",
    link: "#",
    products: [
      {
        id: 'product9',
        title: "AC 5000 BTU for Small Rooms",
        price: "$139.00",
        oldPrice: "$159.00",
        image: "/images/AC 5000 BTU for Small Rooms.jpg",
        isOnSale: true,
      },
      {
        id: 'product10',
        title: "Dual Hose Portable AC",
        price: "$184.00",
        oldPrice: null,
        image: "/images/Dual Hose Portable AC.jpg",
        isOnSale: false,
      },
      {
        id: 'product11',
        title: "Star 5,000 BTU AC w/ Wi-Fi",
        price: "$199.00",
        oldPrice: null,
        image: "/images/star 5,000 btu ac with_ wi-fi.jpg",
        isOnSale: false,
      },
      {
        id: 'product12',
        title: "BTU Window AC w/ Remote",
        price: "$179.00",
        oldPrice: null,
        image: "/images/btu window ac with_remote.jpg",
        isOnSale: false,
      },
    ],
  },
];

export const MidCategory1 = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-16 space-y-12 ">
      {categories.map((category, i) => (
        <div key={i} className="bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{category.title}</h2>
            <Link href="/category_details" className="text-blue-500 hover:underline">See more</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {category.products.map((product, j) => (
              <div key={j} className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="relative w-full h-40 mb-2">
                  {product.isOnSale && (
                    <span className="absolute top-2 left-2 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                      Sale!
                    </span>
                  )}

                  <Link href={`product/${product.id}`}>
                    <Image src={product.image} alt={product.title} width={200}
                      height={200}
                      className="w-full h-48 object-contain p-4"
                    />
                  </Link>
                </div>
                <div className="text-xs text-yellow-500 mb-1">★★★★★</div>
                <h3 className="text-sm font-medium line-clamp-2">{product.title}</h3>
                <div className="mt-1 text-sm font-semibold">
                  {product.oldPrice && (
                    <span className="text-gray-400 line-through mr-2">{product.oldPrice}</span>
                  )}
                  <span>{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
