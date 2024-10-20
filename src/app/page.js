import Image from 'next/image'
import styles from './page.module.css'
import PostList from '@/postList/PostList'
import TopSection from '@/topSection/TopSection';
import Menu from '@/components/menu/Menu';


export default function Home() {
  return (
    <div>
      <TopSection />
      <div className={styles.content}>
      <div className={styles.blueDot}></div>
        <PostList />
        <Menu />
      </div>
    </div>
  );
}
