import React, { useState, useRef, useEffect } from 'react';
import { getMermaidTemplateMenu } from '../utils/mermaidTemplates';

interface MermaidTemplateMenuProps {
  onSelectTemplate: (template: string) => void;
}

const MermaidTemplateMenu: React.FC<MermaidTemplateMenuProps> = ({ onSelectTemplate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const templates = getMermaidTemplateMenu();
  
  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 rounded font-medium bg-dark-secondary text-dark-surface hover:bg-dark-secondary/80 transition flex items-center"
        title="Add Mermaid Diagram"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
        </svg>
        Diagram
        <svg 
          className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-dark-surface z-10 py-1">
          <div className="py-1">
            {templates.map((item, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 text-sm text-dark-on-bg hover:bg-dark-surface-light hover:text-dark-on-surface transition-colors"
                onClick={() => {
                  onSelectTemplate(item.template);
                  setIsOpen(false);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MermaidTemplateMenu;