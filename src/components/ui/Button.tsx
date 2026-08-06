'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'full';
  isLoading?: boolean;
}

/** Kowalski spring — press and lift move through physics, never fixed durations. */
const spring = { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 } as const;

const MotionButton = motion.button;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const reduceMotion = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples(ripples => ripples.filter(r => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  const buttonClassName = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${className}
  `.trim();

  // Framer owns hover/tap transforms (spring, interruptible). CSS keeps the
  // color/shadow states. Reduced-motion users get no lift/press — only the
  // native :active fallback defined in the stylesheet.
  const motionProps = reduceMotion
    ? {}
    : {
        whileHover: disabled || isLoading ? undefined : { y: -2 },
        whileTap: disabled || isLoading ? undefined : { scale: 0.96, y: 0 },
        transition: spring,
      };

  return (
    <MotionButton
      className={buttonClassName}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...motionProps}
      {...(props as React.ComponentProps<typeof MotionButton>)}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className={styles.ripple}
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
      {isLoading ? <span className={styles.loader}></span> : children}
    </MotionButton>
  );
};

export default Button;
