type Props = {
  title: string;
  author: string;
  date: Date | string;
  content: string;
};

const PostExcerpt = ({ title, author, date, content }: Props): React.ReactNode => {
  const formattedDate = new Date(date).toLocaleDateString('fr-FR');

  return (
    <article className="flex flex-col gap-2 rounded-lg bg-muted p-4">
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <div className="flex gap-4 text-sm text-foreground">
        <span>{formattedDate}</span>
        <span>{author}</span>
      </div>
      <p className="line-clamp-4 text-sm text-foreground">{content}</p>
    </article>
  );
};

export default PostExcerpt;
