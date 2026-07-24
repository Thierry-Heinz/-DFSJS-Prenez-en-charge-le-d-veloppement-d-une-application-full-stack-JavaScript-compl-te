import CreatePostForm from '@/components/Forms/CreatePostForm/CreatePostForm';
import { topicService } from '@/features/topic/topic.service';

const CreatePost = async () => {
  const topics = await topicService.getTopics();
  return (
    <section className="py-8 flex flex-col items-center">
      <h1 className="font-semibold text-2xl">Créer un nouvel article</h1>
      <CreatePostForm topics={topics} />
    </section>
  );
};

export default CreatePost;
