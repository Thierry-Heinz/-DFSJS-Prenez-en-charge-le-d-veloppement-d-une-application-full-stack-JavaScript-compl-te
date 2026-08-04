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
  const buttonClassName = `${className} text-semibold bg-primary inline-flex items-center justify-center px-6 py-3 rounded-lg transition-colors cursor-pointer`;

  if (url) {
    return (
      <Link href={url} className={buttonClassName}>
        {text}
      </Link>
    );
  }

  return <button className={buttonClassName}>{text}</button>;
};

export default NavButton;
