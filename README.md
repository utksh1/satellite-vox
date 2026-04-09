# SatelliteVox

SatelliteVox is a responsive frontend web application for exploring solar system bodies through a searchable, filterable, card-based interface. The final version uses a local JSON catalog loaded with `fetch()` so the project stays stable in the browser without external API authentication.

## Project Description

The app lets users browse planets, moons, dwarf planets, and asteroids, compare key physical properties, save favorites, and switch between light and dark themes. It was built as a vanilla JavaScript project focused on dynamic rendering, array higher-order functions, and responsive UI design.

## Purpose

This project was created to demonstrate:

- asynchronous data loading with `fetch()` and `async/await`
- dynamic DOM rendering with JavaScript
- search, filtering, and sorting using array higher-order functions
- client-side state with `localStorage`
- responsive layout and interaction design with HTML and CSS

## Final Data Source

The original project plan targeted the Solar System OpenData API:

- `https://api.le-systeme-solaire.net/rest/bodies/`

The final submission uses a local structured catalog instead:

- Source type: local JSON fetched at runtime
- File: `assets/bodies.json`

This change was made because the live endpoint required authentication during development, while the project brief still needed a solar system body catalog that worked reliably in a static frontend deployment.

## Features

- dynamic body rendering from a fetched JSON data source
- search by celestial body name
- filter by body type
- sort by name, gravity, or density
- favorites system using `localStorage`
- light and dark theme toggle
- loading, empty, and error UI states
- responsive layout for desktop, tablet, and mobile

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Local JSON data

## Project Structure

```text
satellite-vox/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── assets/
│   ├── bodies.json
│   ├── hero-orbit.svg
│   └── screenshots/
│       ├── dark-mode.png
│       ├── filter.png
│       ├── home.png
│       ├── search.png
│       └── sorting.png
├── index.html
├── style.css
├── script.js
└── README.md
```

## Milestones

### Milestone 1 - Planning and Setup

- finalized the project concept
- defined the repository structure
- documented the planned features and milestone scope

### Milestone 2 - Data Integration

- connected the app to a structured solar system data source
- rendered the catalog dynamically
- added loading and error handling states

### Milestone 3 - Interactive Features

- added search with `filter()`
- added body type filtering
- added sorting with `sort()`
- added favorites with `localStorage`
- added persistent theme switching

### Milestone 4 - Documentation, Deployment, and Submission

- cleaned and reviewed the codebase
- refined UI spacing and interaction details
- finalized project documentation
- added deployment workflow and screenshots

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/utksh1/satellite-vox.git
   ```

2. Enter the project directory:

   ```bash
   cd satellite-vox
   ```

3. Start a local server so the JSON catalog can be loaded with `fetch()`:

   ```bash
   python3 -m http.server 8000
   ```

4. Open the app in your browser:

   ```text
   http://localhost:8000
   ```

## Deployment

SatelliteVox is prepared for static deployment.

### GitHub Pages

The repository includes a GitHub Pages workflow in `.github/workflows/deploy-pages.yml`.

To publish:

1. Open the repository on GitHub.
2. Go to `Settings` -> `Pages`.
3. Set the source to `GitHub Actions`.
4. Push to the `main` branch.

Expected site URL:

- `https://utksh1.github.io/satellite-vox/`

### Other Static Hosts

This project can also be deployed to:

- Netlify
- Vercel

Because the app is static, deployment only needs the repository files with no server-side configuration.

## Screenshots

### Home Page

![SatelliteVox home page](./assets/screenshots/home.png)

### Search Example

![SatelliteVox search example](./assets/screenshots/search.png)

### Filter Example

![SatelliteVox filter example](./assets/screenshots/filter.png)

### Sorting Example

![SatelliteVox sorting example](./assets/screenshots/sorting.png)

### Dark Mode

![SatelliteVox dark mode](./assets/screenshots/dark-mode.png)

## Final Review Checklist

- project runs from a local static server
- dynamic data rendering works from `assets/bodies.json`
- search, filtering, and sorting use array higher-order functions
- favorites and theme preference persist with `localStorage`
- layout responds across desktop, tablet, and mobile sizes
- README documentation matches the submitted project

## Notes

- The final project keeps the solar system exploration concept from the original brief.
- The shipped version uses a local JSON data source instead of the originally planned live API.
- No external build tools or frameworks are required to run the project.
