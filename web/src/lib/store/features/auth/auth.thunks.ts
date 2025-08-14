import axiosClient from "@/config/axios.config";
import { User } from "@/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get("/users/me");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch user";
    return rejectWithValue(errorMessage);
  }
});
