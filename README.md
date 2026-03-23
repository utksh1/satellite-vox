# SATELLITE_VOX: THE ORBITAL ARCHIVE 🛰️

**SATELLITE_VOX** is a high-fidelity Neo-Brutalist interface designed to query and analyze the digital debris and functional machines orbiting Earth. Built as a Capstone Project to demonstrate technical mastery in JavaScript, API integration, and high-contrast UI architecture.

---

## 🚀 Vision & Purpose
SATELLITE_VOX provides a raw, unfiltered terminal for space situational awareness. It prioritizes **function over form**, utilizing the "RAW INPUT" Neo-Brutalist aesthetic: NO DECORATION, ONLY DATA.

### 🛠️ Core Technologies
- **API Conduit:** [TLE API (v2.0.0)](https://tle.ivanstanojevic.me) - Sourcing daily data from CelesTrak.
- **UI Architecture:** Neo-Brutalism (Heavy 6px+ borders, Structural Black, Concrete Mids).
- **Styling:** Custom CSS + Tailwind CSS (via CDN) for structural logic.
- **Engine:** Vanilla JavaScript (ES6+).

---

## 💎 Features (The Roadmap)

### ✅ Milestone 1: Project Setup (Completed Mar 23rd)
- **Concept Pivot:** Transitioned from URL Shortener to Satellite Tracking.
- **Structural Init:** Repository established with Neo-Brutalist baseline.
- **README Documentation:** Defined purpose, tech stack, and roadmap.

### 🌀 Milestone 2: Orbital Uplink (Completed)
- **Direct Collection Query:** Integration with `GET /api/tle` for searchable collections.
- **Dynamic Satellite Logs:** Real-time rendering of TLE records with "Copy TLE" feedback.
- **Loading States:** Brutalist skeleton indicators during API fetch operations.
- **Responsive Terminal:** Fully functional across Mobile (iPhone X), Tablet, and Desktop viewports.

### ⚙️ Milestone 3: Core Logic (Implemented & Ready)
- **Structural Search:** Filtering results by name or ID using **`.filter()`** via the API's query params.
- **Parameter Sort:** Arrange satellites by Name, SID, or Popularity using **`.sort()`**.
- **HOF Mastery:** Exhaustive use of Array Higher-Order Functions (`forEach`, `sort`, `filter`) for all data manipulation.
- **System Purge:** High-contrast Dark Mode and Light Mode toggle via "Signal Toggle."

### ⭐ Bonus Features
- **Debouncing:** Search inputs are throttled to 600ms to preserve API bandwidth.
- **Local Storage:** Remembers your theme preference (Dark/Light) between sessions.
- **Clipboard Integration:** One-click TLE string extraction for external analysis.

---

## 🛠️ Setup & Execution
1.  **Repository Clone:**
    ```bash
    git clone [your-repo-link]
    ```
2.  **Open Architecture:**
    Simply open `index.html` in any browser. No build steps are required as SATELLITE_VOX uses a vanilla architecture.
3.  **Command Reality:**
    Use the `UPLINK_CONTROLLER` to search for "ISS," "STARLINK," or "GPS" to begin data extraction.

---

*“Built for scale, not for comfort.”* — **SATELLITE_VOX ARCHIVIST**
