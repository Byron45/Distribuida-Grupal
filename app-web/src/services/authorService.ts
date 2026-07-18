
import api from './api';
import type { Author } from '../types/index';

export const authorService = {

    getAll: async (): Promise<Author[]> => {
        const response = await api.get<Author[]>('/authors');
        return response.data;
    },

    create: async (author: Author): Promise<Author> => {
        const response = await api.post<Author>('/authors', author);
        return response.data;
    }


};