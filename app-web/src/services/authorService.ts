import {authorsApi} from './api';
import type {Author} from '../types/index';

export const authorService = {
    getAll: async (): Promise<Author[]> => {
        const response = await authorsApi.get<Author[]>('/authors');
        return response.data;
    },

    getById: async (id: number): Promise<Author> => {
        const response = await authorsApi.get<Author>(`/authors/${id}`);
        return response.data;
    },

    create: async (author: Author): Promise<Author> => {
        const response = await authorsApi.post<Author>('/authors', author);
        return response.data;
    },

    update: async (id: number, author: Author): Promise<Author> => {
        const response = await authorsApi.put<Author>(`/authors/${id}`, author);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await authorsApi.delete(`/authors/${id}`);
    },
};