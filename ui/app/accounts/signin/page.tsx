import Signin from "@/components/accounts/signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | RS Trade International",
  description: "Sign in to your RS Trade International account.",
  robots: { index: false, follow: true },
};

const SigninPage = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default SigninPage;
