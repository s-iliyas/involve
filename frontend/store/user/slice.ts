import { createSlice } from "@reduxjs/toolkit";

interface User {
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  isVerified: string;
  id: string;
}

const initialState: {
  user: User;
  hash: string;
  count: number;
  apiUserMessage: string;
  involveToken: string;
} = {
  user: {
    name: "",
    email: "",
    phoneNumber: "",
    createdAt: "",
    updatedAt: "",
    isVerified: "",
    id: "",
  },
  hash: "",
  count: 60,
  apiUserMessage: "holaa",
  involveToken: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setHash: (state, action) => {
      state.hash = action.payload;
    },
    setInvolveToken: (state, action) => {
      state.involveToken = action.payload;
    },
    decrement: (state, action) => {
      if (state.count > 0) {
        state.count -= action.payload;
      }
    },
    setApiUserMessage: (state, action) => {
      state.apiUserMessage = action.payload;
    },
  },
});

export const {
  setUser,
  setHash,
  decrement,
  setApiUserMessage,
  setInvolveToken,
  setCount,
} = userSlice.actions;
export default userSlice.reducer;
