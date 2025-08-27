import { useGetPokemonByNameQuery } from "../../services/pokeApi";

type Props = {
  id: number;
  name: string;
  sprite: string;
};

function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

export default function PokemonCard({ id, name, sprite }: Props) {
  const { data, isLoading, isError } = useGetPokemonByNameQuery(name);

  const typesLabel =
    data?.types?.map((t) => capitalize(t.type.name)).join(" / ") ?? "—";

  return (
    <div
      className="h-full flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-sm"
      role="article"
      aria-label={`${name} card`}
    >
      {/* sprite area */}
      <div className="flex items-center justify-center">
        <img
          src={sprite}
          alt={name}
          className="w-16 h-16 image-render-pixel"
          loading="lazy"
        />
      </div>

      {/* info area */}
      <div className="mt-3 text-sm leading-5">
        <div className="text-slate-300">
          <span className="font-semibold">Name:</span>{" "}
          <span className="capitalize">{name}</span>
        </div>

        <div className="text-slate-300">
          <span className="font-semibold">ID:</span> {id}
        </div>

        <div className="text-slate-400 mt-1">
          <span className="font-semibold">Type(s):</span>{" "}
          {isLoading && <span className="italic text-slate-500">loading…</span>}
          {isError && <span className="text-red-400">failed</span>}
          {!isLoading && !isError && <span>{typesLabel}</span>}
        </div>
      </div>
    </div>
  );
}