import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  url: string;
};

const BackButton = ({ url }: Props): React.ReactNode => {
  return (
    <Link href={url}>
      <Image
        src="/arrow_back.png"
        width={30}
        height={3}
        alt="Flèche de retour"
      />
    </Link>
  );
};

export default BackButton;
