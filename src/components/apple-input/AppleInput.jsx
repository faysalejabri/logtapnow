import styles from "./AppleInput.module.scss";

export const AppleInput = ({ ...props }) => (
  <input {...props} className={styles["apple-input"]} />
);
