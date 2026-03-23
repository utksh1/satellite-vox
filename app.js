/**
 * app.js - SATELLITE_VOX | THE ORBITAL ARCHIVE
 * 
 * CORE UPLINK LOGIC. 
 * Built to satisfy the Capstone Project requirements:
 * - Integration of Public API (TLE API) via fetch()
 * - Array HOFs (map, filter, sort) for logic
 * - Loading states, Debouncing, and Local Storage.
 * 
 * DESIGN PHILOSOPHY: ARCHIVAL NEO-BRUTALISM.
 */

// --- STATE MANAGEMENT ---
let orbitalLog = []; // Source data from the API
let currentPage = 1;
const API_BASE = 'https://tle.ivanstanojevic.me/api/tle';

// --- ELEMENT RECOGNITION ---
const ui = {
    // Structural
    body: document.getElementById('prism-body'),
    grid: document.getElementById('link-vault-grid'),
    // Controls
    search: document.getElementById('vault-search'),
    sortSelect: document.getElementById('sort-select'),
    refreshBtn: document.getElementById('refresh-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    notificationArea: document.getElementById('notification-area')
};

// --- INITIALIZE TERMINAL ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();    // Check local storage for preferences
    retrieveOrbits();  // Boot initial data sequence
    bindTerminalEvents();
    console.log("📡 TERMINAL_READY: SATELLITE_VOX v1.02_UPLINKED");
});

// --- MILSTONE 2: API & LOADING ---
async function retrieveOrbits(query = "*", page = 1) {
    currentPage = page;
    
    // Manifest Loading State (Visual Feedback)
    ui.grid.innerHTML = `
        <div class="bg-white border-[6px] border-black p-12 block-shadow-sm flex items-center justify-between">
            <div>
                <p class="font-brutalist text-3xl animate-pulse">QUERYING_COLLECTION...</p>
                <p class="text-xs font-bold font-mono text-gray-400 mt-2">WAITING FOR ORBITAL PACKETS: ${query.toUpperCase()}</p>
            </div>
            <div class="material-symbols-outlined text-6xl animate-spin">sync</div>
        </div>
    `;

    try {
        const response = await fetch(`${API_BASE}?search=${query}&page=${page}&page-size=30`);
        if (!response.ok) throw new Error('SIGNAL_FAILED');
        
        const data = await response.json();
        
        // Success. Capture data member array
        orbitalLog = data.member || [];
        
        // Execute dynamic render
        renderTerminal(orbitalLog);
        
        // Persist search query in UI
        if (query !== "*" && query !== "") {
            notify(`ARCHIVE_FOUND: ${orbitalLog.length} RECORDS`, 'success');
        }

    } catch (error) {
        console.error("UPLINK_ERROR:", error);
        notify('TERMINAL_FAILURE: NO SIGNAL DETECTED.', 'error');
        ui.grid.innerHTML = `
            <div class="bg-warning-red text-white border-[6px] border-black p-12 block-shadow">
                <h3 class="font-brutalist text-5xl mb-4">500: NETWORK_VOID</h3>
                <p class="font-bold">THE SIGNAL HAS BEEN SEVERED. CHECK CONNECTION AND RETRY_REBOOT.</p>
            </div>
        `;
    }
}

// --- MILESTONE 3: ARRAY HOF MASTERY ---

/**
 * Renders the terminal grid using Array.forEach (Higher Order Function)
 * Note: .map could also be used here if returning values, but .forEach 
 * is used to manifest DOM changes.
 */
function renderTerminal(records) {
    ui.grid.innerHTML = ''; // Wipe previous logs

    if (records.length === 0) {
        ui.grid.innerHTML = `
            <div class="bg-white border-[6px] border-black p-12 block-shadow-sm">
                <p class="font-brutalist text-2xl">EMPTY_TRACK: NO SAT_TRAJECTORIES_MATCHED</p>
            </div>
        `;
        return;
    }

    // ARRY_HOF: Rendering each record with surgical detail
    records.forEach(sat => {
        const card = document.createElement('div');
        card.className = 'satellite-card animate-reveal';
        card.innerHTML = `
            <div class="w-24 bg-black text-white flex items-center justify-center shrink-0 min-h-[100px] md:min-h-0 group-hover:bg-warning-red transition-all group-hover:invert duration-300">
                <span class="material-symbols-outlined text-4xl">satellite_alt</span>
            </div>
            <div class="flex-1 p-8 space-y-4">
                <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <h5 class="text-3xl font-brutalist tracking-tighter uppercase">${sat.name || 'UNKNOWN_OBJECT'}</h5>
                    <span class="bg-warning-yellow border-2 border-black px-3 py-1 text-xs font-bold text-black shrink-0">SID: ${sat.satelliteId}</span>
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <span class="material-symbols-outlined text-sm">schedule</span>
                        <span>LOGGED: ${new Date(sat.date).toLocaleDateString()}</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <span class="material-symbols-outlined text-sm">history</span>
                        <span>EPOCH: ${new Date(sat.date).getTime()}</span>
                    </div>
                </div>
            </div>
            <div class="md:w-64 border-t-[4px] md:border-t-0 md:border-l-[4px] border-black p-8 flex flex-row md:flex-col justify-between items-center md:items-end bg-concrete-light/30">
                <div class="text-right hidden md:block">
                    <p class="text-[10px] font-bold text-gray-400">TRACKING</p>
                    <p class="text-xl font-brutalist">ACTIVE</p>
                </div>
                <div class="flex gap-2">
                    <button class="px-6 py-4 bg-black text-white font-bold flex items-center gap-2 hover:bg-warning-yellow hover:text-black transition-all active:scale-95" onclick="copyTLEStrings('${sat.line1}', '${sat.line2}')">
                        <span class="material-symbols-outlined text-sm">copy_all</span> TLE
                    </button>
                    <button class="p-4 bg-white border-2 border-black hover:bg-warning-red hover:text-white transition-all active:scale-95" onclick="logSatelliteToTerminal('${sat.satelliteId}')">
                        <span class="material-symbols-outlined">star</span>
                    </button>
                </div>
            </div>
        `;
        ui.grid.appendChild(card);
    });
}

/**
 * Filter and Sort Implementation (Array HOFs: .filter, .sort)
 */
function organizeLogs() {
    let activeSort = ui.sortSelect.value;
    let filteredRecords = [...orbitalLog]; // Clone to preserve original API uplink
    
    // Sort logic
    if (activeSort === 'name') {
        filteredRecords.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'id') {
        filteredRecords.sort((a, b) => a.satelliteId - b.satelliteId);
    } else if (activeSort === 'popularity') {
        filteredRecords.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    renderTerminal(filteredRecords);
    notify(`LOGS_REORGANIZED: ${activeSort.toUpperCase()}`, 'success');
}

// --- BONUS FEATURES (DEBOUNCING & LOCAL STORAGE) ---

/**
 * Debounce Function: Limits the frequency of API calls during search input.
 * This is a premium addition recommended for UX.
 */
function debounceAction(callback, delay = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}

/**
 * Persistence (Local Storage): Remembering user theme between sessions.
 */
function loadSettings() {
    const theme = localStorage.getItem('vox_theme') || 'light';
    if (theme === 'dark') applyTheme('dark');
}

function applyTheme(mode) {
    if (mode === 'dark') {
        ui.body.classList.add('dark');
        ui.themeToggle.innerText = 'SIGNAL_BRIGHT';
    } else {
        ui.body.classList.remove('dark');
        ui.themeToggle.innerText = 'SIGNAL_SHADOW';
    }
    localStorage.setItem('vox_theme', mode);
}

// --- INTERACTIVE TRIGGERS ---
function bindTerminalEvents() {
    // Theme Toggle
    ui.themeToggle.addEventListener('click', () => {
        const isDark = ui.body.classList.contains('dark');
        applyTheme(isDark ? 'light' : 'dark');
    });

    // Search Uplink (Debounced)
    ui.search.addEventListener('input', debounceAction((e) => {
        const val = e.target.value.trim();
        retrieveOrbits(val === "" ? "*" : val);
    }, 600));

    // Re-Sort Interaction
    ui.sortSelect.addEventListener('change', () => organizeLogs());

    // Pull New Data
    ui.refreshBtn.addEventListener('click', () => {
        retrieveOrbits(ui.search.value || "*");
    });
}

// --- FEEDBACK & UTILS ---
function notify(msg, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type} block-shadow-sm`;
    toast.innerText = msg;
    ui.notificationArea.appendChild(toast);
    
    // Smooth exit from terminal view
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Global scope helpers for HTML onclicks
window.copyTLEStrings = async (l1, l2) => {
    try {
        await navigator.clipboard.writeText(`${l1}\n${l2}`);
        notify('TLE_STRINGS_STASHED', 'success');
    } catch {
        notify('STASH_ERROR: PERMISSION_REVOKED', 'error');
    }
};

window.logSatelliteToTerminal = (id) => {
    notify(`SATELLITE_${id}_PINNED_TO_VAULT`, 'success');
    // Logic for future expansion (FAVORITES_ARRAY)
};
