import Link from "next/link";
import styles from "./menuCategories.module.css";

const slugColorMap = {
  mama: "rgb(65, 65, 245)",
  dziecko: "rgb(223, 115, 196)",
  zabawy: "rgb(245, 161, 65)",
  książki: "rgb(67, 185, 13)",
};

const MenuCategories = async () => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return <p className={styles.error}>Nie udało się załadować kategorii.</p>;
  }

  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    return <p className={styles.error}>Brak dostępnych kategorii.</p>;
  }

  return (
    <div className={styles.categoryList}>
      {data.map((item) => (
        <Link
          key={item.id}
          href={`/?cat=${item.slug}`}
          className={styles.categoryItem}
          style={{ backgroundColor: slugColorMap[item.slug] || "#6b7280" }}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default MenuCategories;
