'use client';

import Link from 'next/link';
import { User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export type NavItem = { label: string; href: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  navItems: NavItem[];
};

const MobileMenu = ({
  isOpen,
  onClose,
  onLogout,
  navItems,
}: Props): React.ReactNode => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(isOpen);
  const [entered, setEntered] = useState(isOpen);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setMounted(true);
  }

  useEffect(() => {
    if (!mounted || !isOpen || entered) return;
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [mounted, isOpen, entered]);

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const open = isOpen && entered;

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setMounted(false);
      setEntered(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Fermer le menu"
        className={cn(
          'absolute inset-0 bg-foreground/40 transition-opacity duration-300 ease-in-out',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        data-testid="mobile-menu-panel"
        onTransitionEnd={handleTransitionEnd}
        className={cn(
          'absolute inset-y-0 right-0 flex w-3/4 max-w-xs flex-col gap-4 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out items-end',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <button
          type="button"
          onClick={onLogout}
          className="font-bold text-red-800 text-base cursor-pointer"
        >
          Se déconnecter
        </button>

        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`text-xl ${pathname === item.href && 'text-primary'}`}
            >
              {item.label}
            </Link>
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
      </div>
    </div>
  );
};

export default MobileMenu;
