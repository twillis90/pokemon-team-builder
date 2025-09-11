import { backendApi } from "./services/backendApi";
import { configureStore } from "@reduxjs/toolkit";
import { pokeApi } from "./services/pokeApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import teamsReducer from "../src/teams/teamSlice"
import { uiReducer } from "./features/ui/uiSlice";
import userReducer from "../src/user/userSlice";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        user: userReducer,
        teams: teamsReducer,
        [pokeApi.reducerPath]: pokeApi.reducer,
        [backendApi.reducerPath]: backendApi.reducer,
        //authReducer => to add later
        //api.reducer => to add later
    },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokeApi.middleware, backendApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;