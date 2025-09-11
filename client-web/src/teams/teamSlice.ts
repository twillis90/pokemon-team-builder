import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import { MAX_TEAM_SIZE, MAX_TEAMS } from "../library/constants";

export type TeamPokemon = { id: number; name: string; sprite: string; types: string[] };
export type Team = { id: string; name: string; pokemon: TeamPokemon[] };

type TeamsState = { teams: Team[] };
const initialState: TeamsState = { teams: [] };

export const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    addTeam: {
      prepare: (name: string) => ({ payload: { id: nanoid(), name } }),
      reducer: (state, action: PayloadAction<{ id: string; name: string }>) => {
        if(state.teams.length >= MAX_TEAMS) return;
        state.teams.push({ id: action.payload.id, name: action.payload.name, pokemon: [] });
      }
    },
    editTeam: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const t = state.teams.find(x => x.id === action.payload.id);
      if (t) t.name = action.payload.name;
    },
    deleteTeam: (state, action: PayloadAction<{ id: string }>) => {
      state.teams = state.teams.filter(t => t.id !== action.payload.id);
    },
    addPokemonToTeam: (state, action: PayloadAction<{ teamId: string; pokemon: TeamPokemon }>) => {
      const t = state.teams.find(x => x.id === action.payload.teamId);
      if (!t) return;
      if (t.pokemon.some(p => p.id === action.payload.pokemon.id)) return;
      if (t.pokemon.length >= MAX_TEAM_SIZE) return;
      t.pokemon.push(action.payload.pokemon);
    },
    removePokemonFromTeam: (state, action: PayloadAction<{ teamId: string; pokemonId: number }>) => {
      const t = state.teams.find(x => x.id === action.payload.teamId);
      if (!t) return;
      t.pokemon = t.pokemon.filter(p => p.id !== action.payload.pokemonId);
    },
    clearTeams: (state) => { state.teams = []; 
    },
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
  }
});

export const {
  addTeam, editTeam, deleteTeam,
  addPokemonToTeam, removePokemonFromTeam, clearTeams, setTeams
} = teamsSlice.actions;

export const selectTeams = (root: { teams: TeamsState }) => root.teams.teams;

export default teamsSlice.reducer;