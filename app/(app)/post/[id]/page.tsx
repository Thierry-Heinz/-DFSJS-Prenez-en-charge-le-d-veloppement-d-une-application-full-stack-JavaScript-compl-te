import { postService } from '@/features/post/post.service';

export const Post = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const post = await postService.getPostByIdWithDetails(+id);

  console.log(post);
  return <p>Post: {id}</p>;
};

export default Post;
