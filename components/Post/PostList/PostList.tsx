'use client';

import NavButton from '@/components/Buttons/NavButton/NavButton';
import { PostWithAuthor } from '@/types/post-types';
import PostExcerpt from '../PostExcerpt/PostExcerpt';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';

type Props = {
  posts: PostWithAuthor[];
};

const PostList = ({ posts }: Props) => {
  const [sort, setSort] = useState('asc');

  const sortedPosts = [...posts].sort(function (a, b) {
    const timeA = a.createdAt.getTime();
    const timeB = b.createdAt.getTime();
    return sort === 'asc' ? timeA - timeB : timeB - timeA;
  });

  const handleSort = () => (sort === 'asc' ? setSort('desc') : setSort('asc'));

  return (
    <>
      <header className="pt-[30px] pb-[25px] flex flex-col gap-4 items-center lg:flex-row justify-between">
        <NavButton text="Créer un article" url="/post/create" />
        <div className="block">
          <Button
            onClick={handleSort}
            aria-label="Trier par date"
            variant="ghost"
            className="text-base cursor-pointer"
          >
            Trier par
            {sort === 'asc' ? (
              <ArrowUp data-icon="inline-end" />
            ) : (
              <ArrowDown data-icon="inline-end" />
            )}
          </Button>
        </div>
      </header>
      <section className="grid lg:grid-cols-2 gap-x-[45px] gap-y-[21px]">
        {sortedPosts.map((post) => {
          return (
            <PostExcerpt
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              author={post.author.name}
              date={post.createdAt}
            />
          );
        })}
      </section>
    </>
  );
};

export default PostList;
