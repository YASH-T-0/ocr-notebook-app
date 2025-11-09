import React, { useState, useEffect } from 'react';
import { Book, Note } from '../types';
import { BackArrowIcon, TrashIcon, CheckIcon, EditIcon } from './icons';

interface NoteEditorProps {
    note: Note | undefined;
    initialContent: string | null;
    books: Book[];
    defaultBookId: string | null;
    onSave: (content: string, bookId: string) => void;
    onDelete: (noteId: string) => void;
    onBack: () => void;
    onAddBook: (title: string) => Book;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, initialContent, books, defaultBookId, onSave, onDelete, onBack, onAddBook }) => {
    const [content, setContent] = useState('');
    const [selectedBookId, setSelectedBookId] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [showNewBookInput, setShowNewBookInput] = useState(false);
    const [newBookTitle, setNewBookTitle] = useState('');

    useEffect(() => {
        if (note) {
            setContent(note.content);
            setSelectedBookId(note.bookId);
            setIsEditing(false);
        } else {
            setContent(initialContent || '');
            setSelectedBookId(defaultBookId || (books.length > 0 ? books[0].id : ''));
            setIsEditing(true); // Always in edit mode for new notes
        }
    }, [note, initialContent, defaultBookId, books]);

    const handleSave = () => {
        if (!selectedBookId) {
            alert("Please select or create a book to save the note.");
            return;
        }
        if (content.trim()) {
            onSave(content, selectedBookId);
        } else {
            alert("Note content cannot be empty.");
        }
    };
    
    const handleAddNewBook = () => {
        if (newBookTitle.trim()) {
            const newBook = onAddBook(newBookTitle.trim());
            setSelectedBookId(newBook.id);
            setNewBookTitle('');
            setShowNewBookInput(false);
        }
    };

    const isNewNote = !note;

    return (
        <div className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/80 animate-fadeInUp">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <BackArrowIcon />
                    </button>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{isNewNote ? 'New Note' : 'Note'}</h2>
                </div>
                <div className="flex items-center gap-2">
                    {!isNewNote && (
                        <>
                            {isEditing ? (
                                <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <CheckIcon /> Save
                                </button>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                                    <EditIcon /> Edit
                                </button>
                            )}
                            <button onClick={() => onDelete(note.id)} className="p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                <TrashIcon />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="book-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Save to Book:</label>
                {!showNewBookInput ? (
                    <div className="flex items-center gap-2">
                        <select
                            id="book-select"
                            value={selectedBookId}
                            onChange={(e) => setSelectedBookId(e.target.value)}
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 disabled:opacity-50 dark:disabled:bg-slate-700/60 disabled:cursor-not-allowed"
                            disabled={(!isEditing && !isNewNote) || books.length === 0}
                        >
                            {books.length === 0 && <option>Create a book first</option>}
                            {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                        </select>
                        {(isEditing || isNewNote) && (
                            <button onClick={() => setShowNewBookInput(true)} className="px-4 py-2 text-sm bg-slate-600 text-white rounded-md whitespace-nowrap hover:bg-slate-700">New</button>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newBookTitle}
                            onChange={(e) => setNewBookTitle(e.target.value)}
                            placeholder="New book title"
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            autoFocus
                        />
                        <button onClick={handleAddNewBook} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add</button>
                        <button onClick={() => setShowNewBookInput(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">Cancel</button>
                    </div>
                )}
            </div>

            {isEditing || isNewNote ? (
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-96 p-4 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="Your scanned text will appear here..."
                />
            ) : (
                <div className="w-full h-96 p-4 bg-slate-100/70 dark:bg-slate-900/50 rounded-md whitespace-pre-wrap overflow-y-auto leading-relaxed text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80">
                    {content}
                </div>
            )}

            {isNewNote && (
                <div className="mt-6 flex justify-end">
                    <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm">
                        Save Note
                    </button>
                </div>
            )}
        </div>
    );
};