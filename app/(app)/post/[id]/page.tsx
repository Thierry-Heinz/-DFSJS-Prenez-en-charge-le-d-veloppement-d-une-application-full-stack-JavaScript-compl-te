export const Post = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <p>Post: {id}</p>;
};

export default Post;
