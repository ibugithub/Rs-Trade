'use client';

import "./globals.css";
import { NavBar } from "@/components/navBar/navbar";
import StoreProvider from "@/app/utils/provider/StoreProvider";
import { useEffect } from "react";
import { useAppDispatch } from "@/configs/redux/hooks";
import { fetchLoggedInUser } from "@/configs/redux/auth/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const ReduxInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);
  return <>{children}</>;
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ReduxInitializer>
            <NavBar />
            <ToastContainer />
            <div className="mt-16">
              {children}
            </div>
          </ReduxInitializer>
        </body>
      </html>
    </StoreProvider>
  );
}
