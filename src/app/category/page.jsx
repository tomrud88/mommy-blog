import React from 'react'
import styles from "./categoryPage.module.css"
import PostList from '@/postList/PostList'
import Menu from '@/components/menu/Menu'

const CategoryPage = ({ searchParams }) => {
  
  const page = parseInt(searchParams.page) || 1;
  const { cat } = searchParams || "";

  return (
    <div>
      <div className={styles.title}>
        <h1>{cat}</h1>
      </div>
      <div className={styles.content}>
        <PostList page={page} cat={cat} />
        <Menu />
      </div>
    </div>
  );
}

export default CategoryPage