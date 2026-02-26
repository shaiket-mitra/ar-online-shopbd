import ChangePassForm from "./ChangePassForm ";
export default function ChangePassModal() {
  return (
    <div>
      <dialog id="change_pass" className="modal">
        <div className="modal-box bg-white">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h1 className="text-pink-400 text-2xl font-semibold text-center ">
            Change Password
          </h1>
          <ChangePassForm></ChangePassForm>
        </div>
      </dialog>
    </div>
  );
}
