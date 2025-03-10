/**
 * Helper functions for working with Mermaid diagrams in the notes app
 */

/**
 * Extract all mermaid diagrams from markdown content
 * @param content - The markdown content to parse
 * @returns Array of mermaid diagrams found in the content
 */
export function extractMermaidDiagrams(content: string): string[] {
  const mermaidRegex = /```mermaid([\s\S]*?)```/g;
  const diagrams: string[] = [];
  
  let match;
  while ((match = mermaidRegex.exec(content)) !== null) {
    diagrams.push(match[1].trim());
  }
  
  return diagrams;
}

/**
 * Extract mermaid diagrams with their positions in the text
 * @param content - The markdown content to parse
 * @returns Array of objects with diagram content and positions
 */
export function extractMermaidDiagramsWithPositions(content: string): { 
  diagram: string;
  start: number;
  end: number;
}[] {
  const mermaidRegex = /```mermaid([\s\S]*?)```/g;
  const results: { diagram: string; start: number; end: number; }[] = [];
  
  let match;
  while ((match = mermaidRegex.exec(content)) !== null) {
    results.push({
      diagram: match[1].trim(),
      start: match.index,
      end: match.index + match[0].length
    });
  }
  
  return results;
}

/**
 * Check if a note contains any mermaid diagrams
 * @param content - The markdown content to check
 * @returns True if the content contains at least one mermaid diagram
 */
export function hasMermaidDiagrams(content: string): boolean {
  return content.includes('```mermaid');
}

/**
 * Get the count of mermaid diagrams in the content
 * @param content - The markdown content to analyze
 * @returns The number of mermaid diagrams found
 */
export function getMermaidDiagramCount(content: string): number {
  return extractMermaidDiagrams(content).length;
}

/**
 * Insert a mermaid diagram template at the cursor position
 * @param content - The current content
 * @param template - The template to insert
 * @param cursorPosition - The position to insert the template
 * @returns The updated content with the template inserted
 */
export function insertMermaidAtCursor(
  content: string,
  template: string,
  cursorPosition: number
): { newContent: string; newCursorPosition: number } {
  const before = content.substring(0, cursorPosition);
  const after = content.substring(cursorPosition);
  
  // Add newlines before if needed
  const prefix = before.length > 0 && !before.endsWith('\n\n') 
    ? (before.endsWith('\n') ? '\n' : '\n\n') 
    : '';
  
  // Add newlines after if needed
  const suffix = after.length > 0 && !after.startsWith('\n') ? '\n\n' : '';
  
  const newContent = before + prefix + template + suffix + after;
  
  // Calculate where the cursor should be after insertion
  // Position it right after the inserted template
  const newCursorPosition = before.length + prefix.length + template.length;
  
  return { newContent, newCursorPosition };
}

/**
 * Replace a specific mermaid diagram in the content
 * @param content - The full markdown content
 * @param newDiagram - The new diagram content (without ```mermaid delimiters)
 * @param index - The index of the diagram to replace
 * @returns The updated content with the replaced diagram
 */
export function replaceMermaidDiagram(
  content: string,
  newDiagram: string,
  index: number
): string {
  const diagramsWithPos = extractMermaidDiagramsWithPositions(content);
  
  if (!diagramsWithPos[index]) {
    return content; // Diagram not found
  }
  
  const targetDiagram = diagramsWithPos[index];
  const wrappedNewDiagram = `\`\`\`mermaid\n${newDiagram}\n\`\`\``;
  
  // Replace the specific diagram
  return (
    content.substring(0, targetDiagram.start) +
    wrappedNewDiagram +
    content.substring(targetDiagram.end)
  );
}
