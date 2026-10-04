'use client';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const HandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users/forgetPassword/`;
    try {
      const response = await axios.post(url, { email });
      if (response.status === 200) {
        toast.success("Email sent successfully!");
      }
    } catch (error) {
      console.error("An error occurred while sending email at forgotPassword.tsx", error);
      toast.error("Failed to send email. Please try again.");
    }
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white backdrop-blur-lg border border-gray-300 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-900 tracking-wider">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600">
          Enter your email below and weâ€™ll send you instructions to reset your password.
        </p>
        <form className="mt-6 space-y-4" onSubmit={HandleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-500"
              value={email}
              onChange={HandleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-black bg-yellow-300 hover:bg-yellow-500 focus:ring-2 focus:ring-blue-500 rounded-full transition duration-300 ease-in-out"
          >
            Submit
          </button>
        </form>
        <div className="text-center">
          <a href="/accounts/signin" className="text-blue-700 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

