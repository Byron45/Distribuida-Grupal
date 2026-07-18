import React, { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import { useAppStore } from '../store/useAppStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './BooksPage.module.css';

export const BooksPage: React.FC = () => {
    const { books, authors, customers, loading, error, loadAllData, setError } = useAppStore();

    const [isbn, setIsbn] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [selectedAuthorId, setSelectedAuthorId] = useState('');
    const [quantitySupply, setQuantitySupply] = useState('1');

    const [selectedIsbn, setSelectedIsbn] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [quantitySale, setQuantitySale] = useState('1');

    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const handleSupply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isbn.trim() || !title.trim() || !price || !selectedAuthorId) return;

        try {
            setLocalLoading(true);
            await bookService.supply({
                isbn,
                title,
                price: parseFloat(price),
                authorIds: [parseInt(selectedAuthorId)],
                quantity: parseInt(quantitySupply)
            });
            setIsbn('');
            setTitle('');
            setPrice('');
            await loadAllData();
        } catch (err: any) {
            setError(err.message || 'Error al abastecer inventario');
        } finally {
            setLocalLoading(false);
        }
    };

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedIsbn || !selectedCustomerId || !quantitySale) return;

        try {
            setLocalLoading(true);
            await bookService.purchase({
                customerId: parseInt(selectedCustomerId),
                isbn: selectedIsbn,
                quantity: parseInt(quantitySale)
            });
            await loadAllData();
        } catch (err: any) {
            setError(err.message || 'Error al procesar la venta');
        } finally {
            setLocalLoading(false);
        }
    };

    const handleDelete = async (bookIsbn: string, bookTitle: string) => {
        const confirmed = window.confirm(`¿Está seguro de eliminar el libro "${bookTitle}" con ISBN ${bookIsbn}?`);
        if (!confirmed) return;

        try {
            setLocalLoading(true);
            if (typeof (bookService as any).delete === 'function') {
                await (bookService as any).delete(bookIsbn);
            } else {
                console.warn('El método delete aún no está implementado');
            }
            await loadAllData();
        } catch (err: any) {
            setError(err.message || 'Error al eliminar el libro');
        } finally {
            setLocalLoading(false);
        }
    };

    const isLoading = loading || localLoading;

    if (loading && books.length === 0) {
        return <LoadingSpinner message="Conectando con Consul y el Gateway de Traefik" />;
    }

    return (
        <div className={styles.container}>
            <h2>Panel de Inventario y Transacciones Globales</h2>

            {error && <ErrorMessage message={error} />}

            <div className={styles.actionGrid}>
                {/* Abastecer */}
                <div className={styles.formCard}>
                    <h3>📥 Abastecer / Ingresar Libro</h3>
                    <form onSubmit={handleSupply}>
                        <input className={styles.formInput} type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="ISBN" disabled={isLoading} />
                        <input className={styles.formInput} type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del Libro" disabled={isLoading} />
                        <input className={styles.formInput} type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio" disabled={isLoading} />

                        <select className={styles.formSelect} value={selectedAuthorId} onChange={(e) => setSelectedAuthorId(e.target.value)} disabled={isLoading}>
                            <option value="">-- Seleccionar Autor --</option>
                            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>

                        <input className={styles.formInput} type="number" min="1" value={quantitySupply} onChange={(e) => setQuantitySupply(e.target.value)} disabled={isLoading} />
                        <button className={styles.submitBtn} type="submit" disabled={isLoading}>Abastecer Stock</button>
                    </form>
                </div>

                {/* Venta */}
                <div className={styles.formCard}>
                    <h3>💸 Registrar Venta (Transacción)</h3>
                    <form onSubmit={handlePurchase}>
                        <select className={styles.formSelect} value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} disabled={isLoading}>
                            <option value="">-- Seleccionar Cliente --</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>
                            ))}
                        </select>

                        <select className={styles.formSelect} value={selectedIsbn} onChange={(e) => setSelectedIsbn(e.target.value)} disabled={isLoading}>
                            <option value="">-- Seleccionar Libro por ISBN --</option>
                            {books.map(b => <option key={b.isbn} value={b.isbn}>{b.title}</option>)}
                        </select>

                        <input className={styles.formInput} type="number" min="1" value={quantitySale} onChange={(e) => setQuantitySale(e.target.value)} disabled={isLoading} />
                        <button className={`${styles.submitBtn} ${styles.btnPurchase}`} type="submit" disabled={isLoading}>Procesar Compra</button>
                    </form>
                </div>
            </div>

            {/* Tabla */}
            <h3>📊 Inventario General de Libros</h3>
            <table className={styles.table} border={1} cellPadding={8}>
                <thead>
                <tr className={styles.tableHeader}>
                    <th>ISBN</th>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Autores</th>
                    <th>📥</th>
                    <th>💸</th>
                    <th>📦</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {books.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center' }}>No hay libros en el sistema.</td></tr>
                ) : (
                    books.map((book) => {
                        const stock = book.inventorySupplied - book.inventorySold;
                        return (
                            <tr key={book.isbn}>
                                <td><strong>{book.isbn}</strong></td>
                                <td>{book.title}</td>
                                <td>${book.price.toFixed(2)}</td>
                                <td>{book.authors?.join(', ') || 'Sin autor'}</td>
                                <td style={{ textAlign: 'center' }}>{book.inventorySupplied}</td>
                                <td style={{ textAlign: 'center' }}>{book.inventorySold}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold', color: stock < 3 ? 'red' : 'green' }}>{stock}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className={styles.deleteBtn} onClick={() => book.isbn && handleDelete(book.isbn, book.title)} disabled={isLoading}>
                                        ❌ Eliminar
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
};