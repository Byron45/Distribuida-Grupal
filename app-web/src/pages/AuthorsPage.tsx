import React, { useEffect, useState } from 'react';
import { authorService } from '../services/authorService';
import { useAppStore } from '../store/AppContext';

export const AuthorsPage: React.FC = () => {
    const { state, loadAllData, setError } = useAppStore();
    const [name, setName] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {

        if (state.authors.length === 0) {
            loadAllData();
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setLocalLoading(true);
            await authorService.create({ name });
            setName('');
            await loadAllData();
        } catch (err: any) {
            setError(err.message || 'Error al crear el autor');
        } finally {
            setLocalLoading(false);
        }
    };

    const isLoading = state.loading || localLoading;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Gestión de Autores (Microservicio Quarkus)</h2>

            {state.error && <div style={{ color: 'red', marginBottom: '15px' }}>⚠️ {state.error}</div>}

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
                    {state.loading && state.authors.length === 0 ? (
                        <p>Conectando con el Gateway...</p>
                    ) : (
                        <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ width: '20%' }}>ID</th>
                                <th>Nombre</th>
                            </tr>
                            </thead>
                            <tbody>
                            {state.authors.length === 0 ? (
                                <tr>
                                    <td colSpan={2} style={{ textAlign: 'center' }}>No hay autores registrados.</td>
                                </tr>
                            ) : (
                                state.authors.map((author) => (
                                    <tr key={author.id}>
                                        <td>{author.id}</td>
                                        <td>{author.name}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};