import api from './api';
import type { Customer } from '../types/index';

export const customerService = {

    getAll: async (): Promise<Customer[]> => {
        const response = await api.get<Customer[]>('/customers');
        return response.data;
    },

    create: async (customer: Customer): Promise<Customer> => {
        const response = await api.post<Customer>('/customers', customer);
        return response.data;
    }
};