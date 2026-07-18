import { create } from 'zustand';
import { bookService } from '../services/bookService';
import { authorService } from '../services/authorService';
import { customerService } from '../services/customerService';
import type { Book, Author, Customer } from '../types/index';

interface AppState {
    books: Book[];
    authors: Author[];
    customers: Customer[];
    loading: boolean;
    error: string | null;

    loadAllData: () => Promise<void>;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    books: [],
    authors: [],
    customers: [],
    loading: false,
    error: null,

    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    loadAllData: async () => {
        set({ loading: true, error: null });
        try {
            // Como tus servicios ya retornan los arreglos directos (.data), los asignamos limpiamente
            const [booksData, authorsData, customersData] = await Promise.all([
                bookService.getAll(),
                authorService.getAll(),
                customerService.getAll(),
            ]);

            set({
                books: booksData || [],
                authors: authorsData || [],
                customers: customersData || [],
                loading: false,
            });
        } catch (err: any) {
            set({
                error: err.message || 'Error al sincronizar datos desde el Gateway',
                loading: false,
            });
        }
    },
}));