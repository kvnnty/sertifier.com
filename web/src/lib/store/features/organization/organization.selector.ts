import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export const useOrganization = () => {
  return useSelector((state: RootState) => {
    const { currentOrganization, organizations, loading, error } = state.organization;
    return {
      currentOrganization,
      organizations,
      loading,
      error,
      hasCurrentOrganization: !!currentOrganization,
    };
  });
};
