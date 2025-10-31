import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesContextType {
  notes: Note[];
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (user) {
      const allNotes = JSON.parse(localStorage.getItem('notes') || '[]');
      const userNotes = allNotes.filter((note: Note) => note.userId === user.id);
      setNotes(userNotes);
    } else {
      setNotes([]);
    }
  }, [user]);

  const saveNotes = (updatedNotes: Note[]) => {
    const allNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    const otherUsersNotes = allNotes.filter((note: Note) => note.userId !== user?.id);
    const newAllNotes = [...otherUsersNotes, ...updatedNotes];
    localStorage.setItem('notes', JSON.stringify(newAllNotes));
    setNotes(updatedNotes);
  };

  const addNote = (title: string, content: string) => {
    if (!user) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
  };

  const updateNote = (id: string, title: string, content: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, title, content, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };

  const getNote = (id: string) => {
    return notes.find(note => note.id === id);
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, getNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
