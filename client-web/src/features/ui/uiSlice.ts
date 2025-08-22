import {type PayloadAction, createSlice} from "@reduxjs/toolkit";

type UiState =  {
    theme: "light" | "dark";
};

const initialState: UiState = {theme: "dark"};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<"light" | "dark">) {
            state.theme = action.payload;
        },
    },
});

export const {setTheme} = uiSlice.actions;
export const uiReducer = uiSlice.reducer;