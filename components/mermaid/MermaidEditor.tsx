import React, { useState, useEffect } from 'react';
import MermaidRenderer from '../MermaidRenderer';
import { getMermaidTemplateMenu } from '../../utils/mermaidTemplates';

interface MermaidEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  onClose: () => void;
}

const MermaidEditor: React.FC<MermaidEditorProps> = ({ 
  initialContent = '', 
  onSave, 
  onClose 
}) => {
  const [content, setContent] = useState(initialContent.trim());
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const templateMenu = getMermaidTemplateMenu();
  
  // Initialize with cleaned content (remove markdown code block delimiters)
  useEffect(() => {
    // Remove ```mermaid and ``` if present
    let cleanContent = initialContent.replace(/```mermaid\n?/, '').replace(/```$/, '');
    setContent(cleanContent.trim());
  }, [initialContent]);
  
  // Handle template selection
  const handleTemplateSelect = (template: string) => {
    // Extract the content without the markdown code block delimiters
    const diagramContent = template
      .replace(/```mermaid\n?/, '')
      .replace(/```$/, '')
      .trim();
    
    setContent(diagramContent);
  };
  
  // Validate the content
  const validateMermaid = async (content: string) => {
    try {
      // We'll use the Mermaid renderer's error handling for validation
      setIsValid(true);
      setErrorMessage('');
      return true;
    } catch (error) {
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : 'Invalid diagram syntax');
      return false;
    }
  };
  
  // Save the content
  const handleSave = async () => {
    const isValidDiagram = await validateMermaid(content);
    if (isValidDiagram) {
      // Wrap with markdown code block syntax
      onSave(`\`\`\`mermaid\n${content}\n\`\`\``);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-bg border border-dark-surface-light rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-dark-surface-light p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-dark-on-surface">Mermaid Diagram Editor</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                className="bg-dark-surface text-dark-on-surface py-1 px-3 rounded text-sm border border-dark-surface-light"
                onChange={(e) => {
                  const selectedTemplate = templateMenu.find(t => t.name === e.target.value);
                  if (selectedTemplate) {
                    handleTemplateSelect(selectedTemplate.template);
                  }
                }}
                value=""
              >
                <option value="" disabled>Choose template</option>
                {templateMenu.map((template, index) => (
                  <option key={index} value={template.name}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            
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
        </div>
        
        {/* Editor body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Code editor */}
          <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-dark-surface-light">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-dark-on-surface">Diagram Code</h3>
              <div className="flex space-x-2">
                <a
                  href="https://mermaid.js.org/syntax/flowchart.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-dark-primary hover:underline"
                >
                  Syntax Help
                </a>
              </div>
            </div>
            <textarea
              className="w-full h-[calc(100%-2rem)] bg-dark-surface rounded p-3 text-dark-on-surface font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-dark-primary"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your Mermaid diagram code here..."
              autoFocus
            />
          </div>
          
          {/* Preview */}
          <div className="w-full md:w-1/2 p-4 overflow-auto">
            <h3 className="text-sm font-medium text-dark-on-surface mb-2">Preview</h3>
            <div className="bg-dark-surface rounded overflow-auto p-3 h-[calc(100%-2rem)]">
              {content ? (
                <MermaidRenderer chart={content} />
              ) : (
                <div className="flex items-center justify-center h-full text-dark-on-surface-light text-sm">
                  Enter diagram code to see preview
                </div>
              )}
              {!isValid && (
                <div className="mt-4 p-3 bg-dark-error/20 border border-dark-error text-dark-error rounded text-sm">
                  {errorMessage || 'Syntax error in diagram. Please check your code.'}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-dark-surface-light p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-dark-on-surface bg-dark-surface hover:bg-dark-surface-light transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-dark-primary text-dark-surface hover:bg-dark-primary/90 transition"
          >
            Save Diagram
          </button>
        </div>
      </div>
    </div>
  );
};

export default MermaidEditor;