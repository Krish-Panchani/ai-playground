import React from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";

import { useAuthContext } from "../context/AuthContext";
import { showSuccess } from "../lib/toast";

const SignOut = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleSignOut = () => {
    logout();
    showSuccess("Signed out. See you next adventure!");
    navigate("/");
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-full text-white font-semibold"
    >
      <MdLogout className="text-xl" />
      <span>Sign Out</span>
    </button>
  );
};

export default SignOut;
