import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
  className?: string;
};

/** Conteneur de mise en page générique pour une barre de navigation. */
export function Navbar({ children, className }: Props): React.ReactNode {
  return (
    <nav
      className={cn(
        'border-bottom border-1 flex flex-row py-2 px-8 justify-between',
        className,
      )}
    >
      {children}
    </nav>
  );
}
