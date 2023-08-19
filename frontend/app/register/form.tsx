"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form as AForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCount, setHash, setUser } from "@/store/user/slice";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const formSchema = z
    .object({
      email: z.string().email(),
      password1: z.string().min(5),
      phoneNumber: z.string().min(8),
      password2: z.string().min(5),
      name: z.string().min(5),
    })
    .refine((data) => data.password1 === data.password2, {
      message: "Passwords don't match",
      path: ["password2"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password1: "",
      password2: "",
      name: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (body: z.infer<typeof formSchema>) => {
    setDisabled(true);
    const data = {
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: body.password2,
      name: body.name,
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setSuccessMsg(res?.data?.message);
        dispatch(setUser(res?.data?.user))
        dispatch(setHash(res?.data?.hash));
        dispatch(setCount(60))
        router.push("/otp");
      })
      .catch((err) => {
        if (err?.response?.data?.message?.length > 0) {
          setErrMsg(err?.response?.data?.message[0]);
        } else if (err?.response?.data?.error) {
          setErrMsg(err?.response?.data?.error);
        } else {
          setErrMsg("Something went wrong.");
        }
      })
      .finally(() => {
        setDisabled(false);
      });
  };

  return (
    <AForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 flex items-center justify-center flex-col md:p-0 p-4"
      >
        <strong className="text-4xl text-center">
          Welcome, Abord! <br />
          Now Register.
        </strong>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="Zoro..." {...field} className="w-[20rem]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@gmail.com..."
                  {...field}
                  className="w-[20rem]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phonenumber</FormLabel>
              <FormControl>
                <Input
                  placeholder="+19100235468..."
                  {...field}
                  className="w-[20rem]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password*</FormLabel>
              <FormControl>
                <Input
                  placeholder="example123..."
                  {...field}
                  className="w-[20rem]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ReType Password*</FormLabel>
              <FormControl>
                <Input
                  placeholder="example123..."
                  {...field}
                  className="w-[20rem]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <strong>
          Already registered?{" "}
          <Link
            href="/login"
            className="hover:text-sky-600 underline underline-offset-2 text-yellow-500"
          >
            Login Here
          </Link>
        </strong>
        <Button
          type="submit"
          disabled={disabled}
          className="bg-yellow-500 transition-colors text-lg duration-500 text-black hover:text-white hover:bg-sky-600"
        >
          <strong>Register</strong>
        </Button>
        {successMsg ? (
          <span className="text-green-600">{successMsg}</span>
        ) : errMsg ? (
          <span className="text-red-800">{errMsg}</span>
        ) : (
          <span>
            <br />
          </span>
        )}
      </form>
    </AForm>
  );
};

export default RegisterForm;
