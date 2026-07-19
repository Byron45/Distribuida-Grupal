import React, {useEffect, useState} from 'react';
import {useAppStore} from '../store/useAppStore';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {ErrorMessage} from '../components/ErrorMessage';
import type {Author} from '../types/index';
import styles from './AuthorsPage.module.css';

export const AuthorsPage: React.FC = () => {
    const {authors, loading, error, loadAllData, saveAuthor, deleteAuthor} = useAppStore();

    const [name, setName] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const resetForm = () => {
        setName('');
        setEditId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setSubmitting(true);
        const author: Author = editId ? {id: editId, name} : {name};
        await saveAuthor(author);
        setSubmitting(false);
        resetForm();
    };

    const handleEdit = (author: Author) => {
        setEditId(author.id ?? null);
        setName(author.name);
    };

    const handleDelete = async (id: number, authorName: string) => {
        const confirmed = window.confirm(
            `¿Está seguro de que desea eliminar al autor "${authorName}"? Esta acción no se puede deshacer.`
        );
        if (!confirmed) return;

        setSubmitting(true);
        await deleteAuthor(id);
        setSubmitting(false);
    };

    const isBusy = loading || submitting;

    if (loading && authors.length === 0) {
        return <LoadingSpinner message="Conectando con el catálogo de Autores (Quarkus)"/>;
    }

    return (
        <div className={styles.container}>
            <h2>Gestión de Autores (Microservicio Quarkus)</h2>

            {error && <ErrorMessage message={error}/>}

            <div className={styles.contentWrapper}>
                {/* Formulario crear / editar */}
                <div className={styles.formBox}>
                    <h3>{editId ? 'Editar Autor' : 'Registrar Nuevo Autor'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nombre del Autor:</label>
                            <input
                                className={styles.inputField}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej. Jorge Icaza"
                                disabled={isBusy}
                            />
                        </div>
                        <button className={styles.submitBtn} type="submit" disabled={isBusy}>
                            {submitting ? 'Guardando...' : editId ? 'Actualizar' : 'Guardar Autor'}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={resetForm}
                                disabled={isBusy}
                            >
                                Cancelar
                            </button>
                        )}
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
                            <th style={{textAlign: 'center'}}>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {authors.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{textAlign: 'center'}}>No hay autores registrados.</td>
                            </tr>
                        ) : (
                            authors.map((author) => (
                                <tr key={author.id}>
                                    <td>{author.id}</td>
                                    <td>{author.name}</td>
                                    <td style={{textAlign: 'center'}}>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(author)}
                                            disabled={isBusy}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => author.id !== undefined && handleDelete(author.id, author.name)}
                                            disabled={isBusy}
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