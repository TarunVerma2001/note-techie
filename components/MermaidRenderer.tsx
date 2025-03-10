import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Configure mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#BB86FC',
        primaryTextColor: '#FFFFFF',
        primaryBorderColor: '#BB86FC',
        lineColor: '#E1E1E1',
        secondaryColor: '#03DAC6',
        tertiaryColor: '#2D2D2D'
      }
    });
    
    // Render the diagram
    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = '';
      
      try {
        // Unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        
        // Create a temporary container
        const tempDiv = document.createElement('div');
        tempDiv.id = id;
        tempDiv.classList.add('mermaid');
        tempDiv.textContent = chart;
        
        // Append to our ref
        mermaidRef.current.appendChild(tempDiv);
        
        // Render
        mermaid.run({
          nodes: [tempDiv]
        });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<div class="p-4 text-dark-error bg-dark-surface-light rounded">
            Error rendering diagram. Please check your syntax.
          </div>`;
        }
      }
    }
  }, [chart]);
  
  return (
    <div className="relative my-4 overflow-hidden bg-dark-surface rounded border border-dark-surface-light">
      <div className="absolute top-0 right-0 text-xs bg-dark-surface-light text-dark-on-surface px-2 py-1 rounded-bl">
        Mermaid Diagram
      </div>
      <div 
        ref={mermaidRef} 
        className="flex justify-center overflow-auto max-w-full p-6 pt-8"
      />
      <div className="flex justify-end p-2 bg-dark-surface-light">
        <button
          onClick={() => {
            // Create a new window with just the diagram
            const newWindow = window.open('', '_blank');
            if (newWindow) {
              newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Mermaid Diagram</title>
                  <style>
                    body { margin: 0; padding: 20px; background: #121212; display: flex; justify-content: center; }
                    .mermaid { background: white; padding: 20px; border-radius: 8px; }
                  </style>
                  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
                  <script>
                    document.addEventListener('DOMContentLoaded', function() {
                      mermaid.initialize({ startOnLoad: true });
                    });
                  </script>
                </head>
                <body>
                  <div class="mermaid">${chart}</div>
                </body>
                </html>
              `);
              newWindow.document.close();
            }
          }}
          className="text-xs text-dark-primary hover:underline"
        >
          Open in new tab
        </button>
      </div>
    </div>
  );
};

export default MermaidRenderer;