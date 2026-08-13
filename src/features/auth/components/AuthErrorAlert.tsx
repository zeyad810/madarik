import React from "react";

interface AuthErrorAlertProps {
  message: string | null;
}

export const AuthErrorAlert: React.FC<AuthErrorAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="w-full mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-right shadow-xs">
      {message}
    </div>
  );
};

export default AuthErrorAlert;
