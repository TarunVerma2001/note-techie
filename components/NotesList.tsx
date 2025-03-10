import React from 'react';
import { useNotesStore, Note } from '../store/useNotesStore';
import { Button, buttonVariants } from './ui/button';

const NotesList: React.FC = () => {
  const { notes, activeNoteId, addNote, deleteNote, setActiveNote } = useNotesStore();

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get note preview (first line or first few characters)
  const getNotePreview = (content: string): string => {
    const firstLine = content.split('\n')[0].replace(/[#*_~`]/g, '').trim();
    return firstLine || 'Empty note';
  };

  return (
    <div className="h-screen flex flex-col divide-y divide-dark-surface-light  overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl text-secondary font-semibold">Note Techie</h1>
        <Button
          onClick={addNote}
          aria-label="Add new note"
          className='bg-foreground text-secondary hover:bg-foreground/50 cursor-pointer'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-cente flex flex-col gap-4 text-gray-400">
            <p>No notes yet</p>
            <Button
              className='bg-foreground text-secondary hover:bg-foreground/50 cursor-pointer'
              onClick={addNote}
            >
              Create your first note
            </Button>
          </div>
        ) : (
          <div className=''>
            {notes.map((note: Note) => (
              <div
                key={note.id}
                onClick={() => setActiveNote(note.id)}
                className={`cursor-pointer transition hover:bg-foreground border-b border-dark-surface-light ${activeNoteId === note.id ? 'bg-foreground' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium mb-1 text-secondary truncate pr-2">{note.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this note?')) {
                          deleteNote(note.id);
                        }
                      }}
                      className="text-muted-foreground hover:text-destructive cursor-pointer"
                      aria-label="Delete note"
                      style={{ cursor: 'pointer' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{getNotePreview(note.content)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(note.updatedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;