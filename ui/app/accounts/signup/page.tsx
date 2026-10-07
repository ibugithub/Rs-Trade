import Signup from "@/components/accounts/signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account | RS Trade International",
  description: "Create your RS Trade International account.",
  robots: { index: false, follow: true },
};

export default function Register() {
  return (
    <>
      <Signup />
    </>
  );
}
