import React from 'react';
import MermaidRenderer from '../MermaidRenderer';
import { extractMermaidDiagrams } from '../../utils/mermaidHelpers';

interface MermaidGalleryProps {
  content: string;
  onClose: () => void;
  onEditDiagram: (diagram: string, index: number) => void;
}

const MermaidGallery: React.FC<MermaidGalleryProps> = ({
  content,
  onClose,
  onEditDiagram
}) => {
  const diagrams = extractMermaidDiagrams(content);
  
  if (diagrams.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-bg border border-dark-surface-light rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-dark-surface-light p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-dark-on-surface">
            Diagrams in Note ({diagrams.length})
          </h2>
          <button
            onClick={onClose}
            className="text-dark-on-surface hover:text-dark-primary"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Gallery */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diagrams.map((diagram, index) => (
              <div 
                key={index} 
                className="bg-dark-surface border border-dark-surface-light rounded-lg overflow-hidden hover:border-dark-primary transition-colors"
              >
                <div className="p-4">
                  <MermaidRenderer chart={diagram} />
                </div>
                <div className="bg-dark-surface-light p-3 flex justify-between items-center border-t border-dark-surface-light">
                  <span className="text-sm text-dark-on-surface">Diagram {index + 1}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditDiagram(diagram, index)}
                      className="text-xs bg-dark-primary text-dark-surface px-3 py-1 rounded hover:bg-dark-primary/90 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-dark-surface-light p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-dark-primary text-dark-surface hover:bg-dark-primary/90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MermaidGallery;