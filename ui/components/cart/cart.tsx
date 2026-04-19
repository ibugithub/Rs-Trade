'use client';

import React, { useState } from 'react';
import { Trash2, Plus, Minus, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Apple iPhone 15 Pro Max",
      price: 1199.99,
      originalPrice: 1299.99,
      quantity: 1,
      image: "/images/headphone.jpg",
      seller: "Apple Store",
      inStock: true,
      prime: true,
      rating: 4.8,
      reviews: 12453,
      delivery: "Tomorrow, Jan 6"
    },
    {
      id: 2,
      name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      price: 349.99,
      originalPrice: 399.99,
      quantity: 2,
      image: "/images/headphone2.jpg",
      seller: "Sony Official",
      inStock: true,
      prime: true,
      rating: 4.7,
      reviews: 8924,
      delivery: "Tomorrow, Jan 6"
    },
    {
      id: 3,
      name: "Amazon Echo Dot (5th Gen) Smart Speaker",
      price: 49.99,
      originalPrice: 59.99,
      quantity: 1,
      image: "/images/headphone3.jpg",
      seller: "Amazon",
      inStock: true,
      prime: true,
      rating: 4.6,
      reviews: 45621,
      delivery: "Tomorrow, Jan 6"
    }
  ]);

  const [savedItems, setSavedItems] = useState([]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const saveForLater = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      setSavedItems(prev => [...prev, item]);
      removeItem(id);
    }
  };

  const moveToCart = (id) => {
    const item = savedItems.find(item => item.id === id);
    if (item) {
      setCartItems(prev => [...prev, item]);
      setSavedItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal > 35 ? 0 : 9.99;
  const tax = subtotal * 0.0875;
  const total = subtotal + shipping + tax;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <p className="text-gray-600 mb-4">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>

              {cartItems.map(item => (
                <div key={item.id} className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:mb-0">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {item.seller}</p>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({item.reviews.toLocaleString()})</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {item.prime && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Prime</span>
                        )}
                        {item.inStock && (
                          <span className="text-green-600 text-sm font-medium">In Stock</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Truck className="w-4 h-4" />
                        <span>FREE delivery {item.delivery}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 border-x">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>

                        <button
                          onClick={() => saveForLater(item.id)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <Heart className="w-4 h-4" />
                          Save for later
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </div>
                      {item.originalPrice > item.price && (
                        <div className="text-sm text-gray-500 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Saved Items */}
            {savedItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Saved for later</h2>
                <div className="space-y-4">
                  {savedItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => moveToCart(item.id)}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You Save</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-4 rounded-lg mb-3">
                  Proceed to Checkout
                </button>
              </Link>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout with 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};