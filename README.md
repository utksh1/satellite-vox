# SatelliteVox

SatelliteVox is a responsive frontend web application for exploring planets and other celestial bodies from our solar system. The app uses a structured solar system data set and presents it through a clean, card-based interface with search, filtering, and sorting.

## Purpose

This project is being built to practice core frontend development skills using HTML, CSS, and vanilla JavaScript. It is designed to demonstrate:

- API-style data integration with asynchronous JavaScript
- Dynamic DOM rendering
- Array methods for searching, filtering, and sorting data
- Responsive UI design
- Clean project structure and maintainable frontend code

## Selected Data Source

- Source Type: Local JSON catalog fetched with `fetch()`
- File Path: `assets/bodies.json`
- Reason: Supports a broader solar system body catalog without requiring API authentication

### Data Fields Used

The application uses fields such as:

- `englishName`
- `bodyType`
- `gravity`
- `density`
- `meanRadius`
- `avgTemp`
- `isPlanet`
- `moonsCount`

## Current Features

- Browse planets, moons, dwarf planets, and asteroids
- Search celestial bodies by name
- Filter results by body type
- Sort objects by name, gravity, or density
- Save favorite bodies using `localStorage`
- Toggle between light and dark themes
- Display results in a responsive card grid
- Show loading, empty, and error states

## UI Direction

The interface follows a handcrafted, minimal design.

### Visual Goals

- Light neutral background
- Clean card-based layout
- Minimal accent color usage
- Comfortable spacing and readable typography
- Subtle transitions and restrained styling

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Local JSON data

## Project Structure

```text
satellite-vox/
├── assets/
│   └── bodies.json
├── index.html
├── style.css
├── script.js
└── README.md
```

## Project Milestones

### Milestone 1 - Planning and Repository Setup

- Finalize project concept
- Select the public API or data source
- Prepare repository structure
- Add initial HTML, CSS, and JavaScript files
- Write project documentation in the README

### Milestone 2 - API Integration

- Fetch celestial body data from a structured source
- Normalize and inspect incoming data
- Render result cards dynamically
- Add basic error handling and loading states

### Milestone 3 - Interactive Features

- Implement search with `filter()`
- Add body type filtering
- Add sorting by name, gravity, and density
- Add favorites with `localStorage`
- Add persistent dark and light theme switching
- Refine card interactions and transitions

### Milestone 4 - Polish, Documentation, and Deployment

- Improve accessibility and responsiveness
- Refine UI states and interactions
- Finalize documentation
- Deploy the project

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/utksh1/satellite-vox.git
   ```

2. Enter the project directory:

   ```bash
   cd satellite-vox
   ```

3. Open the project in your code editor.

4. Run the project with a local server so `fetch()` can load `assets/bodies.json`.

   Example with Python:

   ```bash
   python3 -m http.server 8000
   ```

5. Open `http://localhost:8000` in your browser.

## Milestone 3 Notes

- SatelliteVox uses a local JSON catalog fetched with `fetch()` because the project moved away from the original authenticated API requirement.
- Search, filtering, and sorting are implemented with array higher-order functions only.
- Favorites and theme preferences are stored locally in the browser with `localStorage`.
- The current catalog includes planets, major moons, dwarf planets, and asteroids.

## Development Best Practices

- Keep commits small and meaningful
- Use clear variable and function names
- Separate data logic, rendering logic, and event handling
- Avoid repeated code by extracting reusable functions
- Add basic error handling for data operations
- Test layout across mobile, tablet, and desktop sizes
- Keep documentation updated as the project evolves
