import axios from "axios";
import { useEffect, useState } from "react";

const useLogout = (accessToken: string) => {
  const [msg, setMsg] = useState("");

  const logout = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/logout`,
        { withCredentials: true }
      );
      setMsg(response.data.message);
    } catch (error) {
      console.log(error instanceof Error ? error?.message : String(error));
    }
  };

  return { msg, logout };
};

export default useLogout;
