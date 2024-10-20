import Image from "next/image"
import styles from "./singlePage.module.css"
import Menu from "@/components/menu/Menu";

const SinglePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>
            Kreatywne zabawy z dziećmi. Jak rozwijać wyobraźnie malucha?
          </h1>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/first-steps.jpg"
            alt="children playing with the blocks"
            fill
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div className={styles.description}>
            <p>
              Macierzyństwo to jedna z najpiękniejszych, ale i najbardziej
              wymagających ról, które kobieta może pełnić. Oczekiwania
              społeczne, obowiązki domowe, opieka nad dziećmi – to wszystko
              sprawia, że mamy często stawiają potrzeby innych na pierwszym
              miejscu, zapominając o sobie. Jednak dbanie o siebie jest kluczowe
              dla dobrego samopoczucia, zdrowia psychicznego i fizycznego, a co
              za tym idzie – dla lepszej jakości życia całej rodziny. Jak więc
              znaleźć równowagę między macierzyństwem a własnymi potrzebami? Oto
              kilka sprawdzonych strategii, które mogą pomóc.
            </p>
            <h2>1. Zrozum, że dbanie o siebie to nie egoizm</h2>
            <p>
              Jednym z najczęstszych błędów, jakie popełniają mamy, jest
              przekonanie, że dbanie o siebie to forma egoizmu. Nic bardziej
              mylnego! Aby móc efektywnie opiekować się dziećmi i być
              emocjonalnie dostępna, musisz zadbać o swoje zdrowie fizyczne i
              psychiczne. Przemęczona, zestresowana mama nie jest w stanie dawać
              z siebie 100%. Dbając o siebie, stajesz się bardziej cierpliwa,
              zrelaksowana i gotowa na codzienne wyzwania. Warto pamiętać, że
              dzieci uczą się przez obserwację – jeśli pokażesz im, że dbanie o
              siebie jest ważne, nauczysz ich szacunku do własnych potrzeb.
            </p>
            <h2>2. Organizacja czasu – klucz do równowagi</h2>
            <p>
              Jednym z najważniejszych aspektów zachowania równowagi między
              macierzyństwem a czasem dla siebie jest dobra organizacja. Planuj
              swój dzień z uwzględnieniem krótkich momentów tylko dla siebie.
              Może to być czas na kawę, lekturę, krótki spacer czy chwilę
              medytacji. Wprowadzenie harmonogramu, który obejmuje również Twoje
              potrzeby, pomaga utrzymać balans między obowiązkami domowymi a
              regeneracją. Warto pamiętać, że nie musisz mieć godziny na
              odpoczynek – nawet 10-15 minut dla siebie może zdziałać cuda. Pro
              tip: Wprowadź rytuały, takie jak codzienna poranna kawa na
              balkonie, wieczorna medytacja lub 15-minutowy spacer. Zadbaj, by
              stały się one stałym elementem Twojego dnia.
            </p>
            <h2>3. Proś o pomoc i dziel obowiązki</h2>
            <p>
              Nierzadko mamy czują, że powinny same radzić sobie z wszystkimi
              obowiązkami domowymi, co prowadzi do wypalenia. Pamiętaj, że
              proszenie o pomoc to nie oznaka słabości, lecz mądrego podejścia
              do życia. Włączanie partnera, rodziny lub przyjaciół do opieki nad
              dziećmi lub wykonywania domowych obowiązków może przynieść Ci
              cenny czas dla siebie. Warto także nauczyć dzieci samodzielności
              od najmłodszych lat, co w dłuższej perspektywie pozwala na
              odciążenie mamy. Pro tip: Stwórz harmonogram podziału obowiązków
              domowych, w którym każdy członek rodziny będzie miał swoje
              zadania. To nie tylko pomoże w organizacji, ale nauczy dzieci
              odpowiedzialności.
            </p>
            <h2>4. Znajdź hobby lub aktywność, która daje Ci radość</h2>
            <p>
              W codziennej gonitwie łatwo zapomnieć o swoich pasjach.
              Znalezienie czasu na hobby czy aktywność, która sprawia Ci radość,
              jest kluczowe dla dobrego samopoczucia. Niezależnie, czy będzie to
              czytanie książek, joga, rysowanie, pieczenie ciast czy malowanie –
              zadbanie o swoje pasje to forma dbania o siebie. Warto pamiętać,
              że macierzyństwo to nie rezygnacja z tego, kim jesteś. Pasje i
              zainteresowania to elementy, które definiują Twoją osobowość, a
              rozwijanie ich może być odskocznią od codziennych obowiązków. Pro
              tip: Jeśli trudno znaleźć czas na pełną sesję ulubionej
              aktywności, spróbuj dzielić ją na krótsze etapy – np. jeśli lubisz
              malować, poświęć 15 minut dziennie, zamiast szukać godziny w
              tygodniu.
            </p>
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
}

export default SinglePage