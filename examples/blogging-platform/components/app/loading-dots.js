import styles from "./loading-dots.module.css";

const LoadingDots = () => {
  return (
    <span className={styles.loading}>
      <span />
      <span />
      <span />
    </span>
  );
};

export default LoadingDots;
