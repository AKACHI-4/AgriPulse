import { Logo } from './logo';

export const Footer = () => {
  return (
    <footer className="z-50 flex w-full flex-col items-center justify-center bg-background px-6 py-4 text-sm text-muted-foreground dark:bg-[#1F1F1F]">
      {/* <Logo /> */}
      <p className='text-base font-semibold'>© {new Date().getFullYear()} <span className='text-green-600'>{"100xFarmer"}</span> All rights reserved.</p>
    </footer>
  );
};