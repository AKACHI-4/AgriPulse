"use client";

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        redirect("/");
      } else {
        redirect("/dashboard/overview");
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return null; // Nothing to render since redirect happens in useEffect
}
