import React, { useEffect, useState } from 'react';
import { authorService } from '../services/authorService';
import { useAppStore } from '../store/useAppStore';

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
        return (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#666' }}>
                <div style={{ marginBottom: '15px', fontSize: '32px' }}>⏳</div>
                <h3 style={{ margin: '0 0 8px 0' }}>Sincronizando Base de Datos...</h3>
                <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>Conectando con el catálogo de Autores (Quarkus)</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Gestión de Autores (Microservicio Quarkus)</h2>

            {error && <div style={{ color: 'red', marginBottom: '15px' }}>⚠️ {error}</div>}

            <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                {/* Formulario */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxHeight: '200px' }}>
                    <h3>Registrar Nuevo Autor</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Nombre del Autor:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej. Gabriel García Márquez"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                disabled={isLoading}
                            />
                        </div>
                        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }} disabled={isLoading}>
                            {isLoading ? 'Guardando...' : 'Guardar Autor'}
                        </button>
                    </form>
                </div>

                {/* Tabla */}
                <div style={{ flex: 2 }}>
                    <h3>Autores Registrados</h3>
                    <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ width: '20%' }}>ID</th>
                            <th>Nombre</th>
                            <th style={{ width: '25%', textAlign: 'center' }}>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {authors.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center' }}>No hay autores registrados.</td>
                            </tr>
                        ) : (
                            authors.map((author) => (
                                <tr key={author.id}>
                                    <td>{author.id}</td>
                                    <td>{author.name}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => author.id !== undefined && handleDelete(author.id, author.name)}
                                            style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
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