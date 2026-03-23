# SATELLITE_VOX: THE ORBITAL ARCHIVE 🛰️

**SATELLITE_VOX** is a Neo-Brutalist interface into the digital debris and functional machines orbiting Earth. Built as a Capstone Project to demonstrate technical mastery in JavaScript, API integration, and high-contrast UI architecture, it leverages the **TLE (Two-Line Element) API** to query, filter, and analyze orbital data with surgical precision.

---

## 🚀 Vision & Purpose
As Earth's orbit becomes increasingly congested, SATELLITE_VOX provides a raw, unfiltered terminal for space situational awareness. It moves away from "pretty" aesthetics into **Neo-Brutalism**: NO DECORATION, ONLY FUNCTION.

### 🛠️ Core Technologies
- **API Conduit:** [TLE API (v2.0.0)](https://tle.ivanstanojevic.me) - Sourcing daily data from CelesTrak.
- **UI Architecture:** Neo-Brutalism (Heavy borders, Structural Black, Concrete Mids).
- **Styling:** Custom CSS + Tailwind CSS (via CDN) for structural consistency.
- **Engine:** Vanilla JavaScript (ES6+).

---

## 💎 Features (The Roadmap)

### 🌀 Milestone 2: Orbital Uplink (API Integration)
- **Direct Collection Query:** Integration with `GET /api/tle` for searchable collections.
- **Dynamic Satellite Logs:** Real-time rendering of TLE records with "Copy TLE" feedback.
- **Efficiency Metrics:** Visual indicators for orbital eccentricity and inclination.
- **Responsive Terminal:** A brutalist layout that adapts from mobile to ultra-wide displays.

### ⚙️ Milestone 3: Core Logic (Intelligence)
- **Structural Search:** Filtering results by name or ID using **`.filter()`**.
- **Parameter Sort:** Arrange satellites by name, ID, or "Popularity" using **`.sort()`**.
- **Inclination Filter:** Category-based slicing for polar vs equatorial orbits using **`.filter()`**.
- **System Purge:** A theme toggle for high-contrast "Dark Mode" and "Concrete Mode."

### ⭐ Bonus Ascensions
- **Persistence:** Save favorite satellites to `localStorage` for offline reference.
- **Debounced Search:** Avoid overwhelming the API on every keystroke.
- **Infinite Archive:** Vertical scroll pagination to explore the entire TLE dataset.

---

## 🛠️ Setup & Execution
1.  **Clone the Repository:**
    ```bash
    git clone [your-repo-link]
    ```
2.  **Open in Browser:**
    Open `index.html` in any modern web browser or use a Live Server.
3.  **Command Reality:**
    Search for "ISS," "Starlink," or "Hubble" to begin the uplink.

---

*“Built for scale, not for comfort.”* — **SATELLITE_VOX ARHIVIST**
