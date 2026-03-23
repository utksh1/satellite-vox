/**
 * app.js - The Brain of PrismLink
 * 
 * I'll be real: this is where the magic (and the math) happens.
 * Built with the 'Velvet Void' philosophy—because why settle for a 
 * normal URL shortener when you can build a digital vault?
 */

// --- GLOBAL STASH ---
// We're pulling from localStorage so your links don't vanish into the abyss.
let linkVault = JSON.parse(localStorage.getItem('prism_links')) || [];
const API_BASE = 'https://csclub.uwaterloo.ca/~phthakka/1pt-express/addURL';

// --- GRAB THE DOM PIECES ---
const ui = {
    body: document.getElementById('prism-body'),
    toggle: document.getElementById('theme-toggle'),
    sun: document.getElementById('sun-icon'),
    moon: document.getElementById('moon-icon'),
    btn: document.getElementById('forge-btn'),
    url: document.getElementById('original-url-input'),
    short: document.getElementById('custom-short-input'),
    grid: document.getElementById('link-vault-grid'),
    search: document.getElementById('vault-search'),
    sort: document.getElementById('sort-select')
};

// --- STARTUP SEQUENCE ---
document.addEventListener('DOMContentLoaded', () => {
    // Let's get the mood right first...
    setupTheme();
    // Manifest the existing links...
    renderVault(linkVault);
    // Wire up the interactions...
    bindEvents();
    
    console.log("🌌 PrismLink initialized. The void is watching.");
});

// --- THEME LOGIC ---
function setupTheme() {
    const savedTheme = localStorage.getItem('prism_theme') || 'dark';
    ui.body.className = savedTheme;
    refreshIcons(savedTheme);
}

function refreshIcons(theme) {
    if (theme === 'dark') {
        ui.moon.classList.remove('hidden');
        ui.sun.classList.add('hidden');
    } else {
        ui.moon.classList.add('hidden');
        ui.sun.classList.remove('hidden');
    }
}

ui.toggle.addEventListener('click', () => {
    const isDark = ui.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    ui.body.className = newTheme;
    localStorage.setItem('prism_theme', newTheme);
    refreshIcons(newTheme);
});

// --- EVENT LISTENERS ---
function bindEvents() {
    // Search Filtering (Milestone 3 Preview)
    ui.search.addEventListener('input', (e) => {
        applySearch(e.target.value);
    });

    // Sorting (Milestone 3 Preview)
    ui.sort.addEventListener('change', (e) => {
        applySort(e.target.value);
    });

    // Forge Link (Milestone 2 Target)
    ui.btn.addEventListener('click', () => {
        const longUrl = ui.url.value.trim();
        const customShort = ui.short.value.trim();
        
        if (longUrl) {
            forgeLink(longUrl, customShort);
        } else {
            notify('Need a URL to work with, friend.', 'error');
        }
    });

    // Let them press Enter too.
    ui.url.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') ui.btn.click();
    });
}

// --- MILESTONE 2: THE FORGE (API INTEGRATION PREVIEW) ---
async function forgeLink(longUrl, customShort) {
    ui.btn.textContent = 'Forging...';
    ui.btn.disabled = true;

    try {
        /* 
           FUTURE WORK (Milestone 2): 
           This is where we'll actually talk to the 1pt.co API.
           For now, we're manifesting locally.
        */
        
        setTimeout(() => {
            const newLink = {
                long: longUrl,
                short: customShort || Math.random().toString(36).substring(7),
                date: Date.now()
            };
            
            linkVault.unshift(newLink);
            track(); // Save it.
            renderVault(linkVault);
            
            // Clean up the input
            ui.url.value = '';
            ui.short.value = '';
            ui.btn.textContent = 'Forge Link';
            ui.btn.disabled = false;
            
            notify('Link forged successfully!', 'success');
        }, 800);

    } catch (error) {
        notify('The void rejected your request. Try again.', 'error');
        ui.btn.textContent = 'Forge Link';
        ui.btn.disabled = false;
    }
}

// --- MILESTONE 3: ARRAY HOF MASTERY ---
function applySearch(query) {
    const filtered = linkVault.filter(link => 
        link.long.toLowerCase().includes(query.toLowerCase()) || 
        link.short.toLowerCase().includes(query.toLowerCase())
    );
    renderVault(filtered);
}

function applySort(criteria) {
    let sorted = [...linkVault]; // Don't mutate the original yet.
    
    if (criteria === 'newest') sorted.sort((a, b) => b.date - a.date);
    if (criteria === 'oldest') sorted.sort((a, b) => a.date - b.date);
    if (criteria === 'alphabetical') sorted.sort((a, b) => a.long.localeCompare(b.long));
    
    renderVault(sorted);
}

// --- RENDERING ENGINE ---
function renderVault(data) {
    ui.grid.innerHTML = '';
    
    if (data.length === 0) {
        ui.grid.innerHTML = `<div class="empty-state">Your vault is empty. Forge something magnificent.</div>`;
        return;
    }

    data.forEach(link => {
        const card = document.createElement('div');
        card.className = 'glass-panel link-card animate-in';
        card.innerHTML = `
            <div class="card-content">
                <p class="original-link">${link.long.substring(0, 40)}${link.long.length > 40 ? '...' : ''}</p>
                <div class="short-link-row">
                    <span class="short-label">1pt.co/</span>
                    <span class="short-value">${link.short}</span>
                </div>
                <div class="card-actions">
                    <button class="copy-btn" onclick="copy('1pt.co/${link.short}')">Copy</button>
                    <span class="card-date">${new Date(link.date).toLocaleDateString()}</span>
                </div>
            </div>
        `;
        ui.grid.appendChild(card);
    });
}

// --- UTILITIES ---
function track() {
    // Just a quick save so we don't lose the data.
    localStorage.setItem('prism_links', JSON.stringify(linkVault));
}

// Simple copy function—nothing fancy, just works.
async function copy(text) {
    try {
        await navigator.clipboard.writeText(text);
        notify('Copied to clipboard!', 'success');
    } catch (err) {
        notify('Failed to copy. Gravity is acting up.', 'error');
    }
}

// Our notification system. Elegant, self-cleaning.
function notify(msg, type) {
    const area = document.getElementById('notification-area');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = msg;
    area.appendChild(toast);
    
    // Fade it out after a few seconds...
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400); // Clean up the DOM
    }, 3000);
}
