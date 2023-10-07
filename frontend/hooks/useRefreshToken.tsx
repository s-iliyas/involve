"use client";

import { useState } from "react";
import axios from "axios";

const useRefreshToken = (accessToken: string) => {
  const [token, setToken] = useState(accessToken);
  const error =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("__involve_login_error");

  let getToken = async (permit?: boolean) => {
    if ((!accessToken || permit) && !error) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/token`,
          { withCredentials: true }
        );
        setToken(response.data.accessToken);
        if (response?.data?.message) {
          localStorage.setItem(
            "__involve_login_error",
            response?.data?.message
          );
        } else {
          localStorage.removeItem("__involve_login_error");
        }
        return true;
      } catch (error) {
        console.log(error instanceof Error ? error?.message : String(error));
      }
    }
  };

  return { getToken, token };
};

export default useRefreshToken;
