import Button from '@/components/Button/Button';

const Dashboard = (): React.ReactNode => {
  return (
    <>
      <header className="pb-8 flex flex-row justify-space-between">
        <Button text="Créer un article" url="/post/create" />
      </header>
      <section></section>
    </>
  );
};

export default Dashboard;
