# Essence Project Context

## Architecture
This is a plain HTML, CSS, and JS project. It relies on a global `style.css` for styling, which defines CSS custom properties to manage colors, spacing, and component definitions.

## Pages
1. `index.html` (Employee Details) - The primary reference point for profile and individual metric styles. Contains the most comprehensive set of components.
2. `performance.html` - Showcases bar charts and "Top Performers" grid layouts.
3. `inbox.html` - Implements a split-pane layout for messages.
4. `calendar.html` - A robust, full-page CSS grid calendar layout.
5. `payroll.html` - Features wide data tables and summary statistic cards.
6. `leave-management.html` - Focused on request lists and activity tables with status badges.
7. `recruitment.html` - Focused on applicant tracking funnels and job vacancies.

## Tooling
- **FontAwesome 6** for iconography.
- **Google Fonts (Inter)** for premium typography.
- **CSS Variables** for theming (refer to `style.css` `:root`).

## Next Steps for Expansion
- Wire up the JavaScript to handle actual modal interactions, calendar scrolling, or form submissions.
- Implement responsive media queries (e.g., `@media (max-width: 768px)`) to collapse the sidebar and stack grid elements on smaller screens.
