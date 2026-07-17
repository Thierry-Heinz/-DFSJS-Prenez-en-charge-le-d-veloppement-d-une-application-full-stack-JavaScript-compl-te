import Logo from '../Logo/Logo';

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export function Navbar({ children, className }: Props): React.ReactNode {
  return (
    <header
      className={`${className} border-bottom border-1 flex flex-row py-2 px-8 justify-between`}
    >
      {children}
    </header>
  );
}
