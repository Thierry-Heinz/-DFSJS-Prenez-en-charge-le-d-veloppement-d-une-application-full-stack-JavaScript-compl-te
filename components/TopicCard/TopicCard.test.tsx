import { fireEvent, render, screen } from '@testing-library/react';
import TopicCard from './TopicCard';

jest.mock('../../features/subscription/subscription.action', () => ({
  subscribeAction: jest.fn(),
  unsubscribeAction: jest.fn(),
}));

import {
  subscribeAction,
  unsubscribeAction,
} from '../../features/subscription/subscription.action';

const usePathnameMock = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

describe('TopicCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the title and description', () => {
    usePathnameMock.mockReturnValue('/topics');
    render(
      <TopicCard
        title="JavaScript"
        description="Le langage du web"
        topicId={1}
        isSubscribed={false}
      />,
    );

    screen.getByText('JavaScript');
    screen.getByText('Le langage du web');
  });

  it('should display "S\'abonner" and call subscribeAction when not subscribed', async () => {
    usePathnameMock.mockReturnValue('/topics');
    jest
      .mocked(subscribeAction)
      .mockResolvedValue({ success: true, data: undefined });
    render(
      <TopicCard
        title="JavaScript"
        description="Le langage du web"
        topicId={1}
        isSubscribed={false}
      />,
    );

    const button = screen.getByRole('button', { name: "S'abonner" });
    fireEvent.click(button);

    await screen.findByRole('button', { name: "S'abonner" });
    expect(subscribeAction).toHaveBeenCalledWith(1, undefined, expect.any(FormData));
    expect(unsubscribeAction).not.toHaveBeenCalled();
  });

  it('should display "Déjà abonné" outside of the profile page when subscribed', () => {
    usePathnameMock.mockReturnValue('/topics');
    render(
      <TopicCard
        title="JavaScript"
        description="Le langage du web"
        topicId={1}
        isSubscribed={true}
      />,
    );

    screen.getByRole('button', { name: 'Déjà abonné' });
  });

  it('should display "Se désabonner" and call unsubscribeAction on the profile page when subscribed', async () => {
    usePathnameMock.mockReturnValue('/profile');
    jest
      .mocked(unsubscribeAction)
      .mockResolvedValue({ success: true, data: undefined });
    render(
      <TopicCard
        title="JavaScript"
        description="Le langage du web"
        topicId={1}
        isSubscribed={true}
      />,
    );

    const button = screen.getByRole('button', { name: 'Se désabonner' });
    fireEvent.click(button);

    await screen.findByRole('button', { name: 'Se désabonner' });
    expect(unsubscribeAction).toHaveBeenCalledWith(1, undefined, expect.any(FormData));
    expect(subscribeAction).not.toHaveBeenCalled();
  });
});
