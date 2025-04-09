# Markdown Syntax Showcase

## 10. Diagrams (Mermaid)

Visualizing data with diagrams.

### Flowchart

```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```

### Sequence Diagram

```mermaid
sequenceDiagram
  participant A
  participant B
  A->>B: Hello, how are you?
  B->>A: I'm good, thanks!
```

### Mindmap

```mindmap
- Root
  - Branch 1
    - Subbranch 1
    - Subbranch 2
  - Branch 2
    - Subbranch 3
    - Subbranch 4
```

### Chart (Gantt)

```mermaid
gantt
  title Project Timeline
  dateFormat  YYYY-MM-DD
  section Development
  Task 1 :done, 2024-01-01, 2024-01-10
  Task 2 :active, 2024-01-11, 2024-01-20
  Task 3 : 2024-01-21, 2024-01-30
```

# Mermaid Diagrams Showcase

## 1. Flowchart

```mermaid
flowchart TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Fix it]
    D --> B
```

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am fine, thanks!
```

## 3. Class Diagram

```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    class Animal{
        +int age
        +String gender
        +isMammal()
        +mate()
    }
```

## 4. State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading
    Loading --> Success
    Loading --> Failure
    Success --> [*]
    Failure --> [*]
```

## 5. Gantt Chart

```mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    Task 1           :a1, 2025-04-01, 3d
    Task 2           :after a1  , 4d
```

## 6. Pie Chart

```mermaid
pie
    title Pet Preferences
    "Dogs" : 40
    "Cats" : 30
    "Birds" : 20
    "Fish" : 10
```

## 7. Git Graph

```mermaid
gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
```

## 8. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    CUSTOMER }|..|{ DELIVERY_ADDRESS : uses
```

## 9. Journey Diagram

```mermaid
journey
    title User Journey
    section Sign Up
      User visits signup page: 5
      User enters details: 3
      User submits form: 4
    section Onboarding
      User reads tutorial: 3
      User sets preferences: 4
```

## 10. Requirement Diagram

```mermaid
requirementDiagram
    requirement req1 {
      id: 1
      text: The system shall respond to user input within 100ms.
    }
    requirement req2 {
      id: 2
      text: The system shall allow user registration.
    }
    element client {
      type: software
    }
    client - satisfies -> req1
    client - satisfies -> req2
```

## 11. Mindmap

```mermaid
mindmap
  root
    Origins
      Long history
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness
      On applications
    Tools
      Pen and paper
      Software
```

## 12. Quadrant Chart

```mermaid
quadrantChart
    title Reach vs Impact
    x-axis Low Reach --> High Reach
    y-axis Low Impact --> High Impact
    quadrant-1 Low Priority
    quadrant-2 Invest More
    quadrant-3 Reconsider
    quadrant-4 High Leverage
    "Small blog post": [0.3, 0.2]
    "Viral feature": [0.8, 0.9]
    "Internal tool": [0.5, 0.4]
```
