import api from './api';
import type { Book } from '../types/index';

export const bookService = {

    getAll: async (): Promise<Book[]> => {
        const response = await api.get<Book[]>('/books');
        return response.data;
    },

    supply: async (bookData: any): Promise<Book> => {
        const response = await api.post<Book>('/books', bookData);
        return response.data;
    },

    purchase: async (purchaseData: { customerId: number; isbn: string; quantity: number }): Promise<any> => {
        const response = await api.post('/books/purchase', purchaseData);
        return response.data;
    },

    delete: async (isbn: string): Promise<void> => {
        const response = await api.delete(`/books/${isbn}`);
        return response.data;
    }

};