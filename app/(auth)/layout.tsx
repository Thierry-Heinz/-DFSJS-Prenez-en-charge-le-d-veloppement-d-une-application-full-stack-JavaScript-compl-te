import BackButton from '@/components/BackButton/BackButton';
import Logo from '@/components/Logo/Logo';
import { Navbar } from '@/components/Navbar/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode => {
  return (
    <main>
      <Navbar className="hidden lg:block">
        <Link href="/">
          <Logo />
        </Link>
      </Navbar>

      <div className="py-8 px-12">
        <BackButton url="/" />
      </div>

      <div className="flex justify-center visible lg:invisible">
        <Image
          src="/logo_login.png"
          width={412}
          height={238}
          alt="Monde Dév Logo"
        />
      </div>

      {children}
    </main>
  );
};

export default layout;
