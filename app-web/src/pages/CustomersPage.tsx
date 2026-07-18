import React, { useEffect, useState } from 'react';
import { customerService } from '../services/customerService';
import { useAppStore } from '../store/useAppStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './CustomersPage.module.css';

export const CustomersPage: React.FC = () => {
    const { customers, loading, error, loadAllData, setError } = useAppStore();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

        try {
            setLocalLoading(true);
            await customerService.create({ firstName, lastName, email } as any);
            setFirstName('');
            setLastName('');
            setEmail('');
            await loadAllData();
        } catch (err: any) {
            setError(err.message || 'Error al registrar cliente');
        } finally {
            setLocalLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        const confirmed = window.confirm(`¿Está seguro de eliminar al cliente "${name}"? Esta acción es permanente.`);
        if (!confirmed) return;

        try {
            setLocalLoading(true);
            await customerService.delete(id);
            await loadAllData();
        } catch (err: any) {
            setError(err.message || 'Error al eliminar cliente');
        } finally {
            setLocalLoading(false);
        }
    };

    const isLoading = loading || localLoading;

    if (loading && customers.length === 0) {
        return <LoadingSpinner message="Conectando con el microservicio de Clientes" />;
    }

    return (
        <div className={styles.container}>
            <h2>Gestión de Clientes (Microservicio Spring Boot)</h2>

            {error && <ErrorMessage message={error} />}

            <div className={styles.contentWrapper}>
                {/* Formulario */}
                <div className={styles.formBox}>
                    <h3>Registrar Nuevo Cliente</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Nombre:</label>
                            <input className={styles.inputField} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Apellido:</label>
                            <input className={styles.inputField} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email:</label>
                            <input className={styles.inputField} type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                        </div>
                        <button className={styles.submitBtn} type="submit" disabled={isLoading}>
                            {isLoading ? 'Registrando...' : 'Registrar Cliente'}
                        </button>
                    </form>
                </div>

                {/* Tabla */}
                <div className={styles.tableContainer}>
                    <h3>Clientes Registrados</h3>
                    <table className={styles.table} border={1} cellPadding={8}>
                        <thead>
                        <tr className={styles.tableHeader}>
                            <th style={{ width: '10%' }}>ID</th>
                            <th>Nombre Completo</th>
                            <th>Email</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {customers.length === 0 ? (
                            <tr><td colSpan={4} style={{ textAlign: 'center' }}>No hay clientes registrados.</td></tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>{customer.firstName} {customer.lastName}</td>
                                    <td>{customer.email}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => customer.id !== undefined && handleDelete(customer.id, `${customer.firstName} ${customer.lastName}`)}
                                            disabled={isLoading}
                                        >
                                            ❌ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};