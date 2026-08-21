# Task 2: Advanced CSS3 & Responsive Architecture

## Objective

Extend the semantic portfolio into a modern, responsive interface while preserving its accessibility foundation.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript (theme preference only)

## Implementation

The responsive portfolio is in `task-2-responsive-portfolio/`. It contains the same four portfolio pages, a shared stylesheet at `css/style.css`, and a small theme script at `js/theme.js`.

## Features

- Mobile-first responsive layouts for the portfolio, projects, and contact form
- CSS custom properties for colors, spacing, typography, borders, and shadows
- CSS Grid for page/card layouts and Flexbox for navigation, actions, and component alignment
- Responsive breakpoints for compact, tablet, and desktop layouts
- Accessible skip links, hover states, and visible `:focus-visible` indicators
- Light/dark theme toggle that updates its accessible name and pressed state
- Theme preference stored in `localStorage` when browser storage is available
- `prefers-reduced-motion` support for users who request reduced motion

## Accessibility Considerations

- Semantic landmarks and labels from the Task 1 design are preserved.
- Focus indicators are intentionally visible.
- Color is not the only way buttons and links communicate their purpose.
- Theme selection is operable with a keyboard and announced through its accessible label.

## Testing

Performed locally:

- Checked all internal links and stylesheet/script paths.
- Checked metadata, landmarks, skip links, active-navigation state, one `h1` per page, and theme controls.
- Checked for CSS variables, Grid, Flexbox, media queries, focus styles, dark-theme rules, and reduced-motion support.
- Checked label/control associations and contact-form constraints.

Not yet performed:

- Browser viewport and keyboard tests
- Theme persistence test in a browser
- JavaScript syntax/runtime test (Node.js is not installed)
- Lighthouse audits

## Result

Implemented locally. Browser and Lighthouse verification remain manual.

## Known Limitations

The static contact form does not send messages without a backend or form service.
