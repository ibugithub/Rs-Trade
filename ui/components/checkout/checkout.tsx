'use client';
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, ChevronUp, MapPin, CreditCard, Shield, Truck, Star, Gift, Plus, Edit3, Check } from 'lucide-react';

export const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false);

  const cartItems = [
    {
      id: 1,
      name: "Apple iPhone 15 Pro Max",
      price: 1199.99,
      quantity: 1,
      image: "/images/headphone.jpg",
      prime: true,
      delivery: "Tomorrow, Jan 6"
    },
    {
      id: 2,
      name: "Sony WH-1000XM5 Wireless Headphones",
      price: 349.99,
      quantity: 2,
      image: "/images/headphone2.jpg",
      prime: true,
      delivery: "Tomorrow, Jan 6"
    }
  ];

  const addresses = [
    {
      id: 1,
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "(555) 123-4567",
      isDefault: true
    },
    {
      id: 2,
      name: "John Doe",
      street: "456 Oak Avenue",
      city: "Brooklyn",
      state: "NY",
      zip: "11201",
      phone: "(555) 123-4567",
      isDefault: false
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      name: "Visa ending in 1234",
      last4: "1234",
      expiry: "12/27",
      isDefault: true
    },
    {
      id: 2,
      type: "card",
      name: "Mastercard ending in 5678",
      last4: "5678",
      expiry: "08/26",
      isDefault: false
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.0875;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    alert("Order placed successfully! This is a demo checkout.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="w-4 h-4 mr-1" />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Flow */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${currentStep >= 1 ? 'bg-orange-500' : 'bg-gray-400'}`}>
                      {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
                    </div>
                    <h2 className="ml-3 text-xl font-bold text-gray-900">Choose a delivery address</h2>
                  </div>
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>
              
              {currentStep === 1 && (
                <div className="p-6">
                  <div className="space-y-4">
                    {addresses.map((address, index) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddress === index ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(index)}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            checked={selectedAddress === index}
                            className="mt-1 text-orange-500"
                            readOnly
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{address.name}</span>
                              {address.isDefault && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Default</span>
                              )}
                            </div>
                            <div className="text-gray-600 text-sm mt-1">
                              {address.street}, {address.city}, {address.state} {address.zip}
                            </div>
                            <div className="text-gray-600 text-sm">{address.phone}</div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Add a new address
                    </button>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-6 rounded-lg"
                    >
                      Use this address
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep > 1 && (
                <div className="p-6 bg-gray-50 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {addresses[selectedAddress].name} - {addresses[selectedAddress].street}, {addresses[selectedAddress].city}, {addresses[selectedAddress].state} {addresses[selectedAddress].zip}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-400'}`}>
                      {currentStep > 2 ? <Check className="w-5 h-5" /> : '2'}
                    </div>
                    <h2 className="ml-3 text-xl font-bold text-gray-900">Choose a payment method</h2>
                  </div>
                  {currentStep > 2 && (
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>
              
              {currentStep === 2 && (
                <div className="p-6">
                  <div className="space-y-4">
                    {paymentMethods.map((payment, index) => (
                      <div
                        key={payment.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPayment === index ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPayment(index)}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            checked={selectedPayment === index}
                            className="text-orange-500"
                            readOnly
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-gray-400" />
                              <span className="font-medium">{payment.name}</span>
                              {payment.isDefault && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Default</span>
                              )}
                            </div>
                            <div className="text-gray-600 text-sm">Expires {payment.expiry}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                      className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Add a new payment method
                    </button>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-6 rounded-lg"
                    >
                      Use this payment method
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep > 2 && (
                <div className="p-6 bg-gray-50 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>{paymentMethods[selectedPayment].name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Review Items */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${currentStep >= 3 ? 'bg-orange-500' : 'bg-gray-400'}`}>
                    3
                  </div>
                  <h2 className="ml-3 text-xl font-bold text-gray-900">Review items and delivery</h2>
                </div>
              </div>
              
              {currentStep === 3 && (
                <div className="p-6">
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {item.prime && (
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Prime</span>
                            )}
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Truck className="w-4 h-4" />
                            <span>FREE delivery {item.delivery}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-8 rounded-lg text-lg"
                    >
                      Place your order
                    </button>
                    <p className="text-sm text-gray-600 mt-2">
                      By placing your order, you agree to Amazon's privacy notice and conditions of use.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
                <button
                  onClick={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
                  className="lg:hidden"
                >
                  {orderSummaryExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              
              <div className={`${orderSummaryExpanded ? 'block' : 'hidden'} lg:block`}>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Items ({cartItems.length})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping & handling</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-red-600">
                      <span>Order total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Protected by Amazon A-to-Z Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>FREE delivery on orders over $25</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    <span>Gift options available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
