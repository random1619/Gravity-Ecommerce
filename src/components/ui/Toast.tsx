'use client';

import React, { useState } from 'react';
import { Check, X, Info } from 'lucide-react';
import styles from './Toast.module.css';

export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <Check size={16} strokeWidth={2.5} />,
        error: <X size={16} strokeWidth={2.5} />,
        info: <Info size={16} strokeWidth={2} />,
    };

    return (
        <div className={`${styles.toast} ${styles[type]} ${!isVisible ? styles.fadeOut : ''}`}>
            <span className={styles.icon}>{icons[type]}</span>
            <span className={styles.message}>{message}</span>
        </div>
    );
};

export default Toast;
