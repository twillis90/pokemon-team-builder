import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Pokemon {
    id: number;
    name: string;
    types: { type: { name: string } }[];
    sprites: {
        front_default: string;
    }
}

export const pokeApi = createApi({
    reducerPath: "pokeApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2"}),
    endpoints: (builder) => ({
        getPokemonByName: builder.query<Pokemon, string>({
            query: (name) => `pokemon/${name.toLowerCase()}`
        }),
    }),
});

export const {useGetPokemonByNameQuery} = pokeApi;