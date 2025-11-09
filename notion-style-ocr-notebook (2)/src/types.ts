
export interface Book {
    id: string;
    title: string;
    createdAt: string;
}

export interface Note {
    id: string;
    bookId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}