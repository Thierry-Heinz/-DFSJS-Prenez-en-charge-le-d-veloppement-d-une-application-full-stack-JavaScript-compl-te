import BackButton from '@/components/Buttons/BackButton/BackButton';

type Props = {};

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="absolute px-8 py-8">
        <BackButton url="/dashboard" />
      </div>
      {children}
    </>
  );
};

export default layout;
