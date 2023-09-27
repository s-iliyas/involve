import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface InitialState {
  userDetails: {
    name: string;
    id: string;
  };
}

const initialState: InitialState = {
  userDetails: {
    name: "",
    id: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
  },
});

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer;
