import BackButton from '@/components/BackButton/BackButton';
import CreatePostForm from '@/components/Forms/CreatePostForm/CreatePostForm';

const CreatePost = () => {
  return (
    <>
      <div className="absolute px-8 py-4">
        <BackButton url="/dashboard" />
      </div>
      <section className="py-12 flex flex-col items-center">
        <h1 className="font-semibold text-2xl">Créer un nouvel article</h1>
        <CreatePostForm />
      </section>
    </>
  );
};

export default CreatePost;
