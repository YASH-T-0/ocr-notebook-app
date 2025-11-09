import React from 'react';
import { Book, Note } from '../types';
import { BackArrowIcon, DocumentTextIcon } from './icons';

interface NoteListProps {
    book: Book;
    notes: Note[];
    onSelectNote: (noteId: string) => void;
    onBack: () => void;
}

export const NoteList: React.FC<NoteListProps> = ({ book, notes, onSelectNote, onBack }) => {
    
    const getNoteSnippet = (content: string) => {
        const firstLine = content.split('\n')[0].trim();
        if (!firstLine) return "Empty Note";
        return firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
    };

    return (
        <div className="animate-fadeInUp">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <BackArrowIcon />
                </button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 truncate">{book.title}</h1>
            </div>

            {notes.length > 0 ? (
                <div className="space-y-4">
                    {notes.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((note, index) => (
                        <div 
                            key={note.id} 
                            onClick={() => onSelectNote(note.id)} 
                            className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 animate-fadeInUp"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <p className="text-slate-800 dark:text-slate-200 font-medium truncate">{getNoteSnippet(note.content)}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Updated: {new Date(note.updatedAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/80">
                    <DocumentTextIcon className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">This book is empty.</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Tap the scan button to add your first note.</p>
                </div>
            )}
        </div>
    );
};