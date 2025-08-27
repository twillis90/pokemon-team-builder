import React from "react";

type Mode = "name" | "type";

type Props = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  query: string;
  onQueryChange: (value: string) => void;
};

export default function SearchControls({
  mode,
  onModeChange,
  query,
  onQueryChange,
}: Props) {
  return (
    <div className="mb-4">
      <div className="mb-2">
        <label className="block text-sm font-medium text-slate-700">
          Search by Name or Type
        </label>
      </div>

      <div className="flex items-center gap-3">
        {/* Segmented toggle */}
        <div
          className="inline-flex rounded-xl border border-slate-300 overflow-hidden shadow-sm"
          role="group"
          aria-label="Search mode"
        >
          <button
            type="button"
            onClick={() => onModeChange("name")}
            aria-pressed={mode === "name"}
            className={[
              "px-3 py-1 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition",
              "rounded-l-xl",
              mode === "name"
                ? "bg-red-600 text-white shadow"
                : "bg-transparent text-slate-700 hover:bg-slate-100",
            ].join(" ")}
          >
            Name
          </button>
          <button
            type="button"
            onClick={() => onModeChange("type")}
            aria-pressed={mode === "type"}
            className={[
              "px-3 py-1 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition",
              "rounded-r-xl",
              mode === "type"
                ? "bg-red-600 text-white shadow"
                : "bg-transparent text-slate-700 hover:bg-slate-100",
            ].join(" ")}
          >
            Type
          </button>
        </div>

        {/* Search input */}
        <input
          id="tb-search"
          type="text"
          placeholder="Search for Pokémon"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}