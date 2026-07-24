'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, User } from 'lucide-react';
import { useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import MobileMenu, { type NavItem } from './MobileMenu';
import Logo from '../Logo/Logo';
import { usePathname } from 'next/navigation';

const NAV_ITEMS: NavItem[] = [
  { label: 'Articles', href: '/dashboard' },
  { label: 'Thèmes', href: '/topics' },
];

const AppNav = (): React.ReactNode => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  return (
    <>
      <Link href="/dashboard">
        <Logo />
      </Link>
      <nav className="hidden items-center gap-8 lg:flex">
        <button
          onClick={handleLogout}
          aria-label="Se déconnecter"
          className="text-sm text-red-800 font-semibold cursor-pointer hover:underline"
        >
          Se déconnecter
        </button>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-xl hover:text-primary ${pathname === item.href && 'text-primary'}`}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/profile" aria-label="Profil">
          <User className="size-12 rounded-full border p-1 bg-gray-300" />
        </Link>
      </nav>

      <button
        type="button"
        aria-label="Ouvrir le menu"
        className="lg:hidden p-2 cursor-pointer"
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
