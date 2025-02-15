import { MouseEvent, ReactNode } from 'react';

import styles from './Button.module.css';

function Button({
  children,
  onClick,
  type = 'primary',
}: {
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLElement>) => void;
  type?: 'primary' | 'back' | 'position';
}) {
  return (
    <button
      type={type === 'primary' ? 'submit' : 'button'}
      onClick={onClick}
      className={`${styles.btn} ${styles[type]}`}
    >
      {children}
    </button>
  );
}

export default Button;
