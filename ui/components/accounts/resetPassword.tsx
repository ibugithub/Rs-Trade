'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const ResetPassword = ({ token }: { token: string }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users/resetPassword/`;
      const response = await axios.post(url, {
        token: token,
        password: formData.password
      });
      if (response.status === 200) {
        toast.success("Password reset successfully!");
        router.push('/accounts/signin');
      }
    } catch (error) {
      console.error("An error occurred while resetting password at resetPassword.tsx", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 bg-opacity-80 backdrop-blur-lg border border-blue-500 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white tracking-wider">
          Reset Password
        </h2>
        <p className="text-center text-gray-300">
          Enter your new password below.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border border-blue-500 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-blue-300"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              placeholder="Enter your password again"
              className="w-full mt-1 px-4 py-2 border border-blue-500 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-blue-300"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 text-black bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-full transition ease-in-out duration-300"
          >
            Reset Password
          </button>
        </form>
        <div className="text-center">
          <a href="/accounts/signin" className="text-blue-400 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
