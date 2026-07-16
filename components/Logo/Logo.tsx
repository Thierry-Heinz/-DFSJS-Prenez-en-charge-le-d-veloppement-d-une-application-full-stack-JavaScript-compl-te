import Image from 'next/image';

type Props = {};

const Logo = (props: Props): React.ReactNode => {
  return (
    <Image
      src="/logo_navbar.png"
      loading="eager"
      width={140}
      height={81}
      alt="Monde de Dév"
    />
  );
};

export default Logo;
