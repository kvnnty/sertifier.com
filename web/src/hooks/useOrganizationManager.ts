import { AppDispatch } from "@/lib/store";
import { setCurrentOrganization } from "@/lib/store/features/organization/organization.slice";
import { fetchOrganizations } from "@/lib/store/features/organization/organization.thunks";
import { Organization } from "@/types/organization";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export const useOrganizationManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  const loadOrganizations = useCallback(() => {
    return dispatch(fetchOrganizations()).unwrap();
  }, [dispatch]);

  const selectOrganization = useCallback(
    (org: Organization) => {
      dispatch(setCurrentOrganization(org));
    },
    [dispatch]
  );

  return {
    loadOrganizations,
    selectOrganization,
  };
};
