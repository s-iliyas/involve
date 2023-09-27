import React from "react";
import RegisterForm from "./registerForm";
import Link from "next/link";

const Register = () => {
  return (
    <div className="min-h-screen pt-16 pb-5 flex flex-col items-center justify-center space-y-3">
      <strong className="text-xl">Register</strong>
      <small>-----------------------------------</small>
      <RegisterForm />
      <p>
        Already User? <Link href={"login"} className="underline-offset-2 underline hover:text-sky-300">Login</Link>
      </p>
    </div>
  );
};

export default Register;
