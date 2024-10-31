import React from 'react'
import styles from "./postList.module.css";
import Pagination from '@/pagination/Pagination';
import PostCard from '@/postCard/PostCard';

const PostList = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Najnowsze</h2>
      <div className={styles.posts}>
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
      <Pagination />
    </div>
  );
}

export default PostList