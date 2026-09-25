"use client";

import { useEffect, useState } from "react";
import UnauthenticatedWithImage from "@/components/UnAuthenticated";
import { LoadingState } from "@/components/ui/LoadingState";

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

    // If the role API/cookie fails to resolve, fall through to children
    // instead of blocking the user out.
    const timer = setTimeout(() => setReady(true), ROLE_LOAD_TIMEOUT);
    return () => clearTimeout(timer);
  }, [role]);

  if (!ready) {
    return <LoadingState message="Verifying your access..." />;
  }

  // Unknown role (null) is treated as pass-through — a failed role lookup
  // should never lock the user out of their dashboard.
  if (role == null) {
    return children;
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
