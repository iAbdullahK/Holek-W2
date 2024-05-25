import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function SignInPage() {
  return (
    <div className="bg-purple-800 h-screen flex flex-col justify-center items-center">
      <div className="text-white text-3xl font-bold mb-8">HOLEK</div>
      <SignIn path="/sign-in" />
      <div className="text-white text-lg mt-8 font-semibold">About Us</div>
      <div className="text-white text-sm mb-2 max-w-md text-center">
        Holek is your all-in-one solution for managing your food truck business. From order management to inventory tracking, we've got you covered. With our intuitive web-based Point of Sale system, you can efficiently manage your sales and streamline your operations.
      </div>
    </div>
  );
}
