export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2 text-gray-500 font-semibold text-lg">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            RsTrader
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Shop</h4>
          <ul className="space-y-1">
            <li><a href="#" className="text-blue-600 hover:underline">Hot deals</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Categories</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Brands</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Rebates</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Weekly deals</a></li>
          </ul>
        </div>

        {/* Need help */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Need help?</h4>
          <ul className="space-y-1">
            <li><a href="#" className="text-blue-600 hover:underline">Contact</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Order tracking</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">FAQs</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Return policy</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Privacy policy</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
          <p className="text-blue-600">123 Fifth Avenue, New York, NY 10160</p>
          <p className="text-blue-600 mt-1">contact@info.com</p>
          <p className="text-blue-600 mt-1">929-242-6868</p>
        </div>
      </div>
    </footer>
  );
};
