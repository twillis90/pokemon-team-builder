import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Pokemon } from "../services/pokeApi";

export interface User {
    id: string;
    displayName: string;
    email: string;
};

type UserState = {
    currentUser: User | null;
};

const initialState: UserState = {
    currentUser: {
        id: "u1",
        displayName: "Ash Ketchum",
        email: "ash@pallet.town",
    }
};

export interface Team {
    id: string;
    name: string;
    pokemon: Pokemon[]
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.currentUser = action.payload;
        },
        updateUser(state, action: PayloadAction<{ displayName: string; email: string }>) {
            if(!state.currentUser) return;
            const { displayName, email } = action.payload;
            state.currentUser.displayName = displayName;
            state.currentUser.email = email;
        },
    },
});

export const { setUser, updateUser} = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.currentUser;

export default userSlice.reducer;