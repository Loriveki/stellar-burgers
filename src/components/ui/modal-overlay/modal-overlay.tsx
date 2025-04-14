import styles from './modal-overlay.module.css';

// затемненный фон для модального окна, закрывает при клике
export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div className={styles.overlay} onClick={onClick} />
);
