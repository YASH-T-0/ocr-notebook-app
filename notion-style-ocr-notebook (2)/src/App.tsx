import React, { useState, useEffect, useCallback } from 'react';
import { BookList } from './components/BookList';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { CameraView } from './components/CameraView';
import { ScanButton } from './components/ScanButton';
import { Spinner } from './components/Spinner';
import { Book, Note } from './types';
import { extractTextFromImage } from './services/geminiService';

type View = 'book-list' | 'note-list' | 'note-editor' | 'camera';

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        }
        return 'light';
    });
    const [books, setBooks] = useState<Book[]>(() => JSON.parse(localStorage.getItem('books') || '[]'));
    const [notes, setNotes] = useState<Note[]>(() => JSON.parse(localStorage.getItem('notes') || '[]'));
    const [view, setView] = useState<View>('book-list');
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [scannedText, setScannedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('books', JSON.stringify(books));
    }, [books]);

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const handleToggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleAddBook = (title: string): Book => {
        const newBook: Book = {
            id: crypto.randomUUID(),
            title,
            createdAt: new Date().toISOString(),
        };
        setBooks(prev => [...prev, newBook]);
        return newBook;
    };

    const handleDeleteBook = (bookId: string) => {
        if (window.confirm('Are you sure you want to delete this book and all its notes?')) {
            setBooks(prev => prev.filter(b => b.id !== bookId));
            setNotes(prev => prev.filter(n => n.bookId !== bookId));
            if (selectedBookId === bookId) {
                setView('book-list');
                setSelectedBookId(null);
            }
        }
    };

    const handleSaveNote = (content: string, bookId: string) => {
        if (selectedNoteId) { // Editing existing note
            setNotes(prev => prev.map(n => n.id === selectedNoteId ? { ...n, content, bookId, updatedAt: new Date().toISOString() } : n));
        } else { // Creating new note
            const newNote: Note = {
                id: crypto.randomUUID(),
                bookId,
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setNotes(prev => [...prev, newNote]);
        }
        setView('note-list');
        setSelectedBookId(bookId);
        setSelectedNoteId(null);
        setScannedText(null);
    };

    const handleDeleteNote = (noteId: string) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            setNotes(prev => prev.filter(n => n.id !== noteId));
            setView('note-list');
            setSelectedNoteId(null);
        }
    };

    const handleCaptureImage = useCallback(async (base64Image: string) => {
        setView('note-editor');
        setIsLoading(true);
        setLoadingMessage('Analyzing image...');
        try {
            const text = await extractTextFromImage(base64Image);
            setScannedText(text);
            setSelectedNoteId(null); // Ensure it's a new note
        } catch (error) {
            console.error(error);
            alert((error as Error).message);
            // Go back to the previous reasonable view
             if (selectedBookId) {
                setView('note-list');
            } else {
                setView('book-list');
            }
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [selectedBookId]);

    const navigateBack = useCallback(() => {
        switch (view) {
            case 'note-list':
                setView('book-list');
                setSelectedBookId(null);
                break;
            case 'note-editor':
                if (selectedBookId) {
                    setView('note-list');
                } else {
                    setView('book-list');
                }
                setSelectedNoteId(null);
                setScannedText(null);
                break;
            case 'camera':
                 if (selectedBookId) {
                    setView('note-list');
                } else {
                    setView('book-list');
                }
                break;
            default:
                setView('book-list');
                break;
        }
    }, [view, selectedBookId]);

    const renderContent = () => {
        switch (view) {
            case 'note-list':
                if (!selectedBookId) {
                    setView('book-list'); // Should not happen, but a safe fallback
                    return null;
                }
                const currentBook = books.find(b => b.id === selectedBookId);
                if (!currentBook) return null; // or show error
                return <NoteList
                    book={currentBook}
                    notes={notes.filter(n => n.bookId === selectedBookId)}
                    onSelectNote={(noteId) => { setSelectedNoteId(noteId); setView('note-editor'); }}
                    onBack={navigateBack}
                />;
            case 'note-editor':
                return <NoteEditor
                    note={notes.find(n => n.id === selectedNoteId)}
                    initialContent={scannedText}
                    books={books}
                    defaultBookId={selectedBookId}
                    onSave={handleSaveNote}
                    onDelete={handleDeleteNote}
                    onBack={navigateBack}
                    onAddBook={handleAddBook}
                />;
            case 'camera':
                return <CameraView onCapture={handleCaptureImage} onBack={navigateBack} />;
            case 'book-list':
            default:
                return <BookList
                    books={books}
                    onSelectBook={(bookId) => { setSelectedBookId(bookId); setView('note-list'); }}
                    onAddBook={handleAddBook}
                    onDeleteBook={handleDeleteBook}
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                />;
        }
    };

    return (
        <div className={`min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors font-sans`}>
            {isLoading && <Spinner message={loadingMessage} />}
            <main className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </main>
            {view !== 'camera' && view !== 'note-editor' && (
                <ScanButton onClick={() => setView('camera')} />
            )}
        </div>
    );
};

export default App;