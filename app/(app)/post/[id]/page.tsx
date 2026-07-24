import CommentList from '@/components/CommentList/CommentList';
import CommentForm from '@/components/Forms/CommentForm/CommentForm';
import { postService } from '@/features/post/post.service';

export const Post = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const post = await postService.getPostByIdWithDetails(+id);
  const formattedDate = new Date(`${post?.createdAt}`).toLocaleDateString(
    'fr-FR',
  );

  if (!post) return;

  return (
    <main className="md:py-6 md:px-24 p-4 flex flex-col">
      <article className="mb-8">
        <h1 className="font-semibold text-2xl mb-4">{post?.title}</h1>
        <span className="flex gap-8 mb-4 ">
          <time>{formattedDate}</time>
          <span>{post?.author.name}</span>
          <span className="capitalize">{post?.topic.name}</span>
        </span>
        <p className="pb-8 border-b border-black">{post?.content}</p>
      </article>
      <aside>
        <h2 className="text-xl mb-2 md:mb-8">Commentaires</h2>
        {post?.comments.length !== 0 ? (
          <CommentList comments={post.comments} />
        ) : (
          <span>Pas de commentaires</span>
        )}
        <footer className="py-8">
          <CommentForm />
        </footer>
      </aside>
    </main>
  );
};

export default Post;
