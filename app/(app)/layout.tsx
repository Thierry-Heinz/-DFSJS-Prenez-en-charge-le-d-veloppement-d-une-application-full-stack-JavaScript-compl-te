import AppNav from '@/components/Navbar/AppNav';
import { Navbar } from '@/components/Navbar/Navbar';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode => {
  return (
    <>
      <Navbar>
        <AppNav />
      </Navbar>
      <main className="p-8">{children}</main>
    </>
  );
};
export default layout;
