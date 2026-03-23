/**
 * app.js - The Brain of PrismLink
 * Built with the 'Velvet Void' philosophy: Spectacular or nothing.
 */

// --- STATE MANAGEMENT ---
let linkVault = JSON.parse(localStorage.getItem('prism_links')) || [];
const API_ENDPOINT = 'https://csclub.uwaterloo.ca/~phthakka/1pt-express/addURL';

// --- DOM ELEMENTS ---
const elements = {
    body: document.getElementById('prism-body'),
    themeToggle: document.getElementById('theme-toggle'),
    sunIcon: document.getElementById('sun-icon'),
    moonIcon: document.getElementById('moon-icon'),
    forgeBtn: document.getElementById('forge-btn'),
    urlInput: document.getElementById('original-url-input'),
    shortInput: document.getElementById('custom-short-input'),
    vaultGrid: document.getElementById('link-vault-grid'),
    searchInput: document.getElementById('vault-search'),
    sortSelect: document.getElementById('sort-select')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderVault(linkVault);
    setupEventListeners();
});

// --- THEME LOGIC ---
function initTheme() {
    const savedTheme = localStorage.getItem('prism_theme') || 'dark';
    elements.body.className = savedTheme;
    updateThemeIcons(savedTheme);
}

function updateThemeIcons(theme) {
    if (theme === 'dark') {
        elements.moonIcon.classList.remove('hidden');
        elements.sunIcon.classList.add('hidden');
    } else {
        elements.moonIcon.classList.add('hidden');
        elements.sunIcon.classList.remove('hidden');
    }
}

elements.themeToggle.addEventListener('click', () => {
    const isDark = elements.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    elements.body.className = newTheme;
    localStorage.setItem('prism_theme', newTheme);
    updateThemeIcons(newTheme);
});

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Search Filtering (Milestone 3 Preview)
    elements.searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    // Sorting (Milestone 3 Preview)
    elements.sortSelect.addEventListener('change', (e) => {
        handleSort(e.target.value);
    });

    // Forge Link (Milestone 2 Target)
    elements.forgeBtn.addEventListener('click', () => {
        const longUrl = elements.urlInput.value.trim();
        const customShort = elements.shortInput.value.trim();
        
        if (longUrl) {
            forgeLink(longUrl, customShort);
        } else {
            showNotification('Please enter a valid URL', 'error');
        }
    });
}

// --- MILESTONE 2: THE FORGE (API INTEGRATION PREVIEW) ---
async function forgeLink(longUrl, customShort) {
    elements.forgeBtn.textContent = 'Forging...';
    elements.forgeBtn.disabled = true;

    try {
        // Placeholder for the fetch call (to be completed in Milestone 2)
        // const response = await fetch(`${API_ENDPOINT}?long=${longUrl}&short=${customShort}`, { method: 'POST' });
        // const data = await response.json();
        
        // MOCK DATA for initial structure (Milestone 1 requirement)
        setTimeout(() => {
            const mockData = {
                long: longUrl,
                short: customShort || Math.random().toString(36).substring(7),
                date: Date.now()
            };
            
            linkVault.unshift(mockData);
            saveToLocalStorage();
            renderVault(linkVault);
            
            elements.urlInput.value = '';
            elements.shortInput.value = '';
            elements.forgeBtn.textContent = 'Forge Link';
            elements.forgeBtn.disabled = false;
            
            showNotification('Link forged successfully!', 'success');
        }, 800);

    } catch (error) {
        showNotification('The void rejected your request. Try again.', 'error');
        elements.forgeBtn.textContent = 'Forge Link';
        elements.forgeBtn.disabled = false;
    }
}

// --- MILESTONE 3: ARRAY HOF MASTERY ---
function handleSearch(query) {
    const filtered = linkVault.filter(link => 
        link.long.toLowerCase().includes(query.toLowerCase()) || 
        link.short.toLowerCase().includes(query.toLowerCase())
    );
    renderVault(filtered);
}

function handleSort(criteria) {
    let sorted = [...linkVault];
    
    if (criteria === 'newest') sorted.sort((a, b) => b.date - a.date);
    if (criteria === 'oldest') sorted.sort((a, b) => a.date - b.date);
    if (criteria === 'alphabetical') sorted.sort((a, b) => a.long.localeCompare(b.long));
    
    renderVault(sorted);
}

// --- RENDERING ENGINE ---
function renderVault(data) {
    elements.vaultGrid.innerHTML = '';
    
    if (data.length === 0) {
        elements.vaultGrid.innerHTML = `<div class="empty-state">Your vault is empty. Forge something magnificent.</div>`;
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
                    <button class="copy-btn" onclick="copyToClipboard('1pt.co/${link.short}')">Copy</button>
                    <span class="card-date">${new Date(link.date).toLocaleDateString()}</span>
                </div>
            </div>
        `;
        elements.vaultGrid.appendChild(card);
    });
}

// --- UTILITIES ---
function saveToLocalStorage() {
    localStorage.setItem('prism_links', JSON.stringify(linkVault));
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy', 'error');
    }
}

function showNotification(msg, type) {
    const area = document.getElementById('notification-area');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = msg;
    area.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
