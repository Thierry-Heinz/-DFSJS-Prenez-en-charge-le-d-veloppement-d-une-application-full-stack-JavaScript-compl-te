import PostList from '@/components/Post/PostList/PostList';
import { postService } from '@/features/post/post.service';

const Dashboard = async () => {
  const posts = await postService.getPosts();

  return <PostList posts={posts} />;
};

export default Dashboard;
