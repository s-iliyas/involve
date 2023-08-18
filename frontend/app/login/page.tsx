import React from "react";
import LoginForm from "./form";
import Image from "next/image";

const Login = () => {
  return (
    <div className="flex flex-row pt-16 justify-center">
      <div className="pt-14 flex  items-center flex-col space-y-4 ">
        <LoginForm />
      </div>
      <div className="lg:block hidden">
        <Image
          height={1000}
          width={1000}
          src={"/images/people.svg"}
          alt="people image"
        />
      </div>
    </div>
  );
};

export default Login;
