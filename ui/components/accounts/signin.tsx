'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/configs/redux/hooks";
import { setUnVerified } from "@/configs/redux/auth/authSlice";
import { useState } from "react";
import { GoogleSignInButton } from "./googleSignIn";
import { FacebookSignInButton } from "./facebookSignIn";
import { MicrosoftSignInButton } from "./microsoftSignIn";
import { useSaveTokens } from "./utils/useSaveTokens";
import { toast } from "react-toastify";
import axios from "axios";
import { ResendVerification } from "./reSendVerification";

export const Signin = () => {
  const dispatch = useAppDispatch();
  const isUnverified = useAppSelector((state) => state.auth.isUnVerified);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const saveTokensToLocal = useSaveTokens();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      const Tokens = await axios.post(`${baseUrl}/api/users/signin/`, {
        email: formData.email,
        password: formData.password,
      });
      saveTokensToLocal(Tokens.data);
    } catch (err) {
      console.log('the error is', err);
      if (err instanceof Error) {
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 405) {
            dispatch(setUnVerified(true));
          }
          setError(err.response.data.error);
          toast.error(err.response.data.error);
        } else {
          setError('An unexpected error occurred');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isUnverified) {
    return <ResendVerification emailProp={formData.email} />;
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-black relative py-20 px-5">
      <div className="absolute inset-0 bg-[url('/images/blockchain-bg.jpg')] bg-cover bg-center opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="relative z-10 bg-black bg-opacity-70 backdrop-blur-lg rounded-2xl border border-blue-500 shadow-2xl p-10 max-w-lg w-full"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Login to Your RsTrade Account
        </h2>

        {/* Social Sign-In Buttons */}
        <div className="flex flex-col gap-4 mb-6 items-center">
          <GoogleSignInButton type="SignIn" />
          <FacebookSignInButton type="SignIn" />
          <MicrosoftSignInButton type="SignIn" />
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-blue-500"></div>
          <span className="mx-4 text-white">Or, login with your email</span>
          <div className="flex-grow border-t border-blue-500"></div>
        </div>

        {/* Email & Password Login */}
        <form onSubmit={handleEmailSignIn}>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent border border-blue-500 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent border border-blue-500 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={() => setKeepSignedIn(!keepSignedIn)}
                className="form-checkbox h-4 w-4 text-blue-500 bg-transparent border-blue-500"
              />
              <span className="ml-2">Keep me signed in</span>
            </label>
            <Link href="/accounts/forgetPassword" className="text-blue-400 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-full font-bold text-black bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white">
            Don&apos;t have an account?{" "}
            <Link href="/accounts/signup" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Signin;
