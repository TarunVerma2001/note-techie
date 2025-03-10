import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
  addNote: () => void;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,
      
      addNote: () => {
        const newNote: Note = {
          id: uuidv4(),
          title: 'Untitled Note',
          content: '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id,
        }));
      },
      
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) => 
            note.id === id 
              ? { ...note, ...updates, updatedAt: Date.now() } 
              : note
          ),
        }));
      },
      
      deleteNote: (id) => {
        const { notes, activeNoteId } = get();
        const newNotes = notes.filter((note) => note.id !== id);
        
        set(() => ({
          notes: newNotes,
          activeNoteId: 
            activeNoteId === id 
              ? newNotes.length > 0 
                ? newNotes[0].id 
                : null 
              : activeNoteId,
        }));
      },
      
      setActiveNote: (id) => {
        set(() => ({ activeNoteId: id }));
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);