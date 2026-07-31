# AquaHub

AquaHub is a front-end application for managing fish and shrimp aquariums and tracking their water parameters. The project is primarily a learning workspace for React, TypeScript, state management, forms, routing, and testing.

The application currently uses local dummy data only. It does not have a backend, database, authentication, or real API integration.

## Current features

- Display aquariums from local dummy data.
- Show each aquarium's type, volume, pH, GH, and TDS.
- Search aquariums by name.
- Filter aquariums by type.
- Show an empty state when no aquarium matches the filters.
- Open an Add Aquarium form in a modal.
- Add an aquarium to the page's local React state.
- Responsive layout for desktop, tablet, and mobile.

> Newly added aquariums are stored in memory and will be lost when the page is refreshed.

## Current tech stack

- React 19
- TypeScript
- Vite
- Plain CSS
- ESLint

## Getting started

Node.js and npm are required.

```bash
cd aquahub
npm install
npm run dev
```

Open the URL shown by Vite in the terminal. By default, it is usually:

```text
http://localhost:5173
```

## Available scripts

```bash
npm run dev       # Start the development server
npm run build     # Type-check and create a production build
npm run lint      # Check the source code with ESLint
npm run preview   # Preview the production build
```

## Current project structure

```text
src/
|-- features/
|   `-- aquariums/
|       |-- components/
|       |   `-- AquariumCard.tsx
|       |-- data/
|       |   `-- aquariumData.ts
|       |-- pages/
|       |   `-- AquariumListPage.tsx
|       `-- types/
|           `-- aquarium.ts
|-- App.tsx
|-- App.css
|-- index.css
`-- main.tsx
```

The current render flow is:

```text
main.tsx
`-- App.tsx
    `-- AquariumListPage.tsx
        `-- AquariumCard.tsx
```

## Aquarium data model

The current model is:

```ts
interface Aquarium {
  id: number;
  name: string;
  type: AquariumType;
  volumeLitres: number;
  ph: number;
  gh: number;
  tds: number;
}
```

The initial dummy data is located in `src/features/aquariums/data/aquariumData.ts`.

## Planned architecture

As the application grows, the source code will move toward this feature-based structure:

```text
src/
|-- app/
|   |-- store.ts
|   `-- hooks.ts
|-- components/
|-- features/
|   |-- aquariums/
|   |-- articles/
|   |-- faqs/
|   `-- videos/
|-- layouts/
|-- routes/
|-- utils/
|-- App.tsx
`-- main.tsx
```

Each feature will own its components, pages, types, dummy data, Redux slice, and tests.

## Planned stack

The following tools are planned but are not installed yet:

- Redux Toolkit
- React Router
- React Hook Form
- Zod
- Vitest
- React Testing Library
- Material UI, if a component library becomes useful

## Roadmap

- [x] Initialize React, TypeScript, and Vite.
- [x] Build the aquarium list page.
- [x] Add search and type filtering.
- [x] Build the Add Aquarium form UI.
- [ ] Refine the `Aquarium` and `WaterParameters` models.
- [ ] Add React Router, navigation, and layouts.
- [ ] Add Redux Toolkit and move aquarium data into Redux state.
- [ ] Build the aquarium detail page.
- [ ] Build the Add Water Parameters form.
- [ ] Build the Articles, FAQ, and Videos features.
- [ ] Manage and validate forms with React Hook Form and Zod.
- [ ] Add tests with Vitest and React Testing Library.

The next priority flow is:

```text
Aquarium List
-> Aquarium Detail
-> Add Water Parameters
-> Update Redux State
```

## Out of scope for the current phase

- Backend and real API integration
- Database
- Authentication
- Admin pages
- Persistent data storage

## Learning goals

- React components, props, state, events, and hooks.
- Type safety with TypeScript.
- Global state management with Redux Toolkit.
- Client-side routing with React Router.
- Form management and validation.
- Unit and component testing.
- Feature-based front-end architecture.
