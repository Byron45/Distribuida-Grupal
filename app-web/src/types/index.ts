
export interface Author {
    id?: number;
    name: string;
}

export interface BookAuthor {
    id?: number;
    isbn: string;
    authorId: number;
}

export interface Book {
    isbn: string;
    title: string;
    price: number;
    authors: string[];
    inventorySold: number;
    inventorySupplied: number;
}

export interface Customer {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
}