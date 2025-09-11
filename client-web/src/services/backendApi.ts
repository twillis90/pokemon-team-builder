import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080';
const STUB_USER_ID = import.meta.env.VITE_STUB_USER_ID ?? 'tj-dev';

export type TeamPokemonDTO = {
  id: number;
  name: string;
  sprite: string;
  types: string[];
};

export type TeamDTO = {
  id: string;
  userId: string;
  name: string;
  pokemon: TeamPokemonDTO[];
};

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Teams', 'Badges', 'HOF'],
  endpoints: (build) => ({
    listTeams: build.query<TeamDTO[], string | void>({
      query: (userIdArg) => {
        const userId = userIdArg ?? STUB_USER_ID;
        return {
          url: `/users/${encodeURIComponent(userId)}/teams`,
          headers: {
            'X-User-Id': userId,
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((t) => ({ type: 'Teams' as const, id: t.id })),
              { type: 'Teams' as const, id: 'LIST' },
            ]
          : [{ type: 'Teams' as const, id: 'LIST' }],
    }),
    createTeam: build.mutation<TeamDTO, { userId: string; team: Pick<TeamDTO, 'id' | 'name' | 'pokemon'>}>({
        query: ({ userId, team}) =>  ({
            url: `/users/${encodeURIComponent(userId)}/teams`,
            method: 'POST',
            headers: {'X-User-Id': userId},
            body: team,
        }),
        invalidatesTags: [{type: 'Teams', id:'LIST'}],
    }),
    renameTeam: build.mutation<TeamDTO, { userId: string; teamId: string; name: string }>({
        query: ({ userId, teamId, name }) => ({
            url: `/teams/${encodeURIComponent(teamId)}`,
            method: 'PATCH',
            headers: { 'X-User-Id': userId },
            body: { name },
        }),
        invalidatesTags: (result, error, { teamId }) => [
            { type: 'Teams', id: teamId },
            { type: 'Teams', id: 'LIST' },
        ],
    }),
    addPokemonToTeam: build.mutation<TeamDTO, { userId: string; teamId: string; pokemon: TeamPokemonDTO }>({
        query: ({ userId, teamId, pokemon }) => ({
        url: `/teams/${encodeURIComponent(teamId)}/pokemon`,
        method: 'POST',
        headers: { 'X-User-Id': userId },
        body: pokemon,
        }),
        invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        { type: 'Teams', id: 'LIST' },
        ],
    }),
  }),
});

export const { useListTeamsQuery, useCreateTeamMutation, useRenameTeamMutation, useAddPokemonToTeamMutation } = backendApi;
