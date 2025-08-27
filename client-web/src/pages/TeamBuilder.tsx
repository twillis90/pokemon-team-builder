import { useEffect, useState } from "react";
import { useGetPokemonIdsByTypeQuery, useListAllPokemonQuery } from "../services/pokeApi";

import PokemonCard from "../features/pokemon/PokemonCard";
import SearchControls from "../features/search/SearchControls";
import { skipToken } from "@reduxjs/toolkit/query";

export default function TeamBuilder() {
  const { data, isLoading, error } = useListAllPokemonQuery();
  const [query, setQuery] = useState<string>("");
  const [searchMode, setSearchMode] = useState<"name" | "type">("name");
  const [page, setPage] = useState<number>(1);
  const pageSize = 25;
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  
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

  const visible = data
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Team Builder</h1>
      <p className="opacity-80 mb-4">
        Create your ultimate team!!
      </p>
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
          className={`rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100
            ${page <= 1 ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`}
          >
          Prev
          </button>

          <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
          disabled={page >= (totalPages || 1)}
          className={`rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100
            ${page >= (totalPages || 1) ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`}
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
              <PokemonCard id={p.id} name={p.name} sprite={p.sprite}/>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}