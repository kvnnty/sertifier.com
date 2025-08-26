import { attachAxiosInterceptors } from "@/config/axios.interceptors";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth/auth.slice";
import organizationReducer from "./features/organization/organization.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  organization: organizationReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

attachAxiosInterceptors(store);

const persistor = persistStore(store);
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { persistor, type AppDispatch, type RootState };

