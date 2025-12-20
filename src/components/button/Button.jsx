import React from "react";
import { Loader2 } from "lucide-react";
import styles from "./Button.module.scss";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  icon,
  className = "",
  ...props
}) => {
  const variantClass = styles[`button--${variant}`] || "";
  const sizeClass = styles[`button--${size}`] || "";
  return (
    <button
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className={styles["button__loader"]} />}
      {!isLoading && icon && (
        <span className={styles["button__icon"]}>{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;
