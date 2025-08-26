import axiosClient from "@/config/axios.config";
import { Organization } from "@/types/organization";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchOrganizations = createAsyncThunk<Organization[], void, { rejectValue: string }>("organization/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get("/organizations/my-organizations");
    return response.data.organizations;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch organizations");
  }
});
