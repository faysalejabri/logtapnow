import styles from "./GlassCard.module.scss";

export const GlassCard = ({ children, className = "" }) => (
  <div className={`${styles["glass-card"]} ${className}`}>{children}</div>
);
