'use client';

import Link from 'next/link';
import { Menu, User } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export type NavItem = { label: string; href: string };

type Props = {
  /** Appelée lors du clic sur "Se déconnecter" */
  onLogout: () => void;
  /** Liens de navigation à afficher dans le panneau */
  navItems: NavItem[];
};

/** Menu de navigation mobile, affiché en panneau coulissant (Radix Dialog) sous `lg`. */
const MobileMenu = ({ onLogout, navItems }: Props): React.ReactNode => {
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="Ouvrir le menu"
          className="lg:hidden p-2 cursor-pointer"
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Close asChild>
          <button
            type="button"
            aria-label="Fermer le menu"
            className={cn(
              'fixed inset-0 z-50 bg-foreground/40 duration-300 ease-in-out lg:hidden',
              'data-[state=open]:animate-in data-[state=open]:fade-in-0',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
            )}
          />
        </DialogPrimitive.Close>

        <DialogPrimitive.Content
          data-testid="mobile-menu-panel"
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-3/4 max-w-xs flex-col gap-4 items-end bg-background p-6 shadow-lg duration-300 ease-in-out lg:hidden',
            'data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
            'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            Menu de navigation
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Navigation principale et actions du compte
          </DialogPrimitive.Description>

          <button
            type="button"
            onClick={onLogout}
            className="font-bold text-red-800 text-base cursor-pointer"
          >
            Se déconnecter
          </button>

          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <DialogPrimitive.Close asChild key={item.href}>
                <Link
                  href={item.href}
                  className={`text-xl ${pathname === item.href && 'text-primary'}`}
                >
                  {item.label}
                </Link>
              </DialogPrimitive.Close>
            ))}
          </nav>

          <div className="mt-auto flex items-center justify-between pt-4">
            <Link href="/profile" aria-label="Profil">
              <User
                className="size-12 rounded-full p-1 bg-gray-300"
                aria-hidden="true"
              />
            </Link>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default MobileMenu;
