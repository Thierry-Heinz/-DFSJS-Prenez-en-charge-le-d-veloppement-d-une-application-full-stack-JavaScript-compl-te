'use client';

import Link from 'next/link';
import { User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
  const [mounted, setMounted] = useState(isOpen);
  const [entered, setEntered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  // Mount first in the closed position, then flip to open on the next frame so the
  // transition actually plays instead of the panel snapping straight to open.
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

  // Driven by isOpen (not just `entered`) so closing - even mid slide-in - immediately
  // targets the closed position; the CSS transition interpolates from wherever the
  // panel currently is instead of snapping to the resting state first.
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
          'absolute inset-y-0 right-0 flex w-3/4 max-w-xs flex-col gap-6 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={onClose}
          className="self-end"
        >
          <X className="size-6" />
        </button>

        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="text-xl"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <Link href="/profile" aria-label="Profil">
            <User
              className="size-8 rounded-full border p-1"
              aria-hidden="true"
            />
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="font-bold text-destructive"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
