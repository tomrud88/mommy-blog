import Image from 'next/image'
import React from 'react'
import styles from './postCard.module.css'
import Link from 'next/link';

const PostCard = ({item,key}) => {
  return (
    <div className={styles.container} key={key}>
      <div className={styles.imageContainer}>
        <Image
          src={item.img}
          alt="children playing with blocks"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={styles.textContainer}>
        <Link href={`posts/${item.slug}`}>
          <div className={styles.title}>
            <h3>{item.title}</h3>
          </div>
        </Link>
        <div className={styles.text}>
          <p>{item.desc}</p>
          <Link href="/" className={styles.readMore}>
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PostCard