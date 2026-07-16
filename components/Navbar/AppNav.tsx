'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, User } from 'lucide-react';
import { useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import MobileMenu, { type NavItem } from './MobileMenu';
import Logo from '../Logo/Logo';

const NAV_ITEMS: NavItem[] = [
  { label: 'Thèmes', href: '/themes' },
  { label: 'Articles', href: '/dashboard' },
];

const AppNav = (): React.ReactNode => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  return (
    <>
      <Link href="/dashboard">
        <Logo />
      </Link>
      <nav className="hidden items-center gap-8 lg:flex">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="text-xl">
            {item.label}
          </Link>
        ))}
        <Link href="/profile" aria-label="Profil">
          <User className="size-8 rounded-full border p-1" />
        </Link>
      </nav>

      <button
        type="button"
        aria-label="Ouvrir le menu"
        className="lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="size-6" />
      </button>

      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLogout={handleLogout}
        navItems={NAV_ITEMS}
      />
    </>
  );
};

export default AppNav;
