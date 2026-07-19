import {create} from 'zustand';
import {bookService} from '../services/bookService';
import {authorService} from '../services/authorService';
import {customerService} from '../services/customerService';
import type {Book, Author, Customer} from '../types/index';

interface AppState {
    books: Book[];
    authors: Author[];
    customers: Customer[];
    loading: boolean;
    error: string | null;

    loadAllData: () => Promise<void>;
    setError: (error: string | null) => void;
    clearError: () => void;

    // Authors
    saveAuthor: (author: Author) => Promise<void>;
    deleteAuthor: (id: number) => Promise<void>;

    // Books
    saveBook: (book: Partial<Book>, isEdit: boolean) => Promise<void>;
    deleteBook: (isbn: string) => Promise<void>;

    // Customers
    saveCustomer: (customer: Customer) => Promise<void>;
    deleteCustomer: (id: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    books: [],
    authors: [],
    customers: [],
    loading: false,
    error: null,

    setError: (error) => set({error}),
    clearError: () => set({error: null}),

    loadAllData: async () => {
        set({loading: true, error: null});
        try {
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

    // ----- Authors -----
    saveAuthor: async (author) => {
        set({error: null});
        try {
            if (author.id) {
                await authorService.update(author.id, author);
            } else {
                await authorService.create(author);
            }
            set({authors: await authorService.getAll()});
        } catch (err: any) {
            set({error: err.message || 'Error al guardar el autor'});
        }
    },
    deleteAuthor: async (id) => {
        set({error: null});
        try {
            await authorService.delete(id);
            set({authors: get().authors.filter((a) => a.id !== id)});
        } catch (err: any) {
            set({error: err.message || 'Error al eliminar el autor'});
        }
    },

    // ----- Books -----
    saveBook: async (book, isEdit) => {
        set({error: null});
        try {
            if (isEdit && book.isbn) {
                await bookService.update(book.isbn, book);
            } else {
                await bookService.create(book);
            }
            set({books: await bookService.getAll()});
        } catch (err: any) {
            set({error: err.message || 'Error al guardar el libro'});
        }
    },
    deleteBook: async (isbn) => {
        set({error: null});
        try {
            await bookService.delete(isbn);
            set({books: get().books.filter((b) => b.isbn !== isbn)});
        } catch (err: any) {
            set({error: err.message || 'Error al eliminar el libro'});
        }
    },

    // ----- Customers -----
    saveCustomer: async (customer) => {
        set({error: null});
        try {
            if (customer.id) {
                await customerService.update(customer.id, customer);
            } else {
                await customerService.create(customer);
            }
            set({customers: await customerService.getAll()});
        } catch (err: any) {
            set({error: err.message || 'Error al guardar el cliente'});
        }
    },
    deleteCustomer: async (id) => {
        set({error: null});
        try {
            await customerService.delete(id);
            set({customers: get().customers.filter((c) => c.id !== id)});
        } catch (err: any) {
            set({error: err.message || 'Error al eliminar el cliente'});
        }
    },
}));