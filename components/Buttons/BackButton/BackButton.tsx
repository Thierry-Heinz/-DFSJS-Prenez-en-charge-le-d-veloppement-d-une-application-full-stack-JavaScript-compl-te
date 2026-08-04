import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  url: string;
};

const BackButton = ({ url }: Props): React.ReactNode => {
  return (
    <Link href={url}>
      <Image src="/arrow_back.png" width={41} height={23} alt="Retour" />
    </Link>
  );
};

export default BackButton;
