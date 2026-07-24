import Topic from '@/components/Topic/Topic';
import { topicService } from '@/features/topic/topic.service';

const Topics = async () => {
  const topics = await topicService.getAllUserTopics();

  if (!topics) return;
  return (
    <main className="py-8 flex flex-col items-center">
      {topics.length !== 0 ? (
        <section className="grid lg:grid-cols-2 gap-x-[45px] gap-y-[21px] w-full">
          {topics.map((topic) => (
            <Topic
              key={topic.id}
              title={topic.name}
              description={topic.description}
              topicId={topic.id}
              isSubscribed={topic.isSubscribed}
            />
          ))}
        </section>
      ) : (
        'Pas de thèmes'
      )}
    </main>
  );
};

export default Topics;
