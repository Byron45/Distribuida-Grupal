import {booksApi} from './api';
import type {Book} from '../types/index';

export const bookService = {
    getAll: async (): Promise<Book[]> => {
        const response = await booksApi.get<Book[]>('/books');
        return response.data;
    },

    getByIsbn: async (isbn: string): Promise<Book> => {
        const response = await booksApi.get<Book>(`/books/${isbn}`);
        return response.data;
    },

    create: async (book: Partial<Book>): Promise<Book> => {
        const response = await booksApi.post<Book>('/books', book);
        return response.data;
    },

    update: async (isbn: string, book: Partial<Book>): Promise<Book> => {
        const response = await booksApi.put<Book>(`/books/${isbn}`, book);
        return response.data;
    },

    delete: async (isbn: string): Promise<void> => {
        await booksApi.delete(`/books/${isbn}`);
    },
};