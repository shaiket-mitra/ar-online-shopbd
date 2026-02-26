import useAuth from "@/hooks/useAuth";
import UpdateProfileForm from "./UpdateProfileForm";
import Image from "next/image";

export default function UpdateProfileModal() {
  const { sessionUser } = useAuth();
  return (
    <div className=" ">
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box bg-white">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h1 className="text-pink-400 text-2xl font-semibold text-center ">
            Update Profile
          </h1>

          <UpdateProfileForm></UpdateProfileForm>
        </div>
      </dialog>
    </div>
  );
}
