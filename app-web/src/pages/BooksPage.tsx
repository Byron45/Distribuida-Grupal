import React, { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import { useAppStore } from '../store/useAppStore'; // 🟢 Conectado al nuevo Zustand Store

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
                console.warn('El método delete aún no está expuesto en bookService.ts');
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
        return (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#666' }}>
                <div style={{ marginBottom: '15px', fontSize: '32px' }}>⏳</div>
                <h3 style={{ margin: '0 0 8px 0' }}>Sincronizando Inventario Global...</h3>
                <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>Conectando con Consul y el Gateway de Traefik</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Panel de Inventario y Transacciones Globales</h2>

            {error && <div style={{ color: 'red', marginBottom: '15px' }}>⚠️ {error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                {/* Abastecer */}
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                    <h3>📥 Abastecer / Ingresar Libro</h3>
                    <form onSubmit={handleSupply}>
                        <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="ISBN" style={{ width: '100%', marginBottom: '8px', padding: '6px', boxSizing: 'border-box' }} disabled={isLoading} />
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del Libro" style={{ width: '100%', marginBottom: '8px', padding: '6px', boxSizing: 'border-box' }} disabled={isLoading} />
                        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio" style={{ width: '100%', marginBottom: '8px', padding: '6px', boxSizing: 'border-box' }} disabled={isLoading} />

                        <select value={selectedAuthorId} onChange={(e) => setSelectedAuthorId(e.target.value)} style={{ width: '100%', marginBottom: '8px', padding: '6px', boxSizing: 'border-box' }} disabled={isLoading}>
                            <option value="">-- Seleccionar Autor --</option>
                            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>

                        <input type="number" min="1" value={quantitySupply} onChange={(e) => setQuantitySupply(e.target.value)} style={{ width: '100%', marginBottom: '12px', padding: '6px', boxSizing: 'border-box' }} disabled={isLoading} />
                        <button type="submit" style={{ padding: '8px 12px', cursor: 'pointer' }} disabled={isLoading}>Abastecer Stock</button>
                    </form>
                </div>

                {/* Venta */}
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                    <h3>💸 Registrar Venta (Transacción)</h3>
                    <form onSubmit={handlePurchase}>
                        <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} style={{ width: '100%', marginBottom: '8px', padding: '6px', boxSizing: 'border-box' }} disabled={isLoading}>
                            <option value="">-- Seleccionar Cliente --</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>
                            ))}
                        </select>

                        <select value={selectedIsbn} onChange={(e) => setSelectedIsbn(e.target.value)} style={{ width: '100%', marginBottom: '8px', padding: '6px', boxSizing: 'border-box' }} disabled={isLoading}>
                            <option value="">-- Seleccionar Libro por ISBN --</option>
                            {books.map(b => <option key={b.isbn} value={b.isbn}>{b.title}</option>)}
                        </select>

                        <input type="number" min="1" value={quantitySale} onChange={(e) => setQuantitySale(e.target.value)} style={{ width: '100%', marginBottom: '12px', padding: '6px', boxSizing: 'border-box' }} disabled={isLoading} />
                        <button type="submit" style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }} disabled={isLoading}>Procesar Compra</button>
                    </form>
                </div>
            </div>

            {/* Tabla */}
            <h3>📊 Inventario General de Libros</h3>
            <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th>ISBN</th>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Autores</th>
                    <th>📥 Abastecido</th>
                    <th>💸 Vendido</th>
                    <th>📦 Stock</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {books.length === 0 ? (
                    <tr>
                        <td colSpan={8} style={{ textAlign: 'center' }}>No hay libros en el sistema.</td>
                    </tr>
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
                                    <button
                                        onClick={() => book.isbn && handleDelete(book.isbn, book.title)}
                                        style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                        disabled={isLoading}
                                    >
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