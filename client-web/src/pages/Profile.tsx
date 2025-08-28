import { selectUser } from "../user/userSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Profile() {
  const user = useSelector(selectUser);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const handleEditClick = () => {
    setEditOpen(true);
    console.log("modal state is open: ", editOpen);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Account</h1>

      {!user ? (
        <p className="text-slate-400">No user loaded.</p>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-slate-300">
            <span className="font-semibold">Name:</span> {user.displayName}
          </div>
          <div className="text-slate-400 mt-2">
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div className="inline-flex rounded-xl border border-slate-300 overflow-hidden shadow-sm">
            <button
              type="button"
              className={"px-3 py-1 text-sm font-medium focus:outline-none"}
              onClick={handleEditClick}>
                Edit
              </button>
          </div>
        </div>
      )}
    </div>
  );
}