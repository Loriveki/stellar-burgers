import styles from './modal-overlay.module.css';

// затемненный фон для модального окна, закрывает при клике
interface ModalOverlayUIProps {
  onClick: () => void;
}

export const ModalOverlayUI = ({ onClick }: ModalOverlayUIProps) => (
  <div className={styles.overlay} onClick={onClick} />
);
