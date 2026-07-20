import React, {useEffect, useState} from 'react';
import {useAppStore} from '../store/useAppStore';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {ErrorMessage} from '../components/ErrorMessage';
import type {Customer} from '../types/index';
import styles from './CustomersPage.module.css';

const emptyForm: Customer = { firstName: '', lastName: '', email: '', phone: '', address: '' };

export const CustomersPage: React.FC = () => {
    const {customers, loading, error, loadAllData, saveCustomer, deleteCustomer} = useAppStore();
    const [form, setForm] = useState<Customer>(emptyForm);
    const [editId, setEditId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { loadAllData(); }, []);

    const resetForm = () => { setForm(emptyForm); setEditId(null); };
    const handleChange = (field: keyof Customer, value: string) => { setForm((prev) => ({...prev, [field]: value})); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) return;
        setSubmitting(true);
        const customer: Customer = editId ? {...form, id: editId} : form;
        await saveCustomer(customer);
        setSubmitting(false);
        resetForm();
    };

    const handleEdit = (customer: Customer) => {
        setEditId(customer.id ?? null);
        setForm({ firstName: customer.firstName, lastName: customer.lastName, email: customer.email, phone: customer.phone ?? '', address: customer.address ?? '' });
    };

    const handleDelete = async (id: number, name: string) => {
        const confirmed = window.confirm(`¿Está seguro de eliminar al cliente "${name}"?`);
        if (!confirmed) return;
        setSubmitting(true);
        await deleteCustomer(id);
        setSubmitting(false);
    };

    const isBusy = loading || submitting;

    if (loading && customers.length === 0) return <LoadingSpinner message="Conectando con el microservicio de Clientes"/>;

    return (
        <div className={styles.container}>
            <h2>Gestión de Clientes (Microservicio Spring Boot)</h2>
            {error && <ErrorMessage message={error}/>}
            <div className={styles.contentWrapper}>
                <div className={styles.formBox}>
                    <h3>{editId ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nombre:</label>
                            <input className={styles.inputField} type="text" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} disabled={isBusy}/>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Apellido:</label>
                            <input className={styles.inputField} type="text" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} disabled={isBusy}/>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email:</label>
                            <input className={styles.inputField} type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} disabled={isBusy}/>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Teléfono:</label>
                            <input className={styles.inputField} type="text" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={isBusy}/>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Dirección:</label>
                            <input className={styles.inputField} type="text" value={form.address} onChange={(e) => handleChange('address', e.target.value)} disabled={isBusy}/>
                        </div>
                        <button className={styles.submitBtn} type="submit" disabled={isBusy}>{submitting ? 'Guardando...' : editId ? 'Actualizar' : 'Registrar Cliente'}</button>
                        {editId && <button type="button" className={styles.cancelBtn} onClick={resetForm} disabled={isBusy}>Cancelar</button>}
                    </form>
                </div>

                <div className={styles.tableContainer}>
                    <h3>Clientes Registrados</h3>
                    <table className={styles.table}>
                        <thead>
                        <tr className={styles.tableHeader}>
                            <th style={{width: '6%'}}>ID</th>
                            <th>Nombre Completo</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th style={{width: '20%', textAlign: 'center'}}>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {customers.length === 0 ? <tr><td colSpan={5} style={{textAlign: 'center'}}>No hay clientes registrados.</td></tr> :
                            customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>{customer.firstName} {customer.lastName}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td className={styles.actionCell}>
                                        <button className={styles.editBtn} onClick={() => handleEdit(customer)} disabled={isBusy}>Editar</button>
                                        <button className={styles.deleteBtn} onClick={() => customer.id !== undefined && handleDelete(customer.id, `${customer.firstName} ${customer.lastName}`)} disabled={isBusy}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};