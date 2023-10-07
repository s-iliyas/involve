import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface InitialState {
  userDetails: {
    name: string;
    id: string;
  };
  accessToken: string;
  refreshToken: string;
}

const initialState: InitialState = {
  userDetails: {
    name: "",
    id: "",
  },
  refreshToken: "",
  accessToken: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
    },
  },
});

export const { setUserDetails, setAccessToken, setRefreshToken } =
  userSlice.actions;

export default userSlice.reducer;
