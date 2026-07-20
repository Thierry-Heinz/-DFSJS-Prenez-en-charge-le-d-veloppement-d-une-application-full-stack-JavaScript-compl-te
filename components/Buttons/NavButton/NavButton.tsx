import Link from 'next/link';
import React from 'react';

type Props = {
  className?: string;
  text: string;
  url?: string;
};

const NavButton = ({
  className = 'text-white hover:bg-primary/90',
  text,
  url,
}: Props): React.ReactNode => {
  return (
    <button
      className={` ${className} text-semibold bg-primary inline-flex items-center justify-center px-6 py-3 rounded-lg transition-colors cursor-pointer`}
    >
      {url ? <Link href={url}>{text}</Link> : <>{text}</>}
    </button>
  );
};

export default NavButton;
