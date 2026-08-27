"use client";

import { useEffect, useState } from "react";
import UnauthenticatedWithImage from "@/components/UnAuthenticated";

const ROLE_LOAD_TIMEOUT = 4000;

export default function RoleGuard({ role, allowedRoles = [], children }) {
  const [ready, setReady] = useState(false);

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [];
  const authorized = !!role && allowed.includes(role);

  useEffect(() => {
    if (role != null) {
      setReady(true);
      return;
    }

    const timer = setTimeout(() => setReady(true), ROLE_LOAD_TIMEOUT);
    return () => clearTimeout(timer);
  }, [role]);

  if (!ready) {
    return (
      <div className="flex w-full items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8a8f98] text-white text-sm font-medium animate-pulse">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  if (authorized) {
    return children;
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <UnauthenticatedWithImage />
    </div>
  );
}
