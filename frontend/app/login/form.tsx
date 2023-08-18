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

const LoginForm = () => {
  const [errMsg, setErrMsg] = useState("");

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setErrMsg(err?.response?.data?.error);
        } else {
          setErrMsg("Something went wrong.");
        }
      });
  };

  return (
    <AForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 flex items-center justify-center flex-col md:p-0 p-4"
      >
        <strong className="text-4xl text-center">
          Welcome, Back! <br />
          Let's Login.
        </strong>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="a@a.com..."
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@123..."
                  {...field}
                  className="w-[20rem]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <strong>
          New user?{" "}
          <Link
            href="/register"
            className="hover:text-sky-600 underline underline-offset-2 text-yellow-500"
          >
            Register Here
          </Link>
        </strong>
        <Button
          type="submit"
          className="bg-yellow-500 transition-colors text-lg duration-500 text-black hover:text-white"
        >
          <strong>Login</strong>
        </Button>
        {errMsg ? (
          <span className="text-red-900">{errMsg}</span>
        ) : (
          <span>
            <br />
          </span>
        )}
      </form>
    </AForm>
  );
};

export default LoginForm;
