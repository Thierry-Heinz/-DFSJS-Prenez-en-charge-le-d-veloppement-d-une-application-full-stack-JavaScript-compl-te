import Button from '@/components/Button/Button';

const page = (): React.ReactNode => {
  return (
    <>
      <header className="pb-8 flex flex-row justify-space-between">
        <Button text="Créer un article" url="/post/create" />
      </header>
    </>
  );
};

export default page;
