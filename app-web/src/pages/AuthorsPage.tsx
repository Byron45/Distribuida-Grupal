import React, { useEffect, useState } from 'react';
import { authorService } from '../services/authorService';
import { useAppStore } from '../store/useAppStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './AuthorsPage.module.css';

export const AuthorsPage: React.FC = () => {
    const { authors, loading, error, loadAllData, setError } = useAppStore();
    const [name, setName] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setLocalLoading(true);
            await authorService.create({ name } as any);
            setName('');
            await loadAllData();
        } catch (err: any) {
            setError(err.message || 'Error al crear el autor');
        } finally {
            setLocalLoading(false);
        }
    };

    const handleDelete = async (id: number, authorName: string) => {
        const confirmed = window.confirm(`¿Está seguro de que desea eliminar al autor "${authorName}"? Esta acción no se puede deshacer.`);
        if (!confirmed) return;

        try {
            setLocalLoading(true);

            if (typeof (authorService as any).delete === 'function') {
                await (authorService as any).delete(id);
            } else {
                console.warn('El método delete aún no está implementado en authorService.ts');
            }
            await loadAllData();
        } catch (err: any) {
            setError(err.message || 'Error al eliminar el autor');
        } finally {
            setLocalLoading(false);
        }
    };

    const isLoading = loading || localLoading;

    if (loading && authors.length === 0) {
        return <LoadingSpinner message="Conectando con el catálogo de Autores (Quarkus)" />;
    }

    return (
        <div className={styles.container}>
            <h2>Gestión de Autores (Microservicio Quarkus)</h2>

            {error && <ErrorMessage message={error} />}

            <div className={styles.contentWrapper}>
                {/* Formulario */}
                <div className={styles.formBox}>
                    <h3>Registrar Nuevo Autor</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nombre del Autor:</label>
                            <input
                                className={styles.inputField}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej. Gabriel García Márquez"
                                disabled={isLoading}
                            />
                        </div>
                        <button className={styles.submitBtn} type="submit" disabled={isLoading}>
                            {isLoading ? 'Guardando...' : 'Guardar Autor'}
                        </button>
                    </form>
                </div>

                {/* Tabla */}
                <div className={styles.tableContainer}>
                    <h3>Autores Registrados</h3>
                    <table className={styles.table} border={1} cellPadding={8}>
                        <thead>
                        <tr className={styles.tableHeader}>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th style={{ textAlign: 'center' }}>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {authors.length === 0 ? (
                            <tr><td colSpan={3} style={{ textAlign: 'center' }}>No hay autores registrados.</td></tr>
                        ) : (
                            authors.map((author) => (
                                <tr key={author.id}>
                                    <td>{author.id}</td>
                                    <td>{author.name}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => author.id !== undefined && handleDelete(author.id, author.name)}
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