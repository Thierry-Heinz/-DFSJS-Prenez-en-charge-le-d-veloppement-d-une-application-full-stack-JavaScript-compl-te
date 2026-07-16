import Image from 'next/image';

const Logo = (): React.ReactNode => {
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
