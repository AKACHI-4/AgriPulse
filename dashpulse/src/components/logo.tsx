import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Image from 'next/image';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600']
});

export const Logo = () => {
  return (
    <div className='hidden items-center gap-x-2 md:flex'>
      <Image
        src="/logo.svg"
        height="70"
        width="70"
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        height="70"
        width="70"
        alt="Logo"
        className="hidden dark:block"
      />
      <p className={cn('font-semibold', font.className)}>100xFarmer</p>
    </div>
  );
};
