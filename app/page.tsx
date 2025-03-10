'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useNotesStore } from '../store/useNotesStore';

// Dynamically import components to avoid hydration issues
const NotesList = dynamic(() => import('../components/NotesList'), { ssr: false });
const NoteEditor = dynamic(() => import('../components/NoteEditor'), { ssr: false });

export default function Home() {
  const { notes, addNote } = useNotesStore();

  // Create a default note if there are no notes
  useEffect(() => {
    // if (notes.length === 0) {
    //   addNote();
    // }
  }, [notes.length, addNote]);


  return (
    <main className="flex flex-col  h-screen overflow-hidden divide-y divide-dark-surface-light">

      {/* Notes sidebar */}
      <div className="flex z-50 divide-x divide-dark-surface-light">
        <div className="w-80 ">
          <NotesList />
        </div>

        {/* Main editor area */}
        <div className="flex-1">
          <NoteEditor />
        </div>
      </div>
    </main>
  );
}