import Image from 'next/image'
import styles from './page.module.css'
import PostList from '@/postList/PostList'


export default function Home() {
  return (
    <div>
      <div className={styles.blueDot}></div>
      <PostList />
    </div>
  )
}
