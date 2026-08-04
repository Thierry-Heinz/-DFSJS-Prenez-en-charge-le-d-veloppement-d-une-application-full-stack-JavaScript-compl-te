import Topic from '@/components/TopicCard/TopicCard';
import { topicService } from '@/features/topic/topic.service';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thèmes',
};

const Topics = async () => {
  const topics = await topicService.getAllUserTopics();

  if (!topics) return;
  return (
    <div className="py-8 flex flex-col items-center">
      <h1 className="sr-only">Thèmes</h1>
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
    </div>
  );
};

export default Topics;
