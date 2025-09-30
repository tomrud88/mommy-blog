import React from "react";
import styles from "./aboutPage.module.css";
import Image from "next/image";

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <Image
            src="/mother-embracing-her-daughter.webp"
            alt="Mama przytulająca córkę"
            fill
            className={styles.image}
          />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>👩‍👧 O mnie</h1>
          <div className={styles.description}>
            <p>
              Jestem mamą pełną energii i uśmiechu, a moją największą inspiracją
              jest moja trzyletnia córeczka. To ona każdego dnia uczy mnie
              cierpliwości, kreatywności i radości z drobnych chwil. Razem
              odkrywamy świat – od pierwszych prób pieczenia ciasteczek, przez
              malowanie palcami, aż po wielkie przygody w parku, gdzie każdy
              kamyczek i listek ma swoją historię.
            </p>
            <p>
              Macierzyństwo to dla mnie nie tylko wyzwanie, ale i niezwykła
              podróż, która pokazuje, że najważniejsze w życiu to bliskość,
              miłość i wspólne chwile. Staram się patrzeć na świat oczami
              dziecka – z zachwytem i ciekawością – i dzielić się tym
              spojrzeniem z innymi.
            </p>
            <p>
              Na tym blogu dzielę się swoimi doświadczeniami, przemyśleniami i
              praktycznymi poradami dotyczącymi rodzicielstwa. Wierzę, że każda
              mama jest wyjątkowa i ma swoją unikalną historię do opowiedzenia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
