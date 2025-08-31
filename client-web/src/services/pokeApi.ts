import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Pokemon {
    id: number;
    name: string;
    types: { type: { name: string } }[];
    sprites: {
        front_default: string;
    }
}

type PokeListApiResponse = {
  results: { name: string; url: string }[];
};

// what we want to use in the UI
export type PokeListItem = {
  id: number;
  name: string;
  sprite: string;
  types: string[]
};

const SPRITE = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

type TypeApiResponse = {
    pokemon: { pokemon: { name: string; url: string } }[];
  };

export const pokeApi = createApi({
  reducerPath: "pokeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (builder) => ({

    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name.toLowerCase()}`,
    }),

    getPokemonIdsByType: builder.query<Set<number>, string>({
        query: (typeName) => `type/${typeName.toLowerCase()}`,
        transformResponse: (resp: TypeApiResponse) => {
          const ids = resp.pokemon.map((p) =>
            Number(p.pokemon.url.replace(/\/+$/, "").split("/").pop())
          );
          return new Set(ids);
        },
      }),

    listAllPokemon: builder.query<PokeListItem[], void>({
      query: () => `pokemon?limit=100000&offset=0`,
      transformResponse: (resp: PokeListApiResponse) => {
        return resp.results.map(({ name, url }) => {
          const id = Number(url.replace(/\/+$/, "").split("/").pop());
          return { id, name, sprite: SPRITE(id), types: [] };
        });
      },
    }),
  }),
});

export const {
  useGetPokemonByNameQuery,
  useGetPokemonIdsByTypeQuery,
  useListAllPokemonQuery, 
} = pokeApi;