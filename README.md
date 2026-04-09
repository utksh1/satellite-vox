# SatelliteVox

SatelliteVox is a responsive frontend web application for exploring planets and other celestial bodies in our solar system. The app will use live data from the Solar System OpenData API and present it through a clean, card-based interface with search, filtering, sorting, and saved favorites.

## Purpose

This project is being built to practice core frontend development skills using HTML, CSS, and vanilla JavaScript. It is designed to demonstrate:

- API integration with asynchronous JavaScript
- Dynamic DOM rendering
- Array methods for searching, filtering, and sorting data
- Responsive UI design
- Clean project structure and maintainable frontend code

## Selected API

- API Name: Solar System OpenData API
- Base Endpoint: `https://api.le-systeme-solaire.net/rest/bodies/`
- Documentation: `https://api.le-systeme-solaire.net/`

### Planned Data Fields

The application will use relevant fields from the API response, including:

- `englishName`
- `gravity`
- `density`
- `meanRadius`
- `avgTemp`
- `bodyType`
- `isPlanet`
- `moons`

## Planned Features

- Browse planets and celestial bodies from the solar system
- Search celestial bodies by name
- Filter results by body type such as planet, moon, asteroid, or dwarf planet
- Sort objects alphabetically or by gravity and density
- Display results in a responsive card grid
- Show more details in a modal view
- Bookmark favorite celestial bodies
- Toggle between dark mode and light mode

## UI Direction

The interface will follow a handcrafted, minimal space-inspired design.

### Visual Goals

- Dark navy or charcoal background
- Clean card-based layout
- Minimal accent color usage
- Comfortable spacing and readable typography
- Subtle hover states and transitions

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Solar System OpenData API

## Project Structure

```text
satellite-vox/
├── assets/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Project Milestones

### Milestone 1 - Planning and Repository Setup

- Finalize project concept
- Select the public API
- Prepare repository structure
- Add initial HTML, CSS, and JavaScript files
- Write project documentation in the README

### Milestone 2 - API Integration

- Fetch celestial body data from the API
- Normalize and inspect incoming data
- Render initial result cards dynamically
- Add basic error handling and loading states

### Milestone 3 - Interactive Features

- Implement search functionality
- Add filter and sort controls
- Build the details modal
- Add favorites/bookmark functionality
- Add theme toggle support

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

4. Run the project by opening `index.html` in a browser.

## Repository Setup Workflow

```bash
git add .
git commit -m "initial repository setup"

git add .
git commit -m "add project README and planning"

git add .
git commit -m "create base HTML structure"

git add .
git commit -m "add CSS layout file"

git add .
git commit -m "setup project folder structure"
```

## Recommended Commit Timeline

If you want your milestone progress to reflect a staged development timeline, use commit messages like:

1. `initial repository setup`
2. `add project README and planning`
3. `create base HTML structure`
4. `add CSS layout file`
5. `setup project folder structure`

Optional date adjustment example:

```bash
git commit --amend --date="2026-03-18 19:30:00"
```

For multiple commits:

```bash
git rebase -i HEAD~5
```

## Development Best Practices

- Keep commits small and meaningful
- Use clear variable and function names
- Separate data logic, rendering logic, and event handling
- Avoid repeated code by extracting reusable functions
- Add basic error handling for API operations
- Test layout across mobile, tablet, and desktop sizes
- Keep documentation updated as the project evolves

## Milestone 1 Outcome

After this milestone, the repository should contain:

- A finalized project concept
- A selected public API
- A clean starter file structure
- A documented development plan
- A solid base for Milestone 2 implementation
