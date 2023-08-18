import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

interface User {
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  isVerfied: string;
  id: string;
}

const initialState: {
  user: User ;
  hash: string;
  count: number;
  apiUserMessage: string;
} = {
  user: {
    name: "",
    email: "",
    phoneNumber: "",
    createdAt: "",
    updatedAt: "",
    isVerfied: "",
    id: ""
  },
  hash: "",
  count: 60,
  apiUserMessage: "holaa",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setHash: (state, action) => {
      state.hash = action.payload;
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

export const { setUser, setHash, decrement, setApiUserMessage } =
  userSlice.actions;
export default userSlice.reducer;
