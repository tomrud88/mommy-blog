import Image from "next/image"
import styles from "./singlePage.module.css"
import Menu from "@/components/menu/Menu";
import Comments from "@/components/menu/comments/Comments";

 const getData = async (slug) => {
   const res = await fetch(
     `http://localhost:3000/api/posts/${slug}`,
     {
       cache: "no-store",
     }
   );

   if (!res.ok) {
     throw new Error("Failed");
   }

   return res.json();
 };

 

const SinglePage = async ({params}) => {

  const { slug } = params;

  const data = await getData(slug)

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>
            {data?.title}
          </h1>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src={data?.img}
            alt=""
            fill
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.contentSingle}>
        <div className={styles.post}>
          <div className={styles.description} dangerouslySetInnerHTML={{__html: data?.desc}} />
          <Comments postSlug={slug} />
        </div>
          <Menu />
      </div>
    </div>
  );
}

export default SinglePage