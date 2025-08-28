import { createSlice } from "@reduxjs/toolkit";

export interface User {
    id: string;
    displayName: string;
    email: string;
}

type UserState = {
    currentUser: User | null;
}

const initialState: UserState = {
    currentUser: {
        id: "u1",
        displayName: "Ash Ketchum",
        email: "ash@pallet.town",
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        //add later
    },
})

export const selectUser = (state: { user: UserState }) => state.user.currentUser;

export default userSlice.reducer;