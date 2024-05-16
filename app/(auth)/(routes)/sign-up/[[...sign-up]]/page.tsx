import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="bg-purple-800 h-screen flex flex-col justify-center items-center">
      <div className="text-white text-3xl font-bold mb-8">HOLEK</div>
      <SignUp path="/sign-up" />
    </div>
  )
};