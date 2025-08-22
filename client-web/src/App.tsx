import type {AppDispatch, RootState} from "./store";
import {useDispatch, useSelector} from "react-redux";

import { setTheme } from "./features/ui/uiSlice";
import { useGetPokemonByNameQuery } from "./services/pokeApi";
import {useState} from "react";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const [name, setName] = useState("")
  const {data, isLoading, error} = useGetPokemonByNameQuery(name, {
    skip: !name.trim(),
  });

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      } p-8`}
    >
      <h1 className="text-3xl font-bold">Pokemon Team Builder</h1>
      <p className="mt-2 opacity-80">Current theme: {theme}</p>

      <div className="mt-4 flex gap-4">
        <h3>Chose theme: </h3>
        <button
          className="px-4 py-2 rounded-lg bg-slate-200 text-black hover:bg-slate-300 transition"
          onClick={() => dispatch(setTheme("light"))}
        >
          Light
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
          onClick={() => dispatch(setTheme("dark"))}
        >
          Dark
        </button>
      </div>
      <div className="mt-6 max-w-md">
        <label className="block text-sm font-medium mb-1">Search Pokémon by name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="pikachu"
          className="w-full rounded-lg border px-3 py-2 bg-yellow-300 text-black"
        />
        <p className="text-sm opacity-70 mt-1">Try: bulbasaur, charizard, eevee…</p>
      </div>
      <div className="mt-4">
  {isLoading && <p>Loading…</p>}

  {/* Not found (404) */}
  {error && "status" in error && (error as any).status === 404 && (
    <p className="text-amber-400">No Pokémon found with that name.</p>
  )}

  {/* Other errors */}
  {error && "status" in error && (error as any).status !== 404 && (
    <p className="text-red-500">Error fetching Pokémon.</p>
  )}

  {/* Success */}
  {data && (
    <div className="mt-2 p-4 rounded-lg border flex items-center gap-4">
      <img
        src={data.sprites.front_default}
        alt={data.name}
        className="w-16 h-16"
      />
      <div>
        <div className="font-medium capitalize text-lg">{data.name}</div>
        <div className="text-sm opacity-80">
          Types: {data.types.map((t: any) => t.type.name).join(", ")}
        </div>
      </div>
    </div>
  )}
</div>
    </div>
  );
}