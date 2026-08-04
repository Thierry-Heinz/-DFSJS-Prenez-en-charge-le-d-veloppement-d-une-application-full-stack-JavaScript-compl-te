import PostList from '@/components/Post/PostList/PostList';
import { postService } from '@/features/post/post.service';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles',
};

const Dashboard = async () => {
  const posts = await postService.getPosts();

  return (
    <>
      <h1 className="sr-only">Articles</h1>
      <PostList posts={posts} />
    </>
  );
};

export default Dashboard;
