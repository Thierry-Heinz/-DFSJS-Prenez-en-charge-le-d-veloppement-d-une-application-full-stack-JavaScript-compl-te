import Image from 'next/image';

/** Logo de l'application, chargé en priorité (`loading="eager"`). */
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
