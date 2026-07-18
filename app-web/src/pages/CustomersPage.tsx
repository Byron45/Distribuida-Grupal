import React, { useEffect, useState } from 'react';
import { customerService } from '../services/customerService';
import { useAppStore } from '../store/AppContext';

export const CustomersPage: React.FC = () => {
    const { state, loadAllData, setError } = useAppStore();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        if (state.customers.length === 0) {
            loadAllData();
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

        try {
            setLocalLoading(true);
            await customerService.create({ firstName, lastName, email });
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

    const isLoading = state.loading || localLoading;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Gestión de Clientes (Microservicio Spring Boot)</h2>

            {state.error && <div style={{ color: 'red', marginBottom: '15px' }}>⚠️ {state.error}</div>}

            <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                {/* Formulario */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxHeight: '340px' }}>
                    <h3>Registrar Nuevo Cliente</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                disabled={isLoading}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Apellido:</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                disabled={isLoading}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                disabled={isLoading}
                            />
                        </div>
                        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }} disabled={isLoading}>
                            {isLoading ? 'Registrando...' : 'Registrar Cliente'}
                        </button>
                    </form>
                </div>

                {/* Tabla */}
                <div style={{ flex: 2 }}>
                    <h3>Clientes Registrados</h3>
                    {state.loading && state.customers.length === 0 ? (
                        <p>Conectando con el Gateway...</p>
                    ) : (
                        <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ width: '15%' }}>ID</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                            </tr>
                            </thead>
                            <tbody>
                            {state.customers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center' }}>No hay clientes registrados.</td>
                                </tr>
                            ) : (
                                state.customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.firstName} {customer.lastName}</td>
                                        <td>{customer.email}</td>
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