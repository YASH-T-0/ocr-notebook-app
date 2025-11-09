import React, { useState } from 'react';
import { Book } from '../types';
import { PlusIcon, TrashIcon, MoonIcon, SunIcon, BookOpenIcon } from './icons';

interface HeaderProps {
    onToggleTheme: () => void;
    theme: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ onToggleTheme, theme }) => (
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Notebooks</h1>
        <button
            onClick={onToggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    </div>
);


interface BookListProps {
    books: Book[];
    onSelectBook: (bookId: string) => void;
    onAddBook: (title: string) => void;
    onDeleteBook: (bookId: string) => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const BookList: React.FC<BookListProps> = ({ books, onSelectBook, onAddBook, onDeleteBook, theme, onToggleTheme }) => {
    const [newBookTitle, setNewBookTitle] = useState('');
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);

    const handleAddBook = (e: React.FormEvent) => {
        e.preventDefault();
        if (newBookTitle.trim()) {
            onAddBook(newBookTitle.trim());
            setNewBookTitle('');
            setIsAddFormVisible(false);
        }
    };

    const handleDelete = (e: React.MouseEvent, bookId: string) => {
        e.stopPropagation();
        onDeleteBook(bookId);
    };

    return (
        <div>
            <Header theme={theme} onToggleTheme={onToggleTheme} />
            <div className="flex justify-end items-center mb-6">
                 <button onClick={() => setIsAddFormVisible(prev => !prev)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <PlusIcon /> {isAddFormVisible ? 'Cancel' : 'New Book'}
                </button>
            </div>

            {isAddFormVisible && (
                <form onSubmit={handleAddBook} className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 animate-fadeInUp">
                    <input
                        type="text"
                        value={newBookTitle}
                        onChange={(e) => setNewBookTitle(e.target.value)}
                        placeholder="Enter new book title..."
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-3">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={!newBookTitle.trim()}>Add Book</button>
                    </div>
                </form>
            )}

            {books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {books.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((book, index) => (
                         <div 
                            key={book.id} 
                            onClick={() => onSelectBook(book.id)} 
                            className="group relative bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700/80 animate-fadeInUp"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 truncate pr-8">{book.title}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Created: {new Date(book.createdAt).toLocaleDateString()}</p>
                                </div>
                                <BookOpenIcon className="h-7 w-7 text-slate-300 dark:text-slate-600 transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                            </div>
                             <button onClick={(e) => handleDelete(e, book.id)} className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200">
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/80 animate-fadeInUp">
                    <BookOpenIcon className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">No books yet.</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Create your first book to start organizing notes.</p>
                </div>
            )}
        </div>
    );
};