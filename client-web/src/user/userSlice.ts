import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: string;
    displayName: string;
    email: string;
};

type UserState = {
    currentUser: User | null;
};

const DEFAULT_USER_ID: string = import.meta.env.VITE_STUB_USER_ID ?? "tj-dev";
const DEFAULT_USER: User = {
  id: DEFAULT_USER_ID,
  displayName: "Dev Trainer",
  email: `${DEFAULT_USER_ID}@example.test`,
};

const initialState: UserState = {
  currentUser: DEFAULT_USER,
};


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setUser(state, action: PayloadAction<User>) {
        state.currentUser = action.payload;
      },
      updateUser(state, action: PayloadAction<{ displayName: string; email: string }>) {
        if (!state.currentUser) return;
        const { displayName, email } = action.payload;
        state.currentUser.displayName = displayName;
        state.currentUser.email = email;
      },
    },
  });

export const { setUser, updateUser} = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.currentUser;

export default userSlice.reducer;