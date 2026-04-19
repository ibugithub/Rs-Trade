'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GoogleSignInButton } from "./googleSignIn";
import { FacebookSignInButton } from "./facebookSignIn";
import { MicrosoftSignInButton } from "./microsoftSignIn";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.username) {
      setError("Username is required");
      setLoading(false);
      return;
    }
    if (!formData.email) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }
    if (!formData.confirmPassword) {
      setError("Confirm Password is required");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      await axios.post(`${baseUrl}/api/users/create/`, {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
      });
      toast.success("A verification email has been sent to your email address");
      router.push("/accounts/signin");
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.error);
          console.error(err.response.data.error);
        } else {
          setError("An unexpected error occurred");
          console.error(err);
        }
      } else {
        setError("An unexpected error occurred");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-black py-12 px-4">
      {/* Background blockchain overlay (optional) */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/blockchain-bg.jpg"
          alt="Blockchain Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="rounded-xl bg-gray-900 bg-opacity-80 backdrop-blur-lg border border-blue-500 p-10 shadow-2xl"
        >
          <h2 className="mb-8 text-center text-4xl font-bold text-white tracking-wider">
            Create an Account
          </h2>

          {/* Social Sign-Up Buttons */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <GoogleSignInButton type="SignUp" />
            <FacebookSignInButton type="SignUp" />
            <MicrosoftSignInButton type="SignUp" />
          </div>

          <div className="mb-8 flex items-center justify-center">
            <span className="hidden h-px w-full max-w-[200px] bg-blue-500 md:block"></span>
            <p className="px-4 text-center text-white">Or, register with your email</p>
            <span className="hidden h-px w-full max-w-[200px] bg-blue-500 md:block"></span>
          </div>

          <form>
            <div className="mb-8 flex flex-col gap-8 md:flex-row md:justify-between">
              <input
                name="username"
                type="text"
                placeholder="User name"
                value={formData.username}
                onChange={handleChange}
                className="w-full border-b border-blue-500 bg-transparent pb-3 text-white placeholder-blue-300 focus:border-blue-400 focus:outline-none md:w-1/2"
              />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-blue-500 bg-transparent pb-3 text-white placeholder-blue-300 focus:border-blue-400 focus:outline-none md:w-1/2"
              />
            </div>

            <div className="mb-8 flex flex-col gap-8 md:flex-row md:justify-between">
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b border-blue-500 bg-transparent pb-3 text-white placeholder-blue-300 focus:border-blue-400 focus:outline-none md:w-1/2"
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-b border-blue-500 bg-transparent pb-3 text-white placeholder-blue-300 focus:border-blue-400 focus:outline-none md:w-1/2"
              />
            </div>

            {error && (
              <div className="mb-4 text-center text-red-500">{error}</div>
            )}

            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div className="flex items-center">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  className="peer sr-only"
                />
                <span className="border-gray-300 bg-gray-800 text-blue-400 dark:border-gray-600 dark:bg-gray-700 group mt-1 flex h-5 w-5 items-center justify-center rounded peer-checked:bg-blue-500">
                  <svg
                    className="opacity-0 peer-checked:opacity-100"
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.70704 0.792787C9.89451 0.980314 9.99983 1.23462 9.99983 1.49979C9.99983 1.76495 9.89451 2.01926 9.70704 2.20679L4.70704 7.20679C4.51951 7.39426 4.26521 7.49957 4.00004 7.49957C3.73488 7.49957 3.48057 7.39426 3.29304 7.20679L0.293041 4.20679C0.110883 4.01818 0.0100885 3.76558 0.0123669 3.50339C0.0146453 3.24119 0.119814 2.99038 0.305222 2.80497C0.490631 2.61956 0.741443 2.51439 1.00364 2.51211C1.26584 2.50983 1.51844 2.61063 1.70704 2.79279L4.00004 5.08579L8.29304 0.792787C8.48057 0.605316 8.73488 0.5 9.00004 0.5C9.26521 0.5 9.51951 0.605316 9.70704 0.792787Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <label
                  htmlFor="default-checkbox"
                  className="ml-3 cursor-pointer text-white"
                >
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                aria-label="signup with email and password"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500 px-8 py-3 font-bold text-black transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-green-600"
                onClick={handleSubmit}
              >
                {loading ? "Creating Account..." : "Create Account"}
                <svg
                  className="fill-current"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z" />
                </svg>
              </button>
            </div>

            <div className="mt-10 border-t border-blue-500 pt-5 text-center">
              <p className="text-white">
                Already have an account?{" "}
                <Link
                  href="/accounts/signin"
                  className="text-blue-400 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Signup;
