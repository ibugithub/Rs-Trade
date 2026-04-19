export const Categories = () => {
  const categoryData = [
    {
      id: 1,
      name: "AIR CONDITIONER",
      image: "/api/placeholder/250/200",
      productCount: 4
    },
    {
      id: 2,
      name: "AUDIO & VIDEO",
      image: "/api/placeholder/250/200",
      productCount: 5
    },
    {
      id: 3,
      name: "GADGETS",
      image: "/api/placeholder/250/200",
      productCount: 6
    },
    {
      id: 4,
      name: "HOME APPLIANCES",
      image: "/api/placeholder/250/200",
      productCount: 5
    },
    {
      id: 5,
      name: "KITCHEN APPLIANCES",
      image: "/api/placeholder/250/200",
      productCount: 6
    },
    {
      id: 6,
      name: "PCS & LAPTOP",
      image: "/api/placeholder/250/200",
      productCount: 4
    },
    {
      id: 7,
      name: "REFRIGERATOR",
      image: "/api/placeholder/250/200",
      productCount: 4
    },
    {
      id: 8,
      name: "SMART HOME",
      image: "/api/placeholder/250/200",
      productCount: 5
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white mt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {categoryData.map((category) => (
          <div key={category.id} className="flex flex-col items-center group cursor-pointer">
            <div className="relative w-full mb-4 bg-gray-100 overflow-hidden aspect-w-1 aspect-h-1 rounded-md">
              {/* Category Image - Using placeholder image */}
              <div className="w-full h-48 p-4 flex items-center justify-center bg-white border border-gray-200 rounded-md transition-transform duration-300 group-hover:scale-105">
                {category.id === 1 && (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="w-4/5 h-3/5 bg-white border border-gray-200 rounded-sm grid grid-cols-12 gap-0.5">
                      {[...Array(120)].map((_, i) => (
                        <div key={i} className="w-full h-full bg-gray-200 rounded-sm"></div>
                      ))}
                    </div>
                  </div>
                )}
                
                {category.id === 2 && (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="w-4/5 h-3/5 bg-gray-200 border border-gray-800 rounded-sm relative">
                      <div className="absolute bottom-0 w-full h-1/6 bg-gray-800"></div>
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gray-300"></div>
                    </div>
                  </div>
                )}
                
                {category.id === 3 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-1/2 h-4/5 bg-gradient-to-b from-blue-400 via-green-400 to-purple-500 rounded-2xl border-4 border-black relative">
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-black rounded-full"></div>
                    </div>
                  </div>
                )}
                
                {category.id === 4 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-3/4 h-4/5 bg-white border border-gray-200 rounded-md flex flex-col">
                      <div className="h-1/6 w-full bg-gray-100 border-b border-gray-200 flex items-center justify-center">
                        <div className="w-1/3 h-1/2 bg-gray-800 rounded-sm"></div>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-3/5 h-3/5 rounded-full border-4 border-gray-300 relative flex items-center justify-center">
                          <div className="w-3/4 h-3/4 rounded-full border-t-4 border-blue-400 animate-spin"></div>
                        </div>
                      </div>
                      <div className="h-1/6 w-full bg-gray-100 border-t border-gray-200"></div>
                    </div>
                  </div>
                )}
                
                {category.id === 5 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-3/4 h-4/5 bg-white border border-gray-300 rounded-sm flex flex-col">
                      <div className="h-1/5 border-b border-gray-300 flex items-center justify-around px-2">
                        <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                        <div className="w-8 h-3 bg-gray-800"></div>
                        <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                      </div>
                      <div className="flex-1 border-b border-gray-300 p-2">
                        <div className="w-full h-full bg-gray-900 rounded-sm"></div>
                      </div>
                      <div className="h-1/6 flex items-center justify-center">
                        <div className="w-1/2 h-1 bg-gray-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {category.id === 6 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-4/5 h-3/5 bg-gray-900 border border-gray-800 rounded-md flex flex-col relative">
                      <div className="absolute -bottom-2 w-full h-1/6 bg-gray-800 rounded-b-md"></div>
                      <div className="w-full h-full p-1">
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-orange-400 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {category.id === 7 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-3/4 h-4/5 bg-gray-200 border border-gray-300 rounded-md flex flex-col">
                      <div className="h-2/3 border-b border-gray-300 flex">
                        <div className="w-1/2 border-r border-gray-300"></div>
                        <div className="w-1/2"></div>
                      </div>
                      <div className="h-1/3 flex">
                        <div className="w-full"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {category.id === 8 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-1/2 h-4/5 rounded-md flex flex-col">
                      <div className="h-1/2 w-full bg-gray-200 rounded-t-full"></div>
                      <div className="h-1/2 w-full bg-gray-400 rounded-b-lg"></div>
                    </div>
                  </div>
                )}
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
          </div>
        ))}
      </div>
    </div>
  );
};