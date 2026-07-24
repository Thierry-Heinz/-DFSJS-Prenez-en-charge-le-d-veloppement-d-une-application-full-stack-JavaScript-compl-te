import AppNav from '@/components/Navbar/AppNav';
import { Navbar } from '@/components/Navbar/Navbar';
import { authService } from '@/features/auth/auth.service';
import { redirect } from 'next/navigation';

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.ReactNode> => {
  const session = await authService.getSession();
  if (!session) {
    redirect('/');
  }

  return (
    <>
      <Navbar>
        <AppNav />
      </Navbar>

      <main className="px-8">{children}</main>
    </>
  );
};
export default layout;
