import Button from '@/components/Buttons/NavButton/NavButton';
import PostExcerpt from '@/components/Post/PostExcerpt/PostExcerpt';
import PostList from '@/components/Post/PostList/PostList';
import { postService } from '@/features/post/post.service';

const Dashboard = async () => {
  const posts = await postService.getPosts();

  return <PostList posts={posts} />;
};

export default Dashboard;
