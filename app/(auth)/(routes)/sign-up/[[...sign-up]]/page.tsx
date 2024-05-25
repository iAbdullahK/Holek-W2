import { SignUp } from "@clerk/nextjs";
import React from "react";

export default function Page() {
  return (
    <div className="bg-purple-800 min-h-screen flex flex-col justify-center items-center">
      <div className="text-white text-5xl font-bold mb-8">Holek</div>
      <SignUp path="/sign-up" />
      <div className="text-white text-lg mt-8 font-semibold">About Us</div>
      <div className="text-white text-sm mb-2 max-w-md text-center">
        Holek is your all-in-one solution for managing your food truck business. From order management to inventory tracking, we've got you covered. With our intuitive web-based Point of Sale system, you can efficiently manage your sales and streamline your operations.
      </div>
    </div>
  );
}