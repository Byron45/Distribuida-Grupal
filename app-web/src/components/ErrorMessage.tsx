import React from 'react';
import styles from '../pages/SharedStyles.module.css';

interface Props {
    message: string;
}

export const ErrorMessage: React.FC<Props> = ({ message }) => {
    return (
        <div className={styles.errorMessage}>
            ⚠️ {message}
        </div>
    );
};