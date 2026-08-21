# Task 3: JavaScript Logic & State Management

## Objective

Build a separate, accessible To-Do List application that demonstrates client-side CRUD, dynamic DOM rendering, state management, and persistent browser storage.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`

## Implementation

The application is in `task-3-todo-app/`. Task items are created entirely from JavaScript state; no task items are hard-coded in the initial HTML.

## Features

- Create tasks with trimmed input and useful empty-input validation
- Read and render tasks dynamically
- Edit tasks, including Escape-to-cancel support
- Delete tasks
- Mark tasks complete or active
- All, Active, and Completed filters
- Task total and remaining-task count
- Clear-completed action and contextual empty states
- Event delegation for dynamic task controls
- Unique task IDs using `crypto.randomUUID()` with a fallback
- Persistent `localStorage` state with safe recovery from malformed or invalid saved data
- Accessible status announcements and focus restoration after actions

## Accessibility Considerations

- Visible labels and keyboard-operable buttons are used throughout.
- Dynamic task actions are grouped and named for assistive technology.
- Validation and action results are announced through live regions.
- Completed tasks have text and visual state; color alone is not used.
- Focus is moved to a useful control after editing, deleting, and toggling tasks.

## Testing

Performed locally (static code audit):

- Confirmed dynamic rendering rather than hard-coded task markup.
- Confirmed CRUD handlers, completion toggle, filtering, and clear-completed logic.
- Confirmed guarded JSON parsing, localStorage access, unique IDs, event delegation, and live feedback.
- Confirmed responsive CSS and visible focus styles are present.

Not yet performed:

- Browser interaction testing for every CRUD flow
- Persistence and malformed-localStorage test in a browser
- Browser keyboard and responsive viewport tests
- JavaScript syntax/runtime test (Node.js is not installed)

## Result

Implemented locally. Runtime browser verification remains manual.

## Known Limitations

Tasks are stored only in the current browser's local storage; there is no account or server synchronization.
