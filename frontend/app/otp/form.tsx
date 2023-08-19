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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { decrement, setCount, setHash, setUser } from "@/store/user/slice";
import { cn } from "@/lib/utils";

const OTPForm = () => {
  const [errMsg, setErrMsg] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const count = useAppSelector((state) => state.user.count);
  const email = useAppSelector((state) => state.user.user.email);

  if (!email) {
    router.push("/");
  }

  const hash = useAppSelector((state) => state.user.hash);
  const formSchema = z.object({
    otp: z.string().max(4),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  let decrementInterval: string | number | NodeJS.Timeout | undefined;

  const onSubmit = async (body: z.infer<typeof formSchema>) => {
    if (!body?.otp) {
      setErrMsg("OTP Required.");
      return;
    } else {
      const data = {
        email,
        hashTimestamp: hash,
        otp: parseInt(body.otp),
      };
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/verify/otp`, data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          setSuccessMsg(res?.data?.message);
          dispatch(setUser(res?.data?.user));
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        })
        .catch((err) => {
          if (err?.response?.data?.error) {
            setErrMsg(err?.response?.data?.error);
          } else {
            setErrMsg("Something went wrong.");
          }
        });
    }
  };

  const sendOTP = async () => {
    const data = { email };
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/send/otp`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setSuccessMsg(res?.data?.message);
        dispatch(setUser(res?.data?.user));
        dispatch(setHash(res?.data?.hash));
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setErrMsg(err?.response?.data?.error);
        } else {
          setErrMsg("Something went wrong.");
        }
      })
      .finally(() => {
        dispatch(setCount(60));
        setDisabled(true);
      });
  };

  useEffect(() => {
    if (count === 0) {
      clearInterval(decrementInterval);
      setDisabled(false);
    }
  }, [count]);

  useEffect(() => {
    if (email) {
      setDisabled(true);
      decrementInterval = setInterval(() => {
        dispatch(decrement(1));
      }, 1000);
    }
    if (count === 0) {
      setDisabled(false);
    }
  }, []);

  return (
    <AForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 flex items-center justify-center flex-col md:p-0 p-4"
      >
        <strong className="text-4xl text-center">
          Great! Now
          <br />
          Let's Verify.
        </strong>
        <p>OTP has been sent to {email} .</p>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <Input placeholder="123.." {...field} className="w-[20rem]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-yellow-500 w-[15rem] transition-colors text-lg duration-500 text-black hover:text-white hover:bg-sky-600"
        >
          <strong>Submit</strong>
        </Button>
        <Button
          type="submit"
          disabled={disabled}
          className={cn(
            "bg-yellow-500 w-[15rem] text-black flex flex-row space-x-2 items-center justify-center ",
            disabled
              ? "cursor-wait"
              : "transition-colors text-lg duration-500  hover:text-white hover:bg-sky-600"
          )}
          onClick={sendOTP}
        >
          <strong>Request OTP</strong>
          {disabled && (
            <p className="rounded-full text-sm px-1 border-black border-2 text-black">
              {count}
            </p>
          )}
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

export default OTPForm;
