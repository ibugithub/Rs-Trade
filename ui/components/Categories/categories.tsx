import Link from "next/link";

export const Categories = () => {
  const categoryData = [
    {
      id: 1,
      name: "AIR CONDITIONER",
      slug: "air-conditioner",
      image: "/images/air-conditionar.jpg",
      productCount: 4
    },
    {
      id: 2,
      name: "AUDIO & VIDEO",
      slug: "audio-video",
      image: "/images/Audio.jpg",
      productCount: 5
    },
    {
      id: 3,
      name: "GADGETS",
      slug: "gadget",
      image: "/images/gadgets.jpg",
      productCount: 6
    },
    {
      id: 4,
      name: "HOME APPLIANCES",
      slug: "home-appliances",
      image: "/images/Home_appliance.jpg",
      productCount: 5
    },
    {
      id: 5,
      name: "KITCHEN APPLIANCES",
      slug: "kitchen-appliances",
      image: "/images/kitchen_appliance.jpg",
      productCount: 6
    },
    {
      id: 6,
      name: "PCS & LAPTOP",
      slug: "pcs-laptop",
      image: "/images/Pc_laptop.jpg",
      productCount: 4
    },
    {
      id: 7,
      name: "REFRIGERATOR",
      slug: "refrigerator",
      image: "/images/Regregarator.jpg",
      productCount: 4
    },
    {
      id: 8,
      name: "SMART HOME",
      slug: "smart-home",
      image: "/images/Smart_home.jpg",
      productCount: 5
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white mt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {categoryData.map((category) => (
          <Link
            key={category.id}
            href={`/category_details?category=${category.slug}`}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="relative w-full mb-4 overflow-hidden rounded-md">
              <div className="w-full h-48 p-4 flex items-center justify-center bg-white border border-gray-200 rounded-md transition-transform duration-300 group-hover:scale-105">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            
            {/* Category Name */}
            <h3 className="text-center font-bold text-gray-900">
              {category.name}
            </h3>
            
            {/* Product Count */}
            <p className="text-center text-sm text-gray-500">
              {category.productCount} PRODUCTS
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
