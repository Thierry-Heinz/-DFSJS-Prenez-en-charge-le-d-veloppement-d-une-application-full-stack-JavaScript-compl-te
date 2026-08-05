import BackButton from '@/components/Buttons/BackButton/BackButton';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="px-8 py-8 lg:absolute">
        <BackButton url="/dashboard" />
      </div>
      {children}
    </>
  );
};

export default layout;
