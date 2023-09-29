"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { RootState } from "@/store";
import { setUserDetails } from "@/store/slices/user.slice";
import { Input } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector(
    (state: RootState) => state.user.userDetails
  );
  const { push } = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState<{
    message: string;
    error: boolean;
  } | null>(null);

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/login`,
        {
          email: formData.email?.trim(),
          password: formData.password?.trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        dispatch(setUserDetails(response?.data?.user));
        localStorage.setItem("involveTk", response?.data?.token);
        if (response?.data?.hash) {
          localStorage.setItem("involveUH", response?.data?.hash);
          setMsg({
            message: "You are not verified. " + response?.data?.message,
            error: false,
          });
          setShowOTP(true);
        } else {
          push("/");
        }
      })
      .catch((err) => {
        setMsg({
          message:
            err?.response?.data?.message?.[0] ||
            err?.response?.data?.error ||
            err?.message,
          error: true,
        });
      });
  };

  const handleOTP = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/verify/otp`,
        {
          otp: parseInt(otp),
          userId: userDetails.id,
          hashTimestamp: localStorage.getItem("involveUH"),
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        dispatch(setUserDetails(response?.data?.user));
        localStorage.removeItem("involveUH"),
        push("/");
      })
      .catch((err) => {
        setMsg({
          message:
            err?.response?.data?.message?.[0] ||
            err?.response?.data?.error ||
            err?.message,
          error: true,
        });
      });
  };

  return (
    <form className="flex flex-col p-5 md:w-[40%] mx-auto sm:w-[50%] space-y-5 justify-center items-center">
      {!showOTP && (
        <>
          <div className="flex flex-col w-full">
            <strong>Email:</strong>{" "}
            <Input
              disabled={showOTP}
              placeholder="john@gmail.com"
              name="email"
              className="text-white bg-transparent"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col w-full">
            <strong>Password:</strong>
            <Input.Password
              disabled={showOTP}
              name="password"
              placeholder="John@123"
              className="text-white bg-transparent"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />
          </div>
          <button
            disabled={showOTP}
            onClick={handleLogin}
            className="bg-orange-200 text-black text-xl font-medium hover:bg-orange-300 rounded-md text-center py-1 px-5"
          >
            Login
          </button>
        </>
      )}
      {msg && (
        <small className={msg.error ? "text-red-600" : "text-green-600"}>
          {msg.message}
        </small>
      )}
      {showOTP && (
        <>
          <Input
            name="otp"
            placeholder="OTP"
            className="text-white bg-transparent"
            value={otp}
            onChange={(e) => {
              setOTP(e.target.value);
            }}
          />
          <button
            onClick={handleOTP}
            className="bg-orange-200 text-black text-xl font-medium hover:bg-orange-300 rounded-md text-center py-1 px-5"
          >
            Verify OTP
          </button>
        </>
      )}
    </form>
  );
};

export default LoginForm;
