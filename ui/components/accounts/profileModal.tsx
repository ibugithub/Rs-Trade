import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/configs/redux/hooks";
import { useState } from "react";
import { fetchLoggedInUser } from "@/configs/redux/auth/authSlice";

export const ProfileModal = () => {
  const authState = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(fetchLoggedInUser());
  };

  return (
    <>
      {authState.isAuthenticated ? (
        <div className="relative">
          {/* User name button styled with neon border and dark theme */}
          <button
            type="button"
            className="text-white font-medium cursor-pointer px-4 py-2 rounded-lg border border-blue-500 hover:bg-blue-500 transition-colors"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            {authState.loogedInUser.name}
          </button>

          {isModalOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-black bg-opacity-70 backdrop-blur-md rounded-lg border border-blue-500 shadow-xl z-10">
              <Link
                href="/accounts/profile"
                className="block px-4 py-3 text-white hover:bg-blue-600 transition-colors"
              >
                Profile
              </Link>
              <button
                type="button"
                className="w-full text-left rounded-md px-4 py-3 text-white hover:bg-red-800 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        // SIGN IN button with neon gradient background
        <Link
          href="/accounts/signin"
          className="text-white hover:text-blue-100"
        >
          Log In
        </Link>
      )}
    </>
  );
};
