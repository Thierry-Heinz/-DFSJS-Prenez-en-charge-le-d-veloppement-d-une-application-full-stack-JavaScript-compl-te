import ProfileForm from '@/components/Forms/ProfileForm/ProfileForm';
import Topic from '@/components/TopicCard/TopicCard';
import { authService } from '@/features/auth/auth.service';
import { topicService } from '@/features/topic/topic.service';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Profil',
};

const Profile = async (): Promise<React.ReactNode> => {
  const [session, topics] = await Promise.all([
    authService.getSession(),
    topicService.getAllUserTopics(),
  ]);

  if (!session) return;

  return (
    <div className="py-8 flex flex-col items-center w-full">
      <div className="flex flex-col justify-center items-center py-8 ">
        <h1 className="text-2xl font-semibold">Profil utilisateur</h1>
        <ProfileForm
          username={session.user.username ?? ''}
          email={session.user.email}
        />
      </div>

      <aside className="border-t border-black pt-4 flex flex-col items-center">
        <h2 className="font-semibold text-xl mb-2">Abonnements</h2>
        <section className="grid lg:grid-cols-2 gap-x-[45px] gap-y-[21px] w-full ">
          {topics.map((topic) => {
            return (
              topic.isSubscribed && (
                <Topic
                  key={topic.id}
                  title={topic.name}
                  description={topic.description}
                  topicId={topic.id}
                  isSubscribed={topic.isSubscribed}
                />
              )
            );
          })}
        </section>
      </aside>
    </div>
  );
};

export default Profile;
