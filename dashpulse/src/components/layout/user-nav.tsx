'use client';

import { UserButton } from "@clerk/nextjs";

export function UserNav() {
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          userButtonAvatarBox: "h-8 w-8", // size
        },
      }}
    />
  );
}
