import BackButton from '@/components/Buttons/BackButton/BackButton';
import CreatePostForm from '@/components/Forms/CreatePostForm/CreatePostForm';
import { topicRepository } from '@/features/topic/topic.repository';
import { topicService } from '@/features/topic/topic.service';

const CreatePost = async () => {
  const topics = await topicService.getTopics();
  return (
    <>
      <div className="absolute px-8 py-4">
        <BackButton url="/dashboard" />
      </div>
      <section className="py-12 flex flex-col items-center">
        <h1 className="font-semibold text-2xl">Créer un nouvel article</h1>
        <CreatePostForm topics={topics} />
      </section>
    </>
  );
};

export default CreatePost;
