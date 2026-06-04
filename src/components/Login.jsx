import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../context/AuthContext";
import { api } from "../lib/api";
import { showError, showSuccess } from "../lib/toast";
import useQuestion from "../hooks/useQuestion";

const Login = ({ setResponseText, isPage }) => {
  const { setQuestion } = useQuestion();
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const clearPageState = () => {
    if (isPage) {
      setQuestion("");
      setResponseText?.("");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        throw new Error("Google did not return a credential");
      }

      const response = await api.loginWithGoogle(idToken);
      login(response.data);
      clearPageState();
      showSuccess(`Welcome back, ${response.data?.user?.displayName || "Artist"}!`);
      navigate("/");
    } catch (error) {
      console.error("Error during sign in:", error);
      showError(error, "Sign in failed. Please try again.");
    }
  };

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <p className="text-xs text-red-400 max-w-[12rem]">
        Set VITE_GOOGLE_CLIENT_ID in .env to enable sign-in.
      </p>
    );
  }

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => showError(null, "Google sign-in was cancelled. Please try again.")}
      useOneTap={false}
      theme="filled_blue"
      shape="pill"
      text="signin_with"
      size="medium"
    />
  );
};

export default Login;
