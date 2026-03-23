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
    console.log('SATELLITE_VOX_CUTE: READY');
});

async function retrieveOrbits(query = '*', page = 1) {
    currentPage = page;

    ui.grid.innerHTML = `
        <div class="bg-white dark:bg-primary-950/20 rounded-[2.5rem] p-12 flex items-center justify-between border-2 border-primary-50 dark:border-primary-900 animate-pulse">
            <div>
                <p class="font-header text-xl font-bold text-primary-300">QUERYING_STASH...</p>
                <p class="text-[10px] font-bold text-primary-200 mt-1 uppercase tracking-widest">${query}</p>
            </div>
            <div class="material-symbols-outlined text-4xl text-primary-200 animate-spin">cloud_sync</div>
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
        notify('SIGNAL_FAILURE', 'error');
        ui.grid.innerHTML = `
            <div class="bg-primary-50 dark:bg-primary-950 p-12 rounded-[2.5rem] border-2 border-primary-100 dark:border-primary-900">
                <h3 class="font-header text-2xl font-bold text-primary-700">500: NETWORK_VOID</h3>
                <p class="text-sm font-bold text-primary-400">SIGNAL SEVERED. CHECK CONNECTION.</p>
            </div>
        `;
    }
}

function renderTerminal(records) {
    ui.grid.innerHTML = '';

    if (records.length === 0) {
        ui.grid.innerHTML = `
            <div class="bg-white dark:bg-primary-900 rounded-[2.5rem] p-12 border border-primary-50 dark:border-primary-800">
                <p class="font-header text-lg font-bold text-primary-300">EMPTY_SET: NO MATCHES</p>
            </div>
        `;
        return;
    }

    const sortedRecords = [...records].sort((a, b) => {
        const aPinned = pinnedSatellites.includes(String(a.satelliteId));
        const bPinned = pinnedSatellites.includes(String(b.satelliteId));
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0;
    });

    sortedRecords.forEach((sat) => {
        const isPinned = pinnedSatellites.includes(String(sat.satelliteId));
        const card = document.createElement('div');
        card.className = 'satellite-card animate-reveal';
        card.innerHTML = `
            <div class="flex items-center gap-6 p-6 md:p-8 w-full">
                <div class="satellite-card__icon">
                    <span class="material-symbols-outlined text-3xl">satellite_alt</span>
                </div>
                <div class="flex-1 min-w-0 space-y-2">
                    <div class="flex flex-wrap items-center gap-4">
                        <h5 class="text-xl font-header font-bold text-primary-800 dark:text-primary-100 truncate">${sat.name || 'UNKNOWN'}</h5>
                        <span class="satellite-card__badge">SID_${sat.satelliteId}</span>
                        ${isPinned ? '<span class="bg-primary-600 text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg shadow-primary-200">PINNED</span>' : ''}
                    </div>
                    <div class="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-bold text-primary-400 dark:text-primary-500">
                        <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">schedule</span> ${new Date(sat.date).toLocaleDateString()}</span>
                        <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">fingerprint</span>${new Date(sat.date).getTime()}</span>
                    </div>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                    <button class="tle-button" onclick="copyTLEStrings('${sat.line1}', '${sat.line2}')">
                        TLE
                    </button>
                    <button class="pin-button ${isPinned ? 'bg-primary-600! text-white!' : ''}" onclick="togglePin('${sat.satelliteId}')">
                        <span class="material-symbols-outlined text-xl">${isPinned ? 'favorite' : 'favorite_border'}</span>
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
    toast.className = `toast ${type} animate-reveal`;
    toast.innerText = msg;
    ui.notificationArea.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px)';
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

window.togglePin = (id) => {
    const satId = String(id);
    const index = pinnedSatellites.indexOf(satId);
    
    if (index > -1) {
        pinnedSatellites.splice(index, 1);
        notify(`UNPINNED`, 'success');
    } else {
        pinnedSatellites.push(satId);
        notify(`PINNED_TO_VAULT`, 'success');
    }
    
    localStorage.setItem('vox_pinned', JSON.stringify(pinnedSatellites));
    renderTerminal(orbitalLog);
};
