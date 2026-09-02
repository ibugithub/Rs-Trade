import React, { useState } from 'react';
import { ChevronRight, X, User, MapPin, Globe, Smartphone, Laptop, Camera, Gamepad2, Car, Home, Heart, Book, Shirt, Dumbbell, Baby, Gift, Utensils, Wrench, Palette, Music } from 'lucide-react';

export const SideBar = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      icon: <Smartphone className="w-5 h-5" />,
      subcategories: [
        'Cell Phones & Accessories',
        'Computers & Tablets',
        'TV & Home Theater',
        'Audio & Headphones',
        'Camera & Photo',
        'Video Games',
        'Wearable Technology',
        'Smart Home',
        'Car Electronics',
        'Portable Audio & Video'
      ]
    },
    {
      id: 'clothing',
      name: 'Clothing, Shoes & Jewelry',
      icon: <Shirt className="w-5 h-5" />,
      subcategories: [
        'Women\'s Clothing',
        'Men\'s Clothing',
        'Girls\' Clothing',
        'Boys\' Clothing',
        'Women\'s Shoes',
        'Men\'s Shoes',
        'Women\'s Jewelry',
        'Men\'s Jewelry',
        'Watches',
        'Handbags & Wallets'
      ]
    },
    {
      id: 'home',
      name: 'Home & Kitchen',
      icon: <Home className="w-5 h-5" />,
      subcategories: [
        'Kitchen & Dining',
        'Bedding & Bath',
        'Furniture',
        'Home Décor',
        'Appliances',
        'Storage & Organization',
        'Cleaning Supplies',
        'Lighting',
        'Garden & Outdoor',
        'Tools & Home Improvement'
      ]
    },
    {
      id: 'books',
      name: 'Books',
      icon: <Book className="w-5 h-5" />,
      subcategories: [
        'Literature & Fiction',
        'Mystery & Thriller',
        'Science Fiction & Fantasy',
        'Romance',
        'Biographies & Memoirs',
        'History',
        'Business & Investing',
        'Self-Help',
        'Health & Fitness',
        'Children\'s Books'
      ]
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      icon: <Dumbbell className="w-5 h-5" />,
      subcategories: [
        'Exercise & Fitness',
        'Sports Equipment',
        'Outdoor Recreation',
        'Team Sports',
        'Water Sports',
        'Winter Sports',
        'Hunting & Fishing',
        'Golf',
        'Cycling',
        'Running'
      ]
    },
    {
      id: 'automotive',
      name: 'Automotive',
      icon: <Car className="w-5 h-5" />,
      subcategories: [
        'Car Care',
        'Car Electronics',
        'Exterior Accessories',
        'Interior Accessories',
        'Lights & Lighting Accessories',
        'Motorcycle & Powersports',
        'Oils & Fluids',
        'Paint & Body Repair',
        'Replacement Parts',
        'Tools & Equipment'
      ]
    },
    {
      id: 'baby',
      name: 'Baby Products',
      icon: <Baby className="w-5 h-5" />,
      subcategories: [
        'Diapering',
        'Feeding',
        'Baby Care',
        'Toys',
        'Clothing',
        'Nursery',
        'Strollers & Travel',
        'Car Seats',
        'Baby & Toddler Toys',
        'Health & Safety'
      ]
    },
    {
      id: 'beauty',
      name: 'Beauty & Personal Care',
      icon: <Heart className="w-5 h-5" />,
      subcategories: [
        'Skincare',
        'Makeup',
        'Hair Care',
        'Fragrance',
        'Tools & Accessories',
        'Personal Care',
        'Oral Care',
        'Shaving & Hair Removal',
        'Foot, Hand & Nail Care',
        'Bath & Body'
      ]
    },
    {
      id: 'grocery',
      name: 'Grocery & Gourmet Food',
      icon: <Utensils className="w-5 h-5" />,
      subcategories: [
        'Fresh Food',
        'Pantry Staples',
        'Beverages',
        'Snacks',
        'Breakfast Foods',
        'Candy & Chocolate',
        'Coffee & Tea',
        'Organic Foods',
        'International Foods',
        'Specialty Diets'
      ]
    },
    {
      id: 'toys',
      name: 'Toys & Games',
      icon: <Gamepad2 className="w-5 h-5" />,
      subcategories: [
        'Action Figures',
        'Building Toys',
        'Dolls & Accessories',
        'Educational Toys',
        'Electronic Toys',
        'Games',
        'Puzzles',
        'Sports & Outdoor Play',
        'Stuffed Animals',
        'Vehicles'
      ]
    },
    {
      id: 'tools',
      name: 'Tools & Home Improvement',
      icon: <Wrench className="w-5 h-5" />,
      subcategories: [
        'Power Tools',
        'Hand Tools',
        'Hardware',
        'Building Supplies',
        'Electrical',
        'Plumbing',
        'Paint & Supplies',
        'Measuring & Layout Tools',
        'Safety & Security',
        'Storage & Organization'
      ]
    },
    {
      id: 'arts',
      name: 'Arts, Crafts & Sewing',
      icon: <Palette className="w-5 h-5" />,
      subcategories: [
        'Painting & Drawing',
        'Beading & Jewelry Making',
        'Fabric',
        'Knitting & Crochet',
        'Scrapbooking',
        'Sewing',
        'Craft Supplies',
        'Gift Wrapping',
        'Party Supplies',
        'Printmaking'
      ]
    },
    {
      id: 'music',
      name: 'Musical Instruments',
      icon: <Music className="w-5 h-5" />,
      subcategories: [
        'Guitars',
        'Keyboards & Pianos',
        'Drums & Percussion',
        'Brass & Woodwind',
        'Strings',
        'DJ & Electronic Music',
        'Recording Equipment',
        'Live Sound & Stage',
        'Accessories',
        'Sheet Music'
      ]
    }
  ];

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6" />
            <span className="font-medium">Hello, Sign in</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Shop by Department */}
        <div className="border-b border-gray-200">
          <div className="p-4 font-bold text-gray-900">Shop by Department</div>
          <div className="pb-4">
            {categories.map((category) => (
              <div key={category.id}>
                <div 
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <span>{category.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === category.id ? 'rotate-90' : ''}`} />
                </div>
                
                {/* Subcategories */}
                {activeCategory === category.id && (
                  <div className="bg-gray-50 border-l-2 border-orange-500">
                    {category.subcategories.map((subcategory, index) => (
                      <div 
                        key={index}
                        className="px-8 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        {subcategory}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Help & Settings */}
        <div className="border-b border-gray-200">
          <div className="p-4 font-bold text-gray-900">Help & Settings</div>
          <div className="pb-4">
            <div className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Your Account</div>
            <div className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
              <Globe className="w-4 h-4" />
              English
            </div>
            <div className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Bangladash
            </div>
            <div className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Customer Service</div>
            <div className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Sign Out</div>
          </div>
        </div>
      </div>
    </>
  );
};

// Updated NavBar component to integrate with the sidebar
export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allProductClicked, setAllProductClicked] = useState(false);

  const handleAllProductsClick = () => {
    setAllProductClicked(true);
  };

  const handleCloseSidebar = () => {
    setAllProductClicked(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-blue-500 z-50 pb-3 pt-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-white font-bold text-xl">Amazon</div>
              
              <div className="relative group">
                <div 
                  className="flex cursor-pointer items-center text-white hover:text-blue-100"
                  onClick={handleAllProductsClick}
                >
                  All products <span className="ml-1">▼</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-white cursor-pointer hover:text-blue-100">Account</div>
              <div className="text-white cursor-pointer hover:text-blue-100">Orders</div>
              <div className="text-white cursor-pointer hover:text-blue-100">Cart</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <SideBar isOpen={allProductClicked} onClose={handleCloseSidebar} />
    </>
  );
};