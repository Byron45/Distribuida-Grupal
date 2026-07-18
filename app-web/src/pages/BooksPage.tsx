import React, { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import { authorService } from '../services/authorService';
import { customerService } from '../services/customerService';
import type { Book, Author, Customer } from '../types/index';

export const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [isbn, setIsbn] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [selectedAuthorId, setSelectedAuthorId] = useState('');
    const [quantitySupply, setQuantitySupply] = useState('1');

    const [selectedIsbn, setSelectedIsbn] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [quantitySale, setQuantitySale] = useState('1');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [booksData, authorsData, customersData] = await Promise.all([
                bookService.getAll(),
                authorService.getAll(),
                customerService.getAll()
            ]);
            setBooks(booksData);
            setAuthors(authorsData);
            setCustomers(customersData);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al sincronizar datos distribuidos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    const handleSupply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isbn.trim() || !title.trim() || !price || !selectedAuthorId) return;

        try {
            setLoading(true);
            const payload = {
                isbn,
                title,
                price: parseFloat(price),
                authorIds: [parseInt(selectedAuthorId)],
                quantity: parseInt(quantitySupply)
            };
            await bookService.supply(payload);
            setIsbn('');
            setTitle('');
            setPrice('');
            await loadAllData();
        } catch (err: any) {
            setError(err.message || 'Error al abastecer inventario');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedIsbn || !selectedCustomerId || !quantitySale) return;

        try {
            setLoading(true);
            await bookService.purchase({
                customerId: parseInt(selectedCustomerId),
                isbn: selectedIsbn,
                quantity: parseInt(quantitySale)
            });
            await loadAllData();
        } catch (err: any) {
            setError(err.message || 'Error al procesar la venta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Panel de Inventario y Transacciones (Quarkus / Spring / Traefik)</h2>

            {error && <div style={{ color: 'red', marginBottom: '15px' }}>⚠️ {error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                {/* Formulario Abastecer */}
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                    <h3>📥 Abastecer / Ingresar Libro</h3>
                    <form onSubmit={handleSupply}>
                        <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="ISBN" style={{ width: '100%', marginBottom: '8px', padding: '6px' }} />
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del Libro" style={{ width: '100%', marginBottom: '8px', padding: '6px' }} />
                        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio" style={{ width: '100%', marginBottom: '8px', padding: '6px' }} />

                        <select value={selectedAuthorId} onChange={(e) => setSelectedAuthorId(e.target.value)} style={{ width: '100%', marginBottom: '8px', padding: '6px' }}>
                            <option value="">-- Seleccionar Autor --</option>
                            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>

                        <input type="number" min="1" value={quantitySupply} onChange={(e) => setQuantitySupply(e.target.value)} placeholder="Cantidad" style={{ width: '100%', marginBottom: '12px', padding: '6px' }} />
                        <button type="submit" style={{ padding: '8px 12px', cursor: 'pointer' }} disabled={loading}>Abastecer Stock</button>
                    </form>
                </div>

                {/* Formulario Venta */}
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                    <h3>💸 Registrar Venta (Transacción)</h3>
                    <form onSubmit={handlePurchase}>
                        <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} style={{ width: '100%', marginBottom: '8px', padding: '6px' }}>
                            <option value="">-- Seleccionar Cliente --</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.firstName} {c.lastName} ({c.email})
                                </option>
                            ))}
                        </select>

                        <select value={selectedIsbn} onChange={(e) => setSelectedIsbn(e.target.value)} style={{ width: '100%', marginBottom: '8px', padding: '6px' }}>
                            <option value="">-- Seleccionar Libro por ISBN --</option>
                            {books.map(b => <option key={b.isbn} value={b.isbn}>{b.title} (ISBN: {b.isbn})</option>)}
                        </select>

                        <input type="number" min="1" value={quantitySale} onChange={(e) => setQuantitySale(e.target.value)} placeholder="Cantidad a Vender" style={{ width: '100%', marginBottom: '12px', padding: '6px' }} />
                        <button type="submit" style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }} disabled={loading}>Procesar Compra</button>
                    </form>
                </div>
            </div>

            {/* Tabla General de Inventario */}
            <h3>📊 Inventario General de Libros</h3>
            <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th>ISBN</th>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Autores</th>
                    <th style={{ backgroundColor: '#e6f4ea' }}>📥 Abastecido (Supplied)</th>
                    <th style={{ backgroundColor: '#fce8e6' }}>💸 Vendido (Sold)</th>
                    <th style={{ backgroundColor: '#e8f0fe' }}>📦 Stock Disponible</th>
                </tr>
                </thead>
                <tbody>
                {books.length === 0 ? (
                    <tr>
                        <td colSpan={7} style={{ textAlign: 'center' }}>No hay libros registrados en el sistema distribuido.</td>
                    </tr>
                ) : (
                    books.map((book) => {
                        const stock = book.inventorySupplied - book.inventorySold;
                        return (
                            <tr key={book.isbn}>
                                <td><strong>{book.isbn}</strong></td>
                                <td>{book.title}</td>
                                <td>${book.price.toFixed(2)}</td>
                                <td>{book.authors && book.authors.length > 0 ? book.authors.join(', ') : 'Sin autor mapeado'}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{book.inventorySupplied}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{book.inventorySold}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold', color: stock < 3 ? 'red' : 'green' }}>{stock}</td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
};