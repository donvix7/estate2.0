"use client";

import { useEffect, useState } from "react";
//import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/service";

export default function RoleGuard({ user, allowedRoles = [], children }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
    //const token = user.token;
    //const role = user.role;
    const LoadData = async () =>{
      try {
        const res = await getCurrentSession()
        if (res.success) {
            console.log(res);
        }
    } catch (error) {
        console.log("Authorization check failed:", error);
        router.push("/");
        return;
    }
        
  
    }
  useEffect(() => {
    LoadData();

    // Check if role is authorized
    if (allowedRoles.includes("user")) {
      setAuthorized(true);
    } else {
      alert("You are not authorized to access this page.");
      router.push("/");
    }

    setLoading(false);
  }, [allowedRoles, router]);

  // Optional: show loader while verifying
  if (loading) {
    return (
      <div className="flex w-full items-center justify-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">
          Checking authorization...
        </p>
      </div>
    );
  }

  return authorized ? children :  (<div className="flex items-center justify-center min-h-screen w-full">
              <UnauthenticatedWithImage/>
            </div>)
}