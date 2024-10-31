import Image from 'next/image'
import styles from './page.module.css'
import PostList from '@/postList/PostList'
import TopSection from '@/topSection/TopSection';
import Menu from '@/components/menu/Menu';
import CategoryLIst from '@/components/menu/categoryList/CategoryLIst';


export default function Home() {
  return (
    <div>
      <TopSection />
      <CategoryLIst />
      <div className={styles.content}>
        <div className={styles.blueDot}></div>
        <PostList />
        <Menu />
      </div>
    </div>
  );
}
