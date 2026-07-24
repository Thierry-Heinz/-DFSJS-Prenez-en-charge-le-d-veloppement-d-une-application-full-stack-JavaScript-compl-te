import { CommentWithAuthor } from '@/types/comment-types';
import React from 'react';

type Props = {
  comments: CommentWithAuthor[];
};

const CommentList = ({ comments }: Props): React.ReactNode => {
  return (
    <div className="flex flex-col gap-8">
      {comments.map((comment, i) => {
        return (
          <div
            key={comment.id}
            className={`${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} flex px-8 gap-6 items-start w-full`}
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
