import React from "react";
import LoginForm from "./loginForm";
import Link from "next/link";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-3">
      <strong>Login</strong>
      <small>-----------------------------------</small>
      <LoginForm />
      <p>
        New User? <Link href={"register"} className="underline-offset-2 underline hover:text-sky-300">Register</Link>
      </p>
    </div>
  );
};

export default Login;
