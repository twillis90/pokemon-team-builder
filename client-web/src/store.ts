import { configureStore } from "@reduxjs/toolkit";
import { pokeApi } from "./services/pokeApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { uiReducer } from "./features/ui/uiSlice";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        [pokeApi.reducerPath]: pokeApi.reducer,
        //authReducer => to add later
        //api.reducer => to add later
    },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokeApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;