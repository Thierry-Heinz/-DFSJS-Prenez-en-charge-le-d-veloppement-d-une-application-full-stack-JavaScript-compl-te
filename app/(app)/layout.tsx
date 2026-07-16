import AppNav from '@/components/Navbar/AppNav';
import { Navbar } from '@/components/Navbar/Navbar';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode => {
  return (
    <main>
      <Navbar>
        <AppNav />
      </Navbar>

      {children}
    </main>
  );
};
export default layout;
