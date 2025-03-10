/**
 * Templates for common Mermaid diagrams to help users get started
 */

export const mermaidTemplates = {
  flowchart: `\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E
\`\`\``,

  sequence: `\`\`\`mermaid
sequenceDiagram
    participant User
    participant System
    User->>System: Action
    System->>System: Process
    System-->>User: Response
\`\`\``,

  classDiagram: `\`\`\`mermaid
classDiagram
    class Animal {
        +name: string
        +age: int
        +makeSound()
    }
    class Dog {
        +breed: string
        +bark()
    }
    Animal <|-- Dog
\`\`\``,

  stateDiagram: `\`\`\`mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: start
    Processing --> Complete: finish
    Processing --> Error: fail
    Complete --> [*]
    Error --> Idle: retry
\`\`\``,

  entityRelationship: `\`\`\`mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
\`\`\``,

  gantt: `\`\`\`mermaid
gantt
    title Project Schedule
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements  :done, a1, 2023-01-01, 7d
    Design        :a2, after a1, 10d
    section Development
    Coding        :a3, after a2, 15d
    Testing       :a4, after a3, 7d
\`\`\``,

  pie: `\`\`\`mermaid
pie
    title Distribution
    "Category A" : 40
    "Category B" : 30
    "Category C" : 20
    "Category D" : 10
\`\`\``,

  gitGraph: `\`\`\`mermaid
gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    checkout develop
    merge feature
    checkout main
    merge develop
\`\`\``,

  journey: `\`\`\`mermaid
journey
    title User Journey
    section Login
      Enter credentials: 5: User
      Submit form: 3: User, System
    section Main Flow
      Browse items: 5: User
      Add to cart: 4: User
      Checkout: 3: User, System
\`\`\``,
};

export const getMermaidTemplateMenu = () => {
  return Object.entries(mermaidTemplates).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    template: value,
  }));
};