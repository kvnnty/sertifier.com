import { IOrganization } from "@/types/organization";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchOrganizations } from "./organization.thunks";

interface OrganizationState {
  currentOrganization: IOrganization | null;
  organizations: IOrganization[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  currentOrganization: null,
  organizations: [],
  loading: false,
  error: null,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setCurrentOrganization(state, action: PayloadAction<IOrganization>) {
      state.currentOrganization = action.payload;
    },
    setOrganizations(state, action: PayloadAction<IOrganization[]>) {
      state.organizations = action.payload;
    },
    clearOrganizationState(state) {
      state.currentOrganization = null;
      state.organizations = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentOrganization, setOrganizations, clearOrganizationState } = organizationSlice.actions;
export default organizationSlice.reducer;
