export interface Author {
    id?: number;
    name: string;
}

export interface BookAuthor {
    id: number;
    name: string;
}

export interface Book {
    isbn: string;
    title: string;
    price: number;
    version?: number;
    authors: BookAuthor[];
    inventorySold: number;
    inventorySupplied: number;
}

export interface Customer {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    createdAt?: string;
}