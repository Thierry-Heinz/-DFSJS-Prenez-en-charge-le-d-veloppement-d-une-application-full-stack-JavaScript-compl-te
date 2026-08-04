import { CommentWithAuthor } from '@/types/comment-types';
import React from 'react';

type Props = {
  comments: CommentWithAuthor[];
};

/** Liste des commentaires d'un article, avec le nom de leur auteur. */
const CommentList = ({ comments }: Props): React.ReactNode => {
  return (
    <div className="flex flex-col gap-2 md:gap-8 px-4 md:pl-8 md:pr-30">
      {comments.map((comment) => {
        return (
          <div
            key={comment.id}
            className={`flex-col md:flex-row flex md:gap-6 md:items-start items-end w-full`}
          >
            <span>{comment.author.name}</span>
            <span className="p-4 rounded rounded-xl bg-gray-100 w-full flex-inline">
              {comment.comment}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
