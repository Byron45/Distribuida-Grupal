import React from 'react';
import styles from '../pages/SharedStyles.module.css';

interface Props {
    message: string;
}

export const LoadingSpinner: React.FC<Props> = ({ message }) => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingIcon}>⏳</div>
            <h3>Sincronizando Base de Datos...</h3>
            <p>{message}</p>
        </div>
    );
};