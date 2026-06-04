import toast from "react-hot-toast";

import { formatFriendlyError } from "./formatError";

const baseStyle = {
  borderRadius: "12px",
  background: "#0f172a",
  color: "#f8fafc",
  border: "1px solid #334155",
  fontSize: "14px",
  maxWidth: "360px",
};

export const toastOptions = {
  duration: 4500,
  style: baseStyle,
  success: {
    duration: 3500,
    iconTheme: {
      primary: "#22d3ee",
      secondary: "#0f172a",
    },
    style: {
      ...baseStyle,
      border: "1px solid #0891b2",
    },
  },
  error: {
    duration: 5500,
    iconTheme: {
      primary: "#f97316",
      secondary: "#0f172a",
    },
    style: {
      ...baseStyle,
      border: "1px solid #ea580c",
    },
  },
};

export const showError = (error, fallback) => {
  toast.error(formatFriendlyError(error, fallback), toastOptions.error);
};

export const showSuccess = (message) => {
  toast.success(message, toastOptions.success);
};

export const showInfo = (message) => {
  toast(message, {
    ...toastOptions,
    icon: "ℹ️",
  });
};

export const showLoading = (message) => toast.loading(message, toastOptions);

export const dismissToast = (toastId) => toast.dismiss(toastId);

export { toast };
