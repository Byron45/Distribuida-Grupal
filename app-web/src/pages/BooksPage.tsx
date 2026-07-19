import React, {useEffect, useState} from 'react';
import {useAppStore} from '../store/useAppStore';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {ErrorMessage} from '../components/ErrorMessage';
import type {Book} from '../types/index';
import styles from './BooksPage.module.css';

export const BooksPage: React.FC = () => {
    const {books, loading, error, loadAllData, saveBook, deleteBook} = useAppStore();

    const [isbn, setIsbn] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const resetForm = () => {
        setIsbn('');
        setTitle('');
        setPrice('');
        setIsEdit(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isbn.trim() || !title.trim() || !price) return;

        setSubmitting(true);
        // El backend recibe la entidad Book: isbn, title, price, version
        const book: Partial<Book> = {
            isbn,
            title,
            price: parseFloat(price),
        };
        await saveBook(book, isEdit);
        setSubmitting(false);
        resetForm();
    };

    const handleEdit = (book: Book) => {
        setIsbn(book.isbn);
        setTitle(book.title);
        setPrice(String(book.price));
        setIsEdit(true);
    };

    const handleDelete = async (bookIsbn: string, bookTitle: string) => {
        const confirmed = window.confirm(`¿Está seguro de eliminar el libro "${bookTitle}" (ISBN ${bookIsbn})?`);
        if (!confirmed) return;

        setSubmitting(true);
        await deleteBook(bookIsbn);
        setSubmitting(false);
    };

    const isBusy = loading || submitting;

    if (loading && books.length === 0) {
        return <LoadingSpinner message="Conectando con el catálogo de Libros (Quarkus + Stork)"/>;
    }

    return (
        <div className={styles.container}>
            <h2>Gestión de Libros (Microservicio Quarkus)</h2>

            {error && <ErrorMessage message={error}/>}

            <div className={styles.contentWrapper}>
                {/* Formulario crear / editar */}
                <div className={styles.formBox}>
                    <h3>{isEdit ? 'Editar Libro' : 'Registrar Nuevo Libro'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>ISBN:</label>
                            <input
                                className={styles.inputField}
                                type="text"
                                value={isbn}
                                onChange={(e) => setIsbn(e.target.value)}
                                placeholder="Ej. 978-9942..."
                                disabled={isBusy || isEdit}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Título:</label>
                            <input
                                className={styles.inputField}
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isBusy}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Precio:</label>
                            <input
                                className={styles.inputField}
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                disabled={isBusy}
                            />
                        </div>
                        <button className={styles.submitBtn} type="submit" disabled={isBusy}>
                            {submitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Guardar Libro'}
                        </button>
                        {isEdit && (
                            <button type="button" className={styles.cancelBtn} onClick={resetForm} disabled={isBusy}>
                                Cancelar
                            </button>
                        )}
                    </form>
                </div>

                {/* Tabla */}
                <div className={styles.tableContainer}>
                    <h3>Libros Registrados</h3>
                    <table className={styles.table} border={1} cellPadding={8}>
                        <thead>
                        <tr className={styles.tableHeader}>
                            <th>ISBN</th>
                            <th>Título</th>
                            <th>Precio</th>
                            <th>Autores</th>
                            <th style={{textAlign: 'center'}}>Vendidos</th>
                            <th style={{textAlign: 'center'}}>Stock</th>
                            <th style={{textAlign: 'center'}}>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {books.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{textAlign: 'center'}}>No hay libros registrados.</td>
                            </tr>
                        ) : (
                            books.map((book) => (
                                <tr key={book.isbn}>
                                    <td><strong>{book.isbn}</strong></td>
                                    <td>{book.title}</td>
                                    <td>${book.price?.toFixed(2)}</td>
                                    <td>
                                        {book.authors && book.authors.length > 0
                                            ? book.authors.map((a) => a.name).join(', ')
                                            : 'Sin autores'}
                                    </td>
                                    <td style={{textAlign: 'center'}}>{book.inventorySold}</td>
                                    <td style={{textAlign: 'center'}}>{book.inventorySupplied}</td>
                                    <td style={{textAlign: 'center'}}>
                                        <button className={styles.editBtn} onClick={() => handleEdit(book)}
                                                disabled={isBusy}>
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(book.isbn, book.title)}
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