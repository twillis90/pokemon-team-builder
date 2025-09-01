import { addPokemonToTeam, addTeam, selectTeams, type TeamPokemon } from "../teams/teamSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store";
import { useEffect, useState } from "react";
import { useGetPokemonIdsByTypeQuery, useListAllPokemonQuery } from "../services/pokeApi";

import Modal from "../components/common/Modal";
import PokemonCard from "../features/pokemon/PokemonCard";
import SearchControls from "../features/search/SearchControls";
import { skipToken } from "@reduxjs/toolkit/query";
import { MAX_TEAMS, MAX_TEAM_SIZE } from "../library/constants";

export default function TeamBuilder() {
  const { data, isLoading, error } = useListAllPokemonQuery();
  const teams = useSelector(selectTeams);
  const dispatch = useDispatch<AppDispatch>();

  const [query, setQuery] = useState<string>("");
  const [searchMode, setSearchMode] = useState<"name" | "type">("name");
  const [page, setPage] = useState<number>(1);
  const pageSize = 25;
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [pokemonToAdd, setPokemonToAdd] = useState<TeamPokemon | null>(null);
  const [addPokemonModal, setAddPokemonModal] = useState<boolean>(false);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const typeTerms = normalizedQuery
    .split(/[,/ ]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 2);

  const [typeA, typeB] = typeTerms;
  const { data: setA } = useGetPokemonIdsByTypeQuery(
    searchMode === "type" && typeA ? typeA : skipToken
  );
  const { data: setB } = useGetPokemonIdsByTypeQuery(
    searchMode === "type" && typeB ? typeB : skipToken
  );

  const visible =
    data
      ? !normalizedQuery
        ? data
        : searchMode === "name"
        ? data.filter((p) => p.name.toLowerCase().includes(normalizedQuery))
        : typeB && setA && setB
        ? data.filter((p) => setA.has(p.id) && setB.has(p.id))
        : setA
        ? data.filter((p) => setA.has(p.id))
        : []
      : [];

  const pageItems = visible.slice(start, end);
  const totalPages = Math.ceil(visible.length / pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchMode, normalizedQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const openAddModal = (p: TeamPokemon) => {
    setPokemonToAdd(p);
    setAddPokemonModal(true);
  };

  const cancelAdd = () => {
    setPokemonToAdd(null);
    setAddPokemonModal(false);
  };

  const addPokemon = (teamId: string, pokemon: TeamPokemon) => {
    dispatch(addPokemonToTeam({ teamId, pokemon }));
    setAddPokemonModal(false);
    setPokemonToAdd(null);
  };

  const addNewTeam = () => {
    if (!pokemonToAdd || teams.length >= MAX_TEAMS) return;
    const action = dispatch(addTeam("New Team"));
    const newId = action.payload.id;
    dispatch(addPokemonToTeam({ teamId: newId, pokemon: pokemonToAdd }));
    setAddPokemonModal(false);
    setPokemonToAdd(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Team Builder</h1>
      <p className="opacity-80 mb-4">Create your ultimate team!!</p>

      <SearchControls
        mode={searchMode}
        onModeChange={setSearchMode}
        query={query}
        onQueryChange={setQuery}
      />

      {isLoading && <p>Loading full list…</p>}
      {error && <p className="text-red-500">Error loading list.</p>}

      <div className="mb-4">
        <label>Pokemon List</label>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Page {page} of {totalPages || 1}
        </div>

        <div className="inline-flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={`rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100 ${
              page <= 1 ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""
            }`}
          >
            Prev
          </button>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
            disabled={page >= (totalPages || 1)}
            className={`rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100 ${
              page >= (totalPages || 1) ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <div>
        {data && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pageItems.map((p) => (
              <li key={p.id}>
                <PokemonCard
                  id={p.id}
                  name={p.name}
                  sprite={p.sprite}
                  onClick={() =>
                    openAddModal({
                      id: p.id,
                      name: p.name,
                      sprite: p.sprite,
                      types: p.types ?? [],
                    })
                  }
                />
              </li>
            ))}
          </ul>
        )}

        <Modal
          isOpen={addPokemonModal}
          onClose={cancelAdd}
          title="Add to which team?"
          size="sm"
          accent={true}
        >
          <div className="space-y-3 text-red-400">
            <p>
              Choose a team for{" "}
              <span className="capitalize font-semibold">{pokemonToAdd?.name}</span>
            </p>

            {teams.length === 0 ? (
              <p className="text-red-400">No teams yet.</p>
            ) : (
              <ul className="space-y-2">
                {teams.map((team) => {
                  const full = team.pokemon.length >= MAX_TEAM_SIZE;
                  const alreadyIn = pokemonToAdd
                    ? team.pokemon.some((p) => p.id === pokemonToAdd.id)
                    : false;
                  const disabled = !pokemonToAdd || full || alreadyIn;

                  return (
                    <li key={team.id}>
                      <button
                        type="button"
                        disabled={disabled}
                        title={
                          full
                            ? `Team is full (${MAX_TEAM_SIZE}/${MAX_TEAM_SIZE})`
                            : alreadyIn
                            ? "Already on this team"
                            : "Add to team"
                        }
                        onClick={() => pokemonToAdd && addPokemon(team.id, pokemonToAdd)}
                        className={`w-full text-left rounded-md border px-3 py-2 text-red-400 border-slate-700 ${
                          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{team.name}</span>
                          <span className="text-xs text-red-300">
                            {team.pokemon.length}/{MAX_TEAM_SIZE}
                          </span>
                        </div>

                        {team.pokemon.length > 0 && (
                          <div className="mt-2 flex -space-x-2 overflow-hidden">
                            {team.pokemon.slice(0, MAX_TEAM_SIZE).map((p) => (
                              <img
                                key={p.id}
                                src={p.sprite}
                                alt={p.name}
                                className="inline-block h-6 w-6 rounded-full ring-1 ring-slate-700"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex items-center justify-between pt-3">
              {teams.length >= MAX_TEAMS && (
                <p className="text-xs text-red-400">
                  Max teams reached ({MAX_TEAMS}/{MAX_TEAMS}).
                </p>
              )}
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  disabled={teams.length >= MAX_TEAMS || !pokemonToAdd}
                  onClick={addNewTeam}
                  className="rounded-md border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  New team
                </button>

                <button
                  type="button"
                  onClick={cancelAdd}
                  className="rounded-md border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
