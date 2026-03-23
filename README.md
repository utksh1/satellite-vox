# SATELLITE_VOX

SATELLITE_VOX is a browser-based satellite archive built for my capstone project. It pulls live orbital data from the TLE API and presents it through a bold neo-brutalist interface that feels more like a control terminal than a polished dashboard.

The goal of the project was simple: make satellite data feel interesting, readable, and interactive without relying on a heavy framework. Instead of hiding the rawness of the data, the design leans into it.

## What It Does

- Searches live satellite records by name or NORAD-related terms
- Sorts results by name, satellite ID, or popularity
- Lets users refresh the dataset on demand
- Supports light and dark theme switching
- Copies TLE line data to the clipboard for quick reuse
- Stores the selected theme in local storage

## Built With

- HTML5
- CSS3
- Vanilla JavaScript
- Tailwind CSS via CDN
- Google Fonts
- [TLE API](https://tle.ivanstanojevic.me/api/tle)

## Why I Built It

This project started in a different direction and changed once I realized I wanted to build something that felt more alive. Satellite tracking gave me a better challenge: live data, search behavior, UI state, and a visual identity strong enough to make a simple frontend feel memorable.

I also wanted to prove to myself that I could build a distinctive interface with plain JavaScript and CSS, without depending on a framework to do the heavy lifting.

## Design Direction

SATELLITE_VOX is intentionally loud. Thick borders, sharp contrast, uppercase labels, and harsh shadows are all part of the visual system. The interface is meant to feel mechanical and a little uncompromising, like a terminal made for operators instead of casual browsing.

That said, I still wanted it to stay usable. Search is debounced, the layout adapts across screen sizes, loading and error states are visible, and the theme toggle gives the interface some flexibility without losing its identity.

## Project Structure

```text
.
├── index.html    # Main UI structure
├── styles.css    # Custom brutalist styling and animations
├── app.js        # Data fetching, rendering, sorting, theme handling
└── README.md
```

## Running Locally

This project does not require a build step.

1. Clone or download the repository.
2. Open `index.html` in your browser.

If your browser blocks certain features when opening files directly, run a simple local server instead. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Key Features in the Code

- `retrieveOrbits()` fetches satellite data from the API
- `renderTerminal()` creates the result cards dynamically
- `organizeLogs()` handles sorting logic
- `debounceAction()` prevents excessive API requests while typing
- `applyTheme()` and `loadSettings()` manage theme persistence

## Challenges and Lessons

A few parts of the project were more difficult than they looked:

- Balancing a strong visual style with readability
- Avoiding too many API calls during live search
- Making the interface feel responsive without using a frontend framework
- Keeping the layout consistent across both mobile and desktop screens

The biggest lesson was that visual personality only works when the basics are solid. If search, loading states, and responsiveness are weak, the design stops mattering.

## Future Improvements

- Add pagination controls for browsing more records
- Show more satellite metadata in each card
- Add favorites or saved objects instead of placeholder pin actions
- Improve error handling for API downtime or rate limiting
- Add tests and split the JavaScript into smaller modules

## Author

Created as a capstone project by Apple.
