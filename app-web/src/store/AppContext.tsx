import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { authorService } from '../services/authorService';
import { customerService } from '../services/customerService';
import { bookService } from '../services/bookService';
import type { Book, Author, Customer } from '../types/index';

interface AppState {
    books: Book[];
    authors: Author[];
    customers: Customer[];
    loading: boolean;
    error: string | null;
}

interface AppContextType {
    state: AppState;
    loadAllData: () => Promise<void>;
    setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AppState>({
        books: [],
        authors: [],
        customers: [],
        loading: false,
        error: null,
    });

    const loadAllData = async () => {
        try {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            const [booksData, authorsData, customersData] = await Promise.all([
                bookService.getAll(),
                authorService.getAll(),
                customerService.getAll(),
            ]);

            setState({
                books: booksData,
                authors: authorsData,
                customers: customersData,
                loading: false,
                error: null,
            });
        } catch (err: any) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err.message || 'Error al sincronizar el estado global',
            }));
        }
    };

    const setError = (error: string | null) => {
        setState((prev) => ({ ...prev, error }));
    };

    return (
        <AppContext.Provider value={{ state, loadAllData, setError }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppStore = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppStore debe utilizarse dentro de un AppProvider');
    }
    return context;
};