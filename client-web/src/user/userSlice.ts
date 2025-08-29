import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Pokemon } from "../services/pokeApi";

export interface User {
    id: string;
    displayName: string;
    email: string;
    teams: Team[]
};

type UserState = {
    currentUser: User | null;
};

const initialState: UserState = {
    currentUser: {
        id: "u1",
        displayName: "Ash Ketchum",
        email: "ash@pallet.town",
        teams: []
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
        addTeam(state, action: PayloadAction<{ id: string; name: string }>) {
            state.currentUser?.teams.push({...action.payload, pokemon: [] })
        },
        deleteTeam(state, action: PayloadAction<{ id: string}>) {
            if(!state.currentUser) return;
            state.currentUser.teams = state.currentUser.teams.filter(
                (team) => team.id !== action.payload.id
            );
        },
        editTeam(state, action: PayloadAction<{ id: string; name: string }>) {
            if (!state.currentUser) return;
          
            const { id, name } = action.payload;
            const team = state.currentUser.teams.find((t) => t.id === id);
          
            if (team) {
              team.name = name;
            }
          },
    },
});

export const { setUser, updateUser, addTeam, deleteTeam, editTeam } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.currentUser;

export default userSlice.reducer;