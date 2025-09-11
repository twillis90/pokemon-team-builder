import { deleteTeam, removePokemonFromTeam, selectTeams, setTeams } from "../teams/teamSlice";
import { selectUser, updateUser } from "../user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Modal from "../components/common/Modal";
import PokemonCard from "../features/pokemon/PokemonCard";
import { useCreateTeamMutation, useListTeamsQuery, useRenameTeamMutation, type TeamDTO } from "../services/backendApi";
import { nanoid } from "@reduxjs/toolkit";

type ProfileForm = {
  displayName: string;
  email: string;
};

export default function Profile() {
  const user = useSelector(selectUser);
  const teams = useSelector(selectTeams);
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false);
  const [form, setForm] = useState<ProfileForm>({
    displayName: user?.displayName ?? "",
    email: user?.email ?? "",
  });
  const dispatch = useDispatch();
  const [deleteTeamConfirm, setDeleteTeamConfirm] = useState<boolean>(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const teamNameToDelete = teams.find((t) => t.id === teamToDelete)?.name;
  const [editModal, setEditModal] = useState<boolean>(false);
  const [teamToEdit, setTeamToEdit] = useState<string | null>(null);
  const [editTeamName, setEditTeamName] = useState<string>("");
  const {data, isSuccess, refetch } = useListTeamsQuery(user?.id);
  const [createTeam] = useCreateTeamMutation();
  const [renameTeam] = useRenameTeamMutation();

  
useEffect(() => {
  if (!isSuccess || !data) return;
  const mapped = (data as TeamDTO[]).map(t => ({
    id: t.id,
    name: t.name,
    pokemon: t.pokemon, // { id, name, sprite, types }
  }));
  dispatch(setTeams(mapped));
}, [isSuccess, data, dispatch]);

  const handleEditClick = () => {
    setEditUserOpen(true);
  };

  const handleModalClose = () => {
    setEditUserOpen(false);
  };

  useEffect(() => {
    if (editUserOpen && user) {
      setForm({
        displayName: user.displayName,
        email: user?.email,
      });
    }
  }, [editUserOpen, user]);

  const handleUserUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateUser({ displayName: form.displayName, email: form.email }));
    setEditUserOpen(false);
  };

  const handleAddTeam = async () => {
    if (!user?.id) return;
    try {
      await createTeam({
        userId: user.id,
        team: {
          id: nanoid(),
          name: "New Team",
          pokemon: [],
        },
      }).unwrap();
      await refetch();
    } catch (e) {
      console.error("createTeam failed", e);
    }
  };

  const handleDeleteTeam = (id: string) => {
    setTeamToDelete(id);
    setDeleteTeamConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (!teamToDelete) return;
    dispatch(deleteTeam({ id: teamToDelete }));
    setDeleteTeamConfirm(false);
    setTeamToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteTeamConfirm(false);
    setTeamToDelete(null);
  };

  const handleEditModal = (id: string) => {
    setTeamToEdit(id);
    const t = teams.find((teamId) => teamId.id === id);
    setEditTeamName(t?.name ?? "");
    setEditModal(true);
  };

  const handleEditModalClose = () => {
    setTeamToEdit(null);
    setEditModal(false);
  };

  const handleTeamNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teamToEdit || !user?.id) return;
  
    const newName = editTeamName.trim();
    if (!newName) return;
  
    try {
      await renameTeam({ userId: user.id, teamId: teamToEdit, name: newName }).unwrap();
      await refetch();
      setEditModal(false);
      setTeamToEdit(null);
    } catch (err) {
      console.error("renameTeam failed", err);
    }
  };

  const handleRemovePokemon = (teamId: string, pokemonId: number) => {
    dispatch(removePokemonFromTeam({ teamId, pokemonId }));
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Account</h1>

      {!user ? (
        <p className="text-slate-400">No user loaded.</p>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-slate-300">
                <span className="font-semibold">Name:</span> {user.displayName}
              </div>
              <div className="text-slate-400 mt-2">
                <span className="font-semibold">Email:</span> {user.email}
              </div>
            </div>
            <div className="shrink-0">
              <button
                type="button"
                className="rounded-md border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
                onClick={handleEditClick}
              >
                Edit
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Your Teams</h2>
            <div className="inline-flex rounded-xl border border-slate-300 overflow-hidden shadow-sm">
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium focus:outline-none"
                onClick={handleAddTeam}
              >
                Add Team
              </button>
            </div>

            {teams.length === 0 ? (
              <p className="text-slate-400 mt-3">No teams yet.</p>
            ) : (
              <div className="space-y-6 mt-3">
                {teams.map((team) => (
                  <div key={team.id} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-slate-200">{team.name}</h3>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditModal(team.id)}
                          className="text-sm text-red-400 hover:text-red-600"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTeam(team.id)}
                          className="text-sm text-red-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {team.pokemon.map((p) => (
                        <div key={p.id} className="relative">
                          <PokemonCard id={p.id} name={p.name} sprite={p.sprite} />
                          <button
                            type="button"
                            aria-label="Remove Pokémon"
                            title="Remove from team"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePokemon(team.id, p.id);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-sm leading-6 text-center hover:bg-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <Modal isOpen={deleteTeamConfirm} onClose={handleDeleteCancel}>
                      <h2 className="text-red-400">
                        Are you sure you want to delete team {teamNameToDelete}?
                      </h2>
                      <div className="inline-flex rounded-xl border border-slate-300 overflow-hidden shadow-sm text-red-400">
                        <button
                          type="button"
                          className="px-3 py-1 text-sm font-medium focus:outline-none text-red-400"
                          onClick={handleDeleteConfirm}
                        >
                          Confirm Delete
                        </button>
                      </div>
                      <div className="inline-flex rounded-xl border border-slate-300 overflow-hidden shadow-sm text-red-400 ml-2">
                        <button
                          type="button"
                          className="px-3 py-1 text-sm font-medium focus:outline-none text-red-400"
                          onClick={() => setDeleteTeamConfirm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </Modal>

                    <Modal
                      isOpen={editModal}
                      onClose={handleEditModalClose}
                      size="md"
                      title="Team Edit Modal"
                      accent={true}
                    >
                      <form className="space-y-4" onSubmit={handleTeamNameSubmit}>
                        <div>
                          <label className="block text-sm font-medium text-slate-300">
                            Team Name
                          </label>
                          <input
                            type="text"
                            name="teamName"
                            value={editTeamName}
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
                            onChange={(teamName) => setEditTeamName(teamName.target.value)}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditModal(false)}
                            className="rounded-md border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </Modal>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <Modal
          isOpen={editUserOpen}
          onClose={handleModalClose}
          size="md"
          title="User Edit Modal"
          accent={true}
        >
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300">Name</label>
              <input
                type="text"
                name="displayName"
                value={form.displayName}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
                onChange={handleUserUpdate}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
                onChange={handleUserUpdate}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditUserOpen(false)}
                className="rounded-md border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
