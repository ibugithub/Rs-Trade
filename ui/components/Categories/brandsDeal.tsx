import Image from 'next/image';

export const BrandsDeal = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="p-8 md:p-12 flex flex-col justify-center md:w-1/2">
              <p className="text-gray-500 text-sm mb-3">Brand&apos;s deal</p>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Save up to $200 on select Samsung washing machine
              </h2>

              <p className="text-gray-600 mb-6">
                Tortor purus et quis aenean tempus tellus fames.
              </p>

              <div>

                <a
                  href="#"
                  className="inline-block text-blue-500 font-medium hover:underline"
                >
                  Shop now
                </a>

              </div>
            </div>

            <div className="md:w-1/2 relative">
              <Image
                src="/images/washingMachine.jpg"
                alt="Samsung washing machine in a modern laundry room"
                width={600}
                height={400}
                className="h-64 md:h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandsDeal;