'use client';

// import { useConvexAuth } from "convex/react";

import { useScrollTop } from '@/hooks/use-scroll-top';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { ModeToggle } from '@/components/mode-toggle';
import { SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { useConvexAuth } from 'convex/react';
import Link from 'next/link';

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        'fixed top-0 z-50 flex w-full items-center bg-green-50 p-6 dark:bg-[#1F1F1F]',
        scrolled && 'border-b shadow-sm'
      )}
    >
      <Logo />
      <div className='flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end'>
        {isLoading && (
          <p>
            <Spinner />
          </p>
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode='modal'>
              <Button className='px-3 py-3 text-base' variant='ghost' size='sm'>
                Log in
              </Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <UserButton afterSignOutUrl='/' />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};
