let orbitalLog = [];
let currentPage = 1;
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
    console.log("📡 TERMINAL_READY: SATELLITE_VOX v1.02_UPLINKED");
});

async function retrieveOrbits(query = "*", page = 1) {
    currentPage = page;
    
    ui.grid.innerHTML = `
        <div class="bg-white dark:bg-stone-900 border-4 border-black dark:border-white p-8 block-shadow-sm flex items-center justify-between animate-pulse">
            <div>
                <p class="font-brutalist text-lg dark:text-white">QUERYING_ARCHIVE...</p>
                <p class="text-[10px] font-bold font-mono text-gray-400 mt-1 uppercase tracking-widest">${query}</p>
            </div>
            <div class="material-symbols-outlined text-3xl animate-spin dark:text-white">sync</div>
        </div>
    `;

    try {
        const response = await fetch(`${API_BASE}?search=${query}&page=${page}&page-size=30`);
        if (!response.ok) throw new Error('SIGNAL_FAILED');
        
        const data = await response.json();
        orbitalLog = data.member || [];
        renderTerminal(orbitalLog);
        
        if (query !== "*" && query !== "") {
            notify(`ARCHIVE_FETCH: ${orbitalLog.length} OBJECTS`, 'success');
        }
    } catch (error) {
        console.error("UPLINK_ERROR:", error);
        notify('TERMINAL_FAILURE: NO SIGNAL', 'error');
        ui.grid.innerHTML = `
            <div class="bg-warning-red text-white border-4 border-black p-8 block-shadow">
                <h3 class="font-brutalist text-2xl mb-2">500: NETWORK_VOID</h3>
                <p class="text-sm font-bold">SIGNAL SEVERED. CHECK CONNECTION.</p>
            </div>
        `;
    }
}

function renderTerminal(records) {
    ui.grid.innerHTML = '';

    if (records.length === 0) {
        ui.grid.innerHTML = `
            <div class="bg-white dark:bg-stone-900 border-4 border-black dark:border-white p-8 block-shadow-sm">
                <p class="font-brutalist text-lg dark:text-white">EMPTY_SET: NO MATCHES</p>
            </div>
        `;
        return;
    }

    records.forEach(sat => {
        const card = document.createElement('div');
        card.className = 'satellite-card animate-reveal';
        card.innerHTML = `
            <div class="flex items-center gap-4 md:gap-8 p-4 md:p-6 w-full">
                <div class="hidden md:flex w-16 h-16 bg-black dark:bg-white text-white dark:text-black items-center justify-center shrink-0 border-2 border-black dark:border-white">
                    <span class="material-symbols-outlined text-2xl">satellite_alt</span>
                </div>
                <div class="flex-1 min-w-0 space-y-2">
                    <div class="flex flex-wrap items-center gap-3">
                        <h5 class="text-lg font-brutalist tracking-tighter uppercase dark:text-white truncate">${sat.name || 'UNKNOWN'}</h5>
                        <span class="bg-warning-yellow border-2 border-black px-2 py-0.5 text-[9px] font-bold text-black uppercase">SID_${sat.satelliteId}</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-gray-500 dark:text-gray-400">
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">calendar_today</span> ${new Date(sat.date).toLocaleDateString()}</span>
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">database</span> EPOCH: ${new Date(sat.date).getTime()}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 md:gap-4 shrink-0">
                    <div class="hidden xl:block text-right pr-4 border-r-2 border-black dark:border-white/20">
                        <p class="text-[8px] font-bold text-gray-400 tracking-widest uppercase">STATUS</p>
                        <p class="text-[10px] font-brutalist dark:text-white">NOMINAL</p>
                    </div>
                    <button class="h-10 px-4 bg-black dark:bg-white text-white dark:text-black font-bold text-[10px] uppercase hover:bg-warning-yellow dark:hover:bg-warning-yellow hover:text-black transition-all active:scale-95 block-shadow-sm border-2 border-black dark:border-white" onclick="copyTLEStrings('${sat.line1}', '${sat.line2}')">
                        TLE
                    </button>
                    <button class="w-10 h-10 bg-white dark:bg-stone-800 border-2 border-black dark:border-white hover:bg-warning-red dark:hover:bg-warning-red hover:text-white transition-all active:scale-95 flex items-center justify-center" onclick="logSatelliteToTerminal('${sat.satelliteId}')">
                        <span class="material-symbols-outlined text-lg">star</span>
                    </button>
                </div>
            </div>
        `;
        ui.grid.appendChild(card);
    });
}

function organizeLogs() {
    let activeSort = ui.sortSelect.value;
    let filteredRecords = [...orbitalLog];
    
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
    if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        ui.body.classList.add('dark');
        ui.themeToggle.innerText = 'SIGNAL_BRIGHT';
    } else {
        document.documentElement.classList.remove('dark');
        ui.body.classList.remove('dark');
        ui.themeToggle.innerText = 'SIGNAL_SHADOW';
    }
    localStorage.setItem('vox_theme', mode);
}

function bindTerminalEvents() {
    ui.themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        applyTheme(isDark ? 'light' : 'dark');
    });

    ui.search.addEventListener('input', debounceAction((e) => {
        const val = e.target.value.trim();
        retrieveOrbits(val === "" ? "*" : val);
    }, 600));

    ui.sortSelect.addEventListener('change', () => organizeLogs());

    if (ui.refreshBtn) {
        ui.refreshBtn.addEventListener('click', () => {
            retrieveOrbits(ui.search.value || "*");
        });
    }
}

function notify(msg, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type} block-shadow-sm border-2 border-black dark:border-white`;
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
    notify(`SAT_${id}_PINNED`, 'success');
};
