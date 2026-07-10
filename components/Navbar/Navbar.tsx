import Logo from '../Logo/Logo';

export function Navbar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="border-bottom border-1 flex flex-row py-2 justify-between">
      <Logo />
      {children}
    </header>
  );
}
