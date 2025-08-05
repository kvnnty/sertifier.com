import axiosClient from "@/config/axios.config";
import { IOrganization } from "@/types/organization";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchOrganizations = createAsyncThunk<IOrganization[], void, { rejectValue: string }>("organization/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get("/organizations/me");
    return response.data.organizations;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch organizations");
  }
});
