export const TopBanner = () => {

  return (
    <>
      {/* Promotional Banners */}
      <div className="max-w-7xl mx-auto  mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {/* Left Banner */}
        <div className="relative bg-blue-500 rounded-md overflow-hidden">
          <div className="p-8 flex flex-col justify-center h-full">
            <h2 className="text-3xl font-bold text-white leading-tight">
              The only case <br />you need.
            </h2>
            <button className="mt-4 text-white font-medium inline-block hover:underline">
              Shop now
            </button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-end">
            <div className="flex space-x-2 mr-4">
              <div className="h-20 w-6 bg-blue-700 rounded-full"></div>
              <div className="h-20 w-6 bg-teal-500 rounded-full"></div>
              <div className="h-20 w-6 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Banner */}
        <div className="relative bg-gray-200 rounded-md overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="text-xs font-semibold text-gray-800">BRAND DAY</span>
          </div>
          <div className="p-8 flex flex-col items-end justify-center h-full">
            <h2 className="text-4xl font-bold text-white leading-tight text-right">
              Get 30% OFF
            </h2>
            <button className="mt-4 text-white font-medium inline-block hover:underline">
              Shop now
            </button>
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-full w-2/3 flex items-center">
            <div className="grid grid-cols-2 gap-2 ml-4">
              <div className="h-16 w-16 bg-black rounded-md"></div>
              <div className="h-12 w-12 bg-gray-800 rounded-md mt-4"></div>
              <div className="h-10 w-10 bg-gray-700 rounded-md"></div>
              <div className="h-8 w-8 bg-gray-600 rounded-md mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}