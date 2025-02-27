'use client';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl font-bold sm:text-5xl md:text-6xl'>
        Your Farm, Data, & Growth. Optimized. Welcome to{" "}
        <span className='underline'>100x Farmer</span>
      </h1>
      <h3 className='text-base font-medium sm:text-xl md:text-2xl'>
        100x Farmer is the smart platform where <br /> crops thrive and farmers grow.
      </h3>
      {isLoading && (
        <div className='flex w-full items-center justify-center'>
          <Spinner size='lg' />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button className="text-base px-5 py-4" asChild>
          <Link href='/dashboard/overview'>
            Enter Dashboard
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode='modal'>
          <Button className="text-base px-5 py-4">
            Get Dashboard free
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
