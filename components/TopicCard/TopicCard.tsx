'use client';

import { useActionState } from 'react';
import { Button } from '../ui/button';
import {
  subscribeAction,
  unsubscribeAction,
} from '@/features/subscription/subscription.action';
import { usePathname } from 'next/navigation';

type Props = {
  title: string;
  description: string | null;
  topicId: number;
  isSubscribed: boolean;
};

const TopicCard = ({ title, description, topicId, isSubscribed }: Props) => {
  const pathname = usePathname();
  const [state, formAction, isPending] = useActionState(
    isSubscribed
      ? unsubscribeAction.bind(null, topicId)
      : subscribeAction.bind(null, topicId),
    undefined,
  );

  const subscribed =
    pathname === '/profile'
      ? { class: 'bg-primary', text: 'Se désabonner' }
      : { class: 'bg-gray-500', text: 'Déjà abonné' };

  return (
    <div className="flex flex-col bg-gray-100 rounded rounded-xl gap-2 p-4 w-full">
      <h2 className="text-base font-semibold capitalize">{title}</h2>
      <span className="text-sm">{description}</span>
      <div className="w-full flex justify-center">
        <form action={formAction} className={`w-full flex justify-center`}>
          <Button
            type="submit"
            disabled={isPending}
            className={`${isSubscribed && subscribed.class} cursor-pointer`}
          >
            {isPending ? '...' : isSubscribed ? subscribed.text : "S'abonner"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TopicCard;
