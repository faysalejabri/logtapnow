import styles from "./AppleBackground.module.scss";

export const AppleBackground = ({ children }) => (
  <div className={styles["apple-bg"]}>
    <div
      className={`${styles["apple-bg__orb"]} ${styles["apple-bg__orb--blue"]}`}
    />
    <div
      className={`${styles["apple-bg__orb"]} ${styles["apple-bg__orb--purple"]}`}
    />
    <div className={styles["apple-bg__content"]}>{children}</div>
  </div>
);
