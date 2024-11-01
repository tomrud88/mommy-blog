import React from 'react'
import styles from "./categoryPage.module.css"
import PostList from '@/postList/PostList'
import Menu from '@/components/menu/Menu'

const CategoryPage = () => {
  return (
    <div>
      <div className={styles.title}>
        <h1>Mama</h1>
      </div>
      <div className={styles.content}>
        <PostList />
        <Menu />
      </div>
    </div>
  );
}

export default CategoryPage