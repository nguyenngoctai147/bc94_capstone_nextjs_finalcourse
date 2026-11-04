import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "@/store/reducer";

export type { RootState } from "@/store/reducer";

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: false,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
