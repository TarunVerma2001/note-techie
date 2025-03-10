import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useNotesStore } from '../store/useNotesStore';
import MermaidRenderer from './MermaidRenderer';
import MermaidTemplateMenu from './MermaidTemplateMenu';
import { hasMermaidDiagrams, getMermaidDiagramCount } from '../utils/mermaidHelpers';
// @ts-ignore
import html2pdf from 'html2pdf.js';

import { Button } from './ui/button';

const NoteEditor: React.FC = () => {
  const { notes, activeNoteId, updateNote } = useNotesStore();
  const [isPreview, setIsPreview] = useState(false);
  const activeNote = notes.find(note => note.id === activeNoteId);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );

  const downloadPDF = () => {
    const element = document.getElementById('pdf-content'); // Get the content to be converted
    if (element) {
      html2pdf()
        .from(element)
        .save('note.pdf'); // Name of the downloaded file
    }
  };

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [diagramCount, setDiagramCount] = useState(0);

  // Update local state when active note changes
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setDiagramCount(getMermaidDiagramCount(activeNote.content));
    } else {
      setTitle('');
      setContent('');
      setDiagramCount(0);
    }
  }, [activeNote]);

  // Update note in store when title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (activeNoteId) {
      updateNote(activeNoteId, { title: newTitle });
    }
  };

  // Update note in store when content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setDiagramCount(getMermaidDiagramCount(newContent));
    if (activeNoteId) {
      updateNote(activeNoteId, { content: newContent });
    }
  };

  // Add a mermaid template to the content
  const addMermaidTemplate = (template: string) => {
    // Get cursor position
    const cursorPos = editorRef.current?.selectionStart || content.length;

    // Insert at cursor position or at the end
    const before = content.substring(0, cursorPos);
    const after = content.substring(cursorPos);

    // Add appropriate spacing
    const prefix = before.length > 0 && !before.endsWith('\n\n')
      ? (before.endsWith('\n') ? '\n' : '\n\n')
      : '';
    const suffix = after.length > 0 && !after.startsWith('\n') ? '\n\n' : '';

    const newContent = before + prefix + template + suffix + after;

    // Update content
    setContent(newContent);
    setDiagramCount(getMermaidDiagramCount(newContent));
    if (activeNoteId) {
      updateNote(activeNoteId, { content: newContent });
    }

    // After update, focus back on editor
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        // Set cursor position after inserted template
        const newPosition = cursorPos + prefix.length + template.length;
        editorRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 50);
  };

  if (!activeNote) {
    return (
      <div className="h-screen flex-1 flex items-center justify-center bg-dark-bg p-6 text-center text-gray-400">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-dark-surface-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl mb-2">No Note Selected</h2>
          <p>Select a note from the sidebar or create a new one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex-1 flex flex-col divide-y divide-dark-surface-light  overflow-hidden">
      {/* Editor toolbar */}
      <div className="p-4 flex justify-between items-center">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="bg-transparent text-secondary text-xl font-semibold  focus:outline-none  w-full"
        />
        <div className="flex space-x-2">
          <MermaidTemplateMenu onSelectTemplate={addMermaidTemplate} />
          {hasMermaidDiagrams(content) && (
            <span
              className=" flex items-center text-sm px-2"
              title={`This note contains ${diagramCount} diagram${diagramCount !== 1 ? 's' : ''}`}
            >

              <div className="flex text-muted-foreground space-x-2">
                <div>
                  {diagramCount}
                </div>
                <div>
                  Diagram{diagramCount !== 1 ? 's' : ''}
                </div>
              </div>
            </span>
          )}
          <Button
            onClick={() => setIsPreview(!isPreview)}
            variant={"default"}
            className='bg-foreground text-secondary hover:bg-foreground/50 cursor-pointer' >
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            onClick={downloadPDF} // Add the download PDF button
            variant={"default"}
            className='bg-foreground text-secondary hover:bg-foreground/50 cursor-pointer'>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Editor or preview */}
      <div className="flex-1 overflow-y-auto">
        {isPreview ? (
          <div id="pdf-content" className="p-6 bg-foreground text-secondary markdown-preview overflow-y-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // @ts-ignore
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');

                  console.log("match: ", match);

                  // Handle Mermaid code blocks
                  if (!inline && match && match[1] === 'mermaid') {
                    return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />;
                  }

                  // Handle other code blocks
                  return !inline && match ? (
                    <SyntaxHighlighter
                      // @ts-ignore
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={editorRef}
            value={content}
            onChange={handleContentChange}
            typeof='markdown'
            placeholder="Start writing your note in markdown..."
            className="w-full  h-full p-6 bg-dark-bg text-dark-on-bg resize-none focus:outline-none"
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-t-dark-surface-light text-xs text-gray-500 flex justify-between">
        <span>Last updated: {new Date(activeNote.updatedAt).toLocaleString()}</span>
        <span>
          {content.length} characters &bull; {content.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div >
  );
};

export default NoteEditor;