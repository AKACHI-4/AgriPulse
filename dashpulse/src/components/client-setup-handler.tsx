"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import UserSetupDialog from "@/components/user-setup-dialog";

export default function ClientSetupHandler({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);
  const [setupDone, setSetupDone] = useState(!!user);

  useEffect(() => {
    if (user) setSetupDone(true);
  }, [user]);

  if (!setupDone) {
    return <UserSetupDialog onSetupComplete={() => setSetupDone(true)} />;
  }

  return <>{children}</>;
}
