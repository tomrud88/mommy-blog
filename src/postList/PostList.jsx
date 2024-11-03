import React from 'react'
import styles from "./postList.module.css";
import Pagination from '@/pagination/Pagination';
import PostCard from '@/postCard/PostCard';

const getData = async (page) => {
  const res = await fetch(`http://localhost:3000/api/posts?page=${page}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};


const PostList = async ({page}) => {

  const data = await getData(page);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Najnowsze</h2>
      <div className={styles.posts}>
        {data?.map((item) => (
          <PostCard key={item._id} item={item} />
        ))}
       
      </div>
      <Pagination />
    </div>
  );
}

export default PostList