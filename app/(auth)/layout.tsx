import BackButton from '@/components/BackButton/BackButton';
import { Navbar } from '@/components/Navbar/Navbar';
import Image from 'next/image';
import React from 'react';

type Props = {};

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode => {
  return (
    <main>
      <Navbar className="hidden lg:block" />

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
