import Image from "next/image";
import React from "react";
import RegisterForm from "./form";

const Register = () => {
  return (
    <div className="flex flex-row pt-16 justify-center">
      <div className="pt-14 flex  items-center flex-col space-y-4 ">
        <RegisterForm />
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

export default Register;
