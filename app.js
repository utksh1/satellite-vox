let orbitalLog = [];
let currentPage = 1;
let pinnedSatellites = JSON.parse(localStorage.getItem('vox_pinned') || '[]');
const API_BASE = 'https://tle.ivanstanojevic.me/api/tle';

const ui = {
    body: document.getElementById('prism-body'),
    grid: document.getElementById('link-vault-grid'),
    search: document.getElementById('vault-search'),
    sortSelect: document.getElementById('sort-select'),
    refreshBtn: document.getElementById('refresh-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    notificationArea: document.getElementById('notification-area')
};

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    retrieveOrbits();
    bindTerminalEvents();
    console.log('TERMINAL_READY: SATELLITE_VOX v1.06_UPLINKED');
});

async function retrieveOrbits(query = '*', page = 1) {
    currentPage = page;

    ui.grid.innerHTML = `
        <div class="status-card animate-pulse">
            <div>
                <p class="font-brutalist text-lg">QUERYING_ARCHIVE...</p>
                <p class="status-card__meta mt-1">${query}</p>
            </div>
            <div class="material-symbols-outlined text-3xl animate-spin">sync</div>
        </div>
    `;

    try {
        const response = await fetch(`${API_BASE}?search=${query}&page=${page}&page-size=30`);
        if (!response.ok) throw new Error('SIGNAL_FAILED');

        const data = await response.json();
        orbitalLog = data.member || [];
        renderTerminal(orbitalLog);

        if (query !== '*' && query !== '') {
            notify(`ARCHIVE_FETCH: ${orbitalLog.length} OBJECTS`, 'success');
        }
    } catch (error) {
        console.error('UPLINK_ERROR:', error);
        notify('TERMINAL_FAILURE: NO SIGNAL', 'error');
        ui.grid.innerHTML = `
            <div class="status-card status-card--error">
                <div>
                    <h3 class="font-brutalist text-2xl mb-2">500: NETWORK_VOID</h3>
                    <p class="text-sm font-bold">SIGNAL SEVERED. CHECK CONNECTION.</p>
                </div>
            </div>
        `;
    }
}

function renderTerminal(records) {
    ui.grid.innerHTML = '';

    if (records.length === 0) {
        ui.grid.innerHTML = `
            <div class="status-card">
                <p class="font-brutalist text-lg">EMPTY_SET: NO MATCHES</p>
            </div>
        `;
        return;
    }

    const pinnedItems = records.filter(sat => pinnedSatellites.includes(String(sat.satelliteId)));
    const unpinnedItems = records.filter(sat => !pinnedSatellites.includes(String(sat.satelliteId)));
    
    const sortedRecords = [...pinnedItems, ...unpinnedItems];

    sortedRecords.forEach((sat) => {
        const isPinned = pinnedSatellites.includes(String(sat.satelliteId));
        const card = document.createElement('div');
        card.className = 'satellite-card animate-reveal';
        card.innerHTML = `
            <div class="satellite-card__body">
                <div class="satellite-card__icon ${isPinned ? 'border-alert!' : ''}">
                    <span class="material-symbols-outlined text-2xl">${isPinned ? 'bookmark' : 'satellite_alt'}</span>
                </div>
                <div class="satellite-card__content">
                    <div class="satellite-card__heading">
                        <h5 class="satellite-card__title">${sat.name || 'UNKNOWN'}</h5>
                        <span class="satellite-card__badge">SID_${sat.satelliteId}</span>
                        ${isPinned ? '<span class="bg-alert text-white px-2 py-0.5 text-[8px] font-bold">STASHED</span>' : ''}
                    </div>
                    <div class="satellite-card__meta-row">
                        <span class="satellite-card__meta-item"><span class="material-symbols-outlined">calendar_today</span>${new Date(sat.date).toLocaleDateString()}</span>
                        <span class="satellite-card__meta-item"><span class="material-symbols-outlined">database</span>EPOCH: ${new Date(sat.date).getTime()}</span>
                    </div>
                </div>
                <div class="satellite-card__actions">
                    <div class="satellite-card__status">
                        <p class="satellite-card__status-label">STATUS</p>
                        <p class="satellite-card__status-value">NOMINAL</p>
                    </div>
                    <button class="tle-button" onclick="copyTLEStrings('${sat.line1}', '${sat.line2}')">
                        TLE
                    </button>
                    <button class="pin-button ${isPinned ? 'is-active' : ''}" onclick="logSatelliteToTerminal('${sat.satelliteId}')">
                        <span class="material-symbols-outlined text-lg">${isPinned ? 'bookmark' : 'bookmark_border'}</span>
                    </button>
                </div>
            </div>
        `;
        ui.grid.appendChild(card);
    });
}

function organizeLogs() {
    const activeSort = ui.sortSelect.value;
    const filteredRecords = [...orbitalLog];

    if (activeSort === 'name') {
        filteredRecords.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'id') {
        filteredRecords.sort((a, b) => a.satelliteId - b.satelliteId);
    } else if (activeSort === 'popularity') {
        filteredRecords.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    renderTerminal(filteredRecords);
    notify(`REORGANIZED: ${activeSort.toUpperCase()}`, 'success');
}

function debounceAction(callback, delay = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}

function loadSettings() {
    const theme = localStorage.getItem('vox_theme') || 'light';
    applyTheme(theme);
}

function applyTheme(mode) {
    const isDark = mode === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    ui.body.classList.toggle('dark', isDark);
    ui.themeToggle.innerText = isDark ? 'MODE_DARK' : 'MODE_LIGHT';
    localStorage.setItem('vox_theme', mode);
}

function bindTerminalEvents() {
    ui.themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        applyTheme(isDark ? 'light' : 'dark');
    });

    ui.search.addEventListener('input', debounceAction((e) => {
        const val = e.target.value.trim();
        retrieveOrbits(val === '' ? '*' : val);
    }, 600));

    ui.sortSelect.addEventListener('change', () => organizeLogs());

    if (ui.refreshBtn) {
        ui.refreshBtn.addEventListener('click', () => {
            retrieveOrbits(ui.search.value || '*');
        });
    }
}

function notify(msg, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = msg;
    ui.notificationArea.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

window.copyTLEStrings = async (l1, l2) => {
    try {
        await navigator.clipboard.writeText(`${l1}\n${l2}`);
        notify('TLE STASHED', 'success');
    } catch {
        notify('STASH ERROR', 'error');
    }
};

window.logSatelliteToTerminal = (id) => {
    const satId = String(id);
    const index = pinnedSatellites.indexOf(satId);
    
    if (index > -1) {
        pinnedSatellites.splice(index, 1);
        notify(`ARCHIVE_${id}_UNPINNED`, 'success');
    } else {
        pinnedSatellites.push(satId);
        notify(`ARCHIVE_${id}_STASHED`, 'success');
    }
    
    localStorage.setItem('vox_pinned', JSON.stringify(pinnedSatellites));
    renderTerminal(orbitalLog);
};
