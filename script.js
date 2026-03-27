const DATA_SOURCE_URL = "./assets/bodies.json";
const SUPPORTED_BODY_TYPES = ["Planet", "Moon", "Dwarf Planet", "Asteroid"];

const elements = {
  searchInput: document.querySelector("#search"),
  filterSelect: document.querySelector("#filter"),
  sortSelect: document.querySelector("#sort"),
  statusRegion: document.querySelector("#status-region"),
  cardGrid: document.querySelector("#card-grid"),
  resultsSummary: document.querySelector("#results-summary"),
  statTotal: document.querySelector("#stat-total"),
  statPlanets: document.querySelector("#stat-planets"),
  statMoons: document.querySelector("#stat-moons"),
  catalogNote: document.querySelector("#catalog-note"),
  largestBody: document.querySelector("#largest-body"),
  strongestGravity: document.querySelector("#strongest-gravity"),
};

const appState = {
  bodiesData: [],
  filteredBodies: [],
  hasLoadedData: false,
};

// Section 1: API logic
async function fetchBodies() {
  const response = await fetch(DATA_SOURCE_URL);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.bodies ?? [];
}

// Section 2: Data processing
function prepareBodies(bodies) {
  return bodies
    .filter(({ englishName, bodyType }) => englishName && SUPPORTED_BODY_TYPES.includes(bodyType))
    .map((body) => ({
      id: body.id,
      name: body.englishName,
      bodyType: body.bodyType,
      gravity: formatMetric(body.gravity, "m/s²"),
      gravityValue: body.gravity ?? -1,
      density: formatMetric(body.density, "g/cm³"),
      densityValue: body.density ?? -1,
      meanRadius: formatMetric(body.meanRadius, "km"),
      meanRadiusValue: body.meanRadius ?? -1,
      avgTemp: formatTemperature(body.avgTemp),
      moonsCount: typeof body.moonsCount === "number" ? body.moonsCount : 0,
      isPlanet: Boolean(body.isPlanet),
    }))
    .sort((firstBody, secondBody) => firstBody.name.localeCompare(secondBody.name));
}

function applyFiltersAndSort() {
  if (!appState.hasLoadedData) {
    return;
  }

  const searchTerm = elements.searchInput.value.trim().toLowerCase();
  const selectedType = elements.filterSelect.value;
  const sortBy = elements.sortSelect.value;

  const filteredBodies = appState.bodiesData
    .filter((body) => {
      const matchesSearch = body.name.toLowerCase().includes(searchTerm);
      const matchesType = selectedType === "all" || body.bodyType === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((firstBody, secondBody) => sortBodies(firstBody, secondBody, sortBy));

  appState.filteredBodies = filteredBodies;
  renderBodies(filteredBodies);
}

function sortBodies(firstBody, secondBody, sortBy) {
  if (sortBy === "gravity") {
    return compareMetric(secondBody.gravityValue, firstBody.gravityValue, firstBody.name, secondBody.name);
  }

  if (sortBy === "density") {
    return compareMetric(secondBody.densityValue, firstBody.densityValue, firstBody.name, secondBody.name);
  }

  if (sortBy === "radius") {
    return compareMetric(
      secondBody.meanRadiusValue,
      firstBody.meanRadiusValue,
      firstBody.name,
      secondBody.name
    );
  }

  return firstBody.name.localeCompare(secondBody.name);
}

function compareMetric(firstValue, secondValue, firstName, secondName) {
  const metricDifference = firstValue - secondValue;
  return metricDifference !== 0 ? metricDifference : firstName.localeCompare(secondName);
}

function formatMetric(value, unit) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toLocaleString()} ${unit}` : "Unknown";
}

function formatTemperature(value) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toLocaleString()} K` : "Unknown";
}

function setCatalogStats(bodies) {
  const planets = bodies.filter((body) => body.bodyType === "Planet").length;
  const moons = bodies.filter((body) => body.bodyType === "Moon").length;
  const largestBody = bodies.reduce((largest, body) => {
    return body.meanRadiusValue > largest.meanRadiusValue ? body : largest;
  }, bodies[0]);
  const strongestGravity = bodies.reduce((strongest, body) => {
    return body.gravityValue > strongest.gravityValue ? body : strongest;
  }, bodies[0]);

  elements.statTotal.textContent = String(bodies.length);
  elements.statPlanets.textContent = String(planets);
  elements.statMoons.textContent = String(moons);
  elements.catalogNote.textContent = `Catalog spans ${new Set(bodies.map((body) => body.bodyType)).size} body groups for quick comparison.`;
  elements.largestBody.textContent = `${largestBody.name} · ${largestBody.meanRadius}`;
  elements.strongestGravity.textContent = `${strongestGravity.name} · ${strongestGravity.gravity}`;
}

// Section 3: Rendering
function renderBodies(bodies) {
  clearStatus();

  if (!bodies.length) {
    showEmptyState();
    updateResultsSummary(0);
    return;
  }

  const cardsMarkup = bodies
    .map(
      (body, index) => `
        <article class="body-card" data-body-id="${body.id}" style="--card-index:${index}">
          <div class="card-top">
            <div>
              <p class="card-type">${body.bodyType}</p>
              <h3>${body.name}</h3>
            </div>
            <p class="planet-flag">${body.isPlanet ? "Planetary body" : "Solar system object"}</p>
          </div>
          <dl class="metrics-grid">
            <div class="metric">
              <dt>Gravity</dt>
              <dd>${body.gravity}</dd>
              <span class="metric-copy">Surface pull</span>
            </div>
            <div class="metric">
              <dt>Density</dt>
              <dd>${body.density}</dd>
              <span class="metric-copy">Material compactness</span>
            </div>
            <div class="metric">
              <dt>Mean radius</dt>
              <dd>${body.meanRadius}</dd>
              <span class="metric-copy">Average body size</span>
            </div>
            <div class="metric">
              <dt>Temperature</dt>
              <dd>${body.avgTemp}</dd>
              <span class="metric-copy">Approximate average</span>
            </div>
            <div class="metric">
              <dt>Moons</dt>
              <dd>${body.moonsCount}</dd>
              <span class="metric-copy">Known natural satellites</span>
            </div>
            <div class="metric">
              <dt>Type</dt>
              <dd>${body.bodyType}</dd>
              <span class="metric-copy">Catalog classification</span>
            </div>
          </dl>
        </article>
      `
    )
    .join("");

  elements.cardGrid.innerHTML = cardsMarkup;
  updateResultsSummary(bodies.length);
}

function renderSkeletonCards(count = 8) {
  const skeletonMarkup = Array.from({ length: count }, () => {
    return `
      <article class="skeleton-card" aria-hidden="true">
        <span class="skeleton-line skeleton-line--short"></span>
        <span class="skeleton-line skeleton-line--title"></span>
        <span class="skeleton-line"></span>
        <span class="skeleton-line"></span>
        <span class="skeleton-line"></span>
        <p class="skeleton-copy">Loading celestial body data...</p>
      </article>
    `;
  }).join("");

  elements.cardGrid.innerHTML = skeletonMarkup;
}

function updateResultsSummary(count) {
  const selectedType = elements.filterSelect.value;
  const label = selectedType === "all" ? "bodies" : `${selectedType.toLowerCase()}s`;
  elements.resultsSummary.textContent = `${count} ${label} in the current view.`;
}

// Section 4: UI states
function showLoading() {
  renderSkeletonCards();
  elements.statusRegion.innerHTML = `
    <div class="status-card">
      <h3>Loading data</h3>
      <p>Fetching the catalog and preparing the solar system explorer.</p>
    </div>
  `;
  elements.resultsSummary.textContent = "Loading solar system data.";
}

function showError(message) {
  elements.cardGrid.innerHTML = "";
  elements.statusRegion.innerHTML = `
    <div class="status-card status-card--error">
      <h3>Unable to load data</h3>
      <p>${message}</p>
    </div>
  `;
  elements.resultsSummary.textContent = "No data loaded.";
}

function showEmptyState() {
  elements.cardGrid.innerHTML = "";
  elements.statusRegion.innerHTML = `
    <div class="status-card">
      <h3>No results found</h3>
      <p>Try another search term or body type filter.</p>
    </div>
  `;
}

function clearStatus() {
  elements.statusRegion.innerHTML = "";
}

function getFriendlyErrorMessage() {
  return "Something went wrong while loading the celestial body catalog. Start the project with a local server and try again.";
}

// Section 5: Event listeners
async function initializeApp() {
  await loadBodies();
}

async function loadBodies() {
  try {
    showLoading();
    const bodies = await fetchBodies();
    appState.bodiesData = prepareBodies(bodies);
    appState.hasLoadedData = true;
    setCatalogStats(appState.bodiesData);
    applyFiltersAndSort();
  } catch (error) {
    appState.hasLoadedData = false;
    showError(getFriendlyErrorMessage(error));
  }
}

function bindEvents() {
  elements.searchInput.addEventListener("input", applyFiltersAndSort);
  elements.filterSelect.addEventListener("change", applyFiltersAndSort);
  elements.sortSelect.addEventListener("change", applyFiltersAndSort);
}

bindEvents();
initializeApp();
