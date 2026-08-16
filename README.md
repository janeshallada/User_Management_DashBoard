# UserDesk — User Management Dashboard

A responsive admin dashboard for viewing, adding, editing, and deleting users via the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) mock REST API. Built with React + Vite.

---

## Live Demo

> Deploy to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) by connecting your GitHub repo — zero config needed for Vite projects.

---

## Features

| Feature | Details |
|---|---|
| **View users** | Tabular display of ID, First Name, Last Name, Email, Department |
| **Add user** | Modal form with client-side validation, POST to API |
| **Edit user** | Pre-populated modal, PUT to API |
| **Delete user** | Confirmation modal, DELETE to API |
| **Search** | Real-time filtering across first name, last name, and email |
| **Filter popup** | Multi-field popup: first name, last name, email, department |
| **Sorting** | Click any column header to sort ascending/descending |
| **Pagination** | Page sizes of 10, 25, 50, 100 with smart ellipsis navigation |
| **Responsive UI** | Mobile-first layout, works on all screen sizes |
| **Error handling** | API errors surfaced as dismissible banner alerts |
| **Toasts** | Non-blocking success notifications for CRUD actions |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite 5](https://vitejs.dev/) | Build tool and dev server |
| [Axios](https://axios-http.com/) | HTTP requests |
| CSS (custom properties) | Styling — no framework dependency |
| [Inter + JetBrains Mono](https://fonts.google.com/) | Typography via Google Fonts |

---

## Project Structure

```
user-management-dashboard/
│
├── public/                        # Static assets
│
├── src/
│   ├── api/
│   │   └── userService.js         # All Axios API calls (GET, POST, PUT, DELETE)
│   │
│   ├── components/
│   │   ├── Header.jsx             # App branding + "Add User" button
│   │   ├── SearchBar.jsx          # Real-time search input
│   │   ├── FilterPopup.jsx        # Dropdown filter panel
│   │   ├── UserTable.jsx          # Sortable table with loading/empty states
│   │   ├── UserRow.jsx            # Individual row with Edit/Delete actions
│   │   ├── Pagination.jsx         # Page size selector + page navigation
│   │   ├── UserForm.jsx           # Add/Edit modal with validation
│   │   └── ConfirmDelete.jsx      # Delete confirmation modal
│   │
│   ├── hooks/
│   │   └── useUsers.js            # Custom hook: fetch, add, edit, remove
│   │
│   ├── utils/
│   │   ├── constants.js           # API URL, page sizes, departments, sort keys
│   │   ├── validators.js          # Form validation logic
│   │   └── helpers.js             # API data mapping, ID generation, search match
│   │
│   ├── styles/
│   │   ├── global.css             # Design tokens, reset, shared btn/modal styles
│   │   ├── Header.css
│   │   ├── SearchBar.css
│   │   ├── FilterPopup.css
│   │   ├── UserTable.css
│   │   ├── UserRow.css
│   │   ├── Pagination.css
│   │   ├── UserForm.css
│   │   └── ConfirmDelete.css
│   │
│   ├── App.jsx                    # Root component: state orchestration
│   ├── App.css                    # Layout, toolbar, alert, toast styles
│   └── main.jsx                   # React DOM entry point
│
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/user-management-dashboard.git
cd user-management-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Vite is auto-detected — no extra config needed
4. Click **Deploy**

### Netlify

1. Push to GitHub
2. Connect at [app.netlify.com](https://app.netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Click **Deploy site**

---

## Engineering Assumptions

### Data Mapping

The JSONPlaceholder `/users` endpoint returns a single `name` field (e.g. `"Leanne Graham"`) with no separate `firstName`, `lastName`, or `department`.

The following mappings are applied in `src/utils/helpers.js`:

| App Field | Source | Logic |
|---|---|---|
| `firstName` | `user.name` | Everything before the first space |
| `lastName` | `user.name` | Everything from the second word onward (`name.split(' ').slice(1).join(' ')`) — handles multi-word surnames correctly |
| `department` | None | Assigned deterministically from the `DEPARTMENTS` constant using `(user.id - 1) % DEPARTMENTS.length` so each user always gets the same department across re-fetches |

### API Limitations

JSONPlaceholder is a **read-only** mock API. It simulates successful responses (HTTP 201 for POST, HTTP 200 for PUT/DELETE) but does **not** persist changes. As a result:

- Newly added users are appended to **local React state** — they will disappear on page refresh.
- Edited and deleted users are updated/removed from **local state** immediately after a successful API response.
- All 10 seed users are re-fetched from the API on each page load.

### ID Generation

When adding a new user, since the API cannot return a real persisted ID, the app generates one locally by taking `max(existing IDs) + 1`. This avoids ID collisions within the same session.

### Department List

Eight departments are defined in `constants.js`: Engineering, Marketing, Sales, HR, Finance, IT, Design, Operations. These are available in the Add/Edit form dropdown and the filter popup.

---

## Architecture Decisions

- **Custom hook (`useUsers`):** All data fetching and mutation logic is isolated here, keeping `App.jsx` focused on UI orchestration.
- **`useMemo` for derived data:** The filter → search → sort → paginate pipeline runs through a single `useMemo` block, recalculating only when dependencies change. This keeps rendering efficient.
- **CSS custom properties:** All design tokens (colors, spacing, radii, shadows, typography) are defined as CSS variables in `global.css`. No CSS framework is required, keeping the bundle small.
- **Accessibility:** Modals use `role="dialog"` / `role="alertdialog"`, form fields use `aria-describedby` for error messages, tables use `aria-sort`, and keyboard users can dismiss modals with Escape.

---

## Challenges Faced

1. **JSONPlaceholder's read-only nature:** The API simulates success but doesn't persist data. Solved by managing a local state array as the source of truth, applying mutations optimistically after each confirmed API response.

2. **Name splitting edge cases:** Some names have three words (e.g. middle names or compound surnames). The split logic uses `slice(1).join(' ')` to correctly handle multi-word last names rather than just `split(' ')[1]`.

3. **Filter + Search + Sort interaction ordering:** All three need to stack without interfering. The pipeline is: filters → search → sort → paginate. Filters and search are both narrowing operations, so their order doesn't matter, but both must run before sort to avoid sorting discarded rows.

4. **Pagination reset on filter/search changes:** Without resetting `currentPage` to 1 on every filter/search/sort change, users could land on an empty page. Every handler that changes the dataset resets the page.

5. **Responsive table:** Wide tables break on narrow viewports. Solved with `overflow-x: auto` on the wrapper and a CSS breakpoint that swaps the separate First/Last Name columns for a single combined Name column (with avatar initials) on mobile.

---

## Possible Future Improvements

- **Persistent storage:** Replace local state with a real backend (e.g. Supabase, Firebase) so additions and edits survive page refresh.
- **React Router:** Deep-link to individual user profiles (e.g. `/users/3`).
- **Optimistic updates with rollback:** Show the updated row immediately and revert if the API call fails, rather than waiting for the response.
- **Column visibility toggle:** Let admins show/hide columns from a settings panel.
- **Bulk actions:** Select multiple rows to delete or export as CSV.
- **Authentication:** Gate the dashboard behind a login screen.
- **Unit tests:** Add Vitest + React Testing Library tests for validators, helpers, and key components.
- **Infinite scroll:** As an alternative to pagination, load more rows on scroll for a more fluid UX.
- **Dark mode:** The CSS variable system already supports a dark theme — just add a `[data-theme="dark"]` selector block.

---

## API Reference

**Base URL:** `https://jsonplaceholder.typicode.com/users`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users` | Fetch all users |
| `POST` | `/users` | Create a user (simulated) |
| `PUT` | `/users/:id` | Update a user (simulated) |
| `DELETE` | `/users/:id` | Delete a user (simulated) |

---

## License

MIT
