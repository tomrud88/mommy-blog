import Image from 'next/image'
import React from 'react'
import styles from './postCard.module.css'

const PostCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src="/children-block-game.jpg"
          alt="children playing with blocks"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={styles.textContainer}>
        <div className={styles.title}>
          <h3>Kreatywne zabawy z dziecmi: Jak rozwijac wyobraznie malucha?</h3>
        </div>
        <div className={styles.text}>
          <p>
            W dzisiejszym zdominowanym przez technologie swiecie, rozwijanie
            wyoubrazni u dzieci moze wydawac sie wyzwaniem. Jednak to wlasnie
            dzieki wyobrazni maluchy...
          </p>
        </div>
      </div>
    </div>
  );
}

export default PostCard