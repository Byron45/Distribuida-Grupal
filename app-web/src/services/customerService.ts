import {customersApi} from './api';
import type {Customer} from '../types/index';

export const customerService = {
    getAll: async (): Promise<Customer[]> => {
        const response = await customersApi.get<Customer[]>('/customers');
        return response.data;
    },

    getById: async (id: number): Promise<Customer> => {
        const response = await customersApi.get<Customer>(`/customers/${id}`);
        return response.data;
    },

    create: async (customer: Customer): Promise<Customer> => {
        const response = await customersApi.post<Customer>('/customers', customer);
        return response.data;
    },

    update: async (id: number, customer: Customer): Promise<Customer> => {
        const response = await customersApi.put<Customer>(`/customers/${id}`, customer);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await customersApi.delete(`/customers/${id}`);
    },
};