# Task 1: HTML5 Semantic Structure & Accessibility

## Objective

Create a multi-page personal portfolio that demonstrates semantic HTML5, accessibility fundamentals, and SEO-ready metadata.

## Technologies

- HTML5

## Implementation

The portfolio is in `task-1-portfolio/` and includes Home, About, Projects, and Contact pages. Each page uses semantic landmarks, a shared navigation structure, unique metadata, and a footer.

## Features

- Semantic `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer` elements where appropriate
- Keyboard-accessible navigation with `aria-current="page"` on the active page
- One logical `h1` per page and descriptive links
- Four project articles: DairyDelight, Daily Expense Tracker, Java/Python Academic Projects, and Personal Portfolio
- Contact form with visible labels, appropriate input types, autocomplete, required fields, and validation constraints
- Unique page titles, meta descriptions, author metadata, viewport metadata, and document language

## Accessibility Considerations

- Native semantic landmarks support assistive technology navigation.
- The contact form does not rely on placeholders as labels.
- No meaningful images are used, so there are no missing image alternatives.
- Navigation and form controls can be reached by keyboard using native browser behavior.

## Testing

Performed locally:

- Checked that each page has metadata, semantic landmarks, one `h1`, and main navigation.
- Checked internal HTML links for missing targets.
- Checked contact-form label and control associations.
- Checked heading sequences for skipped levels.

Not yet performed:

- Browser keyboard-flow testing
- W3C HTML Validator validation
- Lighthouse Accessibility and SEO audits

## Result

Implemented locally and ready to open in a browser. Lighthouse scores have not been claimed because Lighthouse has not been run.

## Known Limitations

The contact form is a static HTML form (`action="#"`) and needs a backend or form service before it can send messages.
