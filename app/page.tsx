import styles from "./page.module.css";
import Gallery from "@/components/image-gallery/ImageGallery";

export default function Home() {
  return (
    <div className={styles.page}>
      <main>
        <Gallery />
      </main>
    </div>
  );
}
