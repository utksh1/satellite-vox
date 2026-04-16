const DATA_URL = "./assets/bodies.json";
const ALLOWED_TYPES = ["Planet", "Moon", "Dwarf Planet", "Asteroid"];

const query = (selector) => document.querySelector(selector);
const setText = (element, value) => element && (element.textContent = String(value));
const formatMetric = (value, unit) =>
  Number.isFinite(value) ? `${value.toLocaleString()} ${unit}` : "Unknown";

const elements = {
  search: query("#search"),
  filter: query("#filter"),
  sort: query("#sort"),
  status: query("#status-region"),
  grid: query("#card-grid"),
  total: query("#stat-total"),
  planets: query("#stat-planets"),
  moons: query("#stat-moons"),
  asteroids: query("#stat-asteroids"),
  note: query("#catalog-note"),
};

const state = { bodies: [] };

const sorters = {
  name: (a, b) => a.name.localeCompare(b.name),
  gravity: (a, b) => (a.gravity ?? -1) - (b.gravity ?? -1),
  density: (a, b) => (a.density ?? -1) - (b.density ?? -1),
};

function showStatus(title, message, isError = false) {
  elements.status.innerHTML = `
    <div class="status-card${isError ? " status-card--error" : ""}">
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;
}

async function loadBodies() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}.`);

  const payload = await response.json();
  const bodies = Array.isArray(payload) ? payload : payload.bodies;
  if (!Array.isArray(bodies) || !bodies.length) {
    throw new Error("No catalog data was returned.");
  }

  return bodies
    .filter(({ englishName, bodyType }) => englishName && ALLOWED_TYPES.includes(bodyType))
    .map(
      ({
        englishName,
        bodyType,
        summary,
        image,
        imageUrl,
        gravity,
        density,
        meanRadius,
        moonsCount,
      }) => ({
        name: englishName,
        type: bodyType,
        summary: summary || "Catalog object prepared for comparison.",
        image: image || imageUrl || "",
        gravity,
        density,
        radius: meanRadius,
        moons: moonsCount || 0,
      }),
    );
}

function createMetric(label, value) {
  return `
    <div class="metric-pill">
      <span class="metric-label">${label}</span>
      <span class="metric-value">${value}</span>
    </div>
  `;
}

function createCard(body) {
  return `
    <article class="body-card">
      <div class="card-media">
        <img class="card-media-image" src="${body.image}" alt="${body.name}" loading="lazy" />
        <div class="card-media-top"><span class="card-code">${body.type}</span></div>
        <div class="card-overlay"><h3 class="card-title-main">${body.name}</h3></div>
      </div>
      <div class="card-body">
        <p class="card-summary">${body.summary}</p>
        <div class="metric-strip">
          ${createMetric("Gravity", formatMetric(body.gravity, "m/s²"))}
          ${createMetric("Density", formatMetric(body.density, "g/cm³"))}
          ${createMetric("Radius", formatMetric(body.radius, "km"))}
          ${createMetric("Moons", body.moons)}
        </div>
      </div>
    </article>
  `;
}

function getVisibleBodies() {
  const term = elements.search.value.trim().toLowerCase();
  const type = elements.filter.value;
  const sortBy = elements.sort.value;

  return state.bodies
    .filter((body) => body.name.toLowerCase().includes(term))
    .filter((body) => type === "all" || body.type === type)
    .slice()
    .sort(sorters[sortBy] || sorters.name);
}

function renderCards() {
  const visibleBodies = getVisibleBodies();
  elements.status.innerHTML = "";
  elements.grid.innerHTML = visibleBodies.map(createCard).join("");

  if (!visibleBodies.length) {
    showStatus("No results found", "Try a different search or body type.");
  }
}

function renderDashboard() {
  const summary = state.bodies.reduce((result, body) => {
    if (body.type === "Planet") result.planets += 1;
    if (body.type === "Moon") result.moons += 1;
    if (body.type === "Asteroid") result.asteroids += 1;
    return result;
  }, { planets: 0, moons: 0, asteroids: 0 });

  setText(elements.total, state.bodies.length);
  setText(elements.planets, summary.planets);
  setText(elements.moons, summary.moons);
  setText(elements.asteroids, summary.asteroids);
  setText(elements.note, "4 body groups in one simple catalog view.");
}

function bindEvents() {
  elements.search.addEventListener("input", renderCards);
  elements.filter.addEventListener("change", renderCards);
  elements.sort.addEventListener("change", renderCards);
}

async function init() {
  try {
    showStatus("Loading data", "Fetching the catalog.");
    state.bodies = await loadBodies();
    renderDashboard();
    renderCards();
  } catch (error) {
    elements.grid.innerHTML = "";
    showStatus("Unable to load data", error.message, true);
  }
}

bindEvents();
init();
