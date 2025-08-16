import { logout, updateAccessToken } from "@/lib/store/features/auth/auth.slice";
import type { Store } from "@reduxjs/toolkit";
import axiosClient from "./axios.config";

export function attachAxiosInterceptors(store: Store) {
  axiosClient.interceptors.request.use(
    (config) => {
      const accessToken = store.getState().auth.accessToken;
      if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const isRefreshingRequest = originalRequest.url?.includes("/auth/refresh");
      const is401 = error.response?.status === 401;

      if (is401 && !originalRequest._retry && !isRefreshingRequest) {
        originalRequest._retry = true;

        try {
          const res = await axiosClient.post("/auth/refresh");
          const { accessToken } = res.data;

          if (accessToken) {
            store.dispatch(updateAccessToken(accessToken));
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosClient(originalRequest);
          }
        } catch (err) {
          store.dispatch(logout());
          localStorage.clear();
          window.location.href = "/auth/login";
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
}
