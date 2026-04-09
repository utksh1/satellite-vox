const REMOTE_BODIES_API_URL =
  "https://api.npoint.io/c6741171d735a632cefc/bodies";
const LOCAL_BODIES_JSON_URL = "./assets/bodies.json";
const ALLOWED_BODY_TYPES = ["Planet", "Moon", "Dwarf Planet", "Asteroid"];

const ui = {
  searchInput: document.querySelector("#search"),
  filterSelect: document.querySelector("#filter"),
  sortSelect: document.querySelector("#sort"),
  statusRegion: document.querySelector("#status-region"),
  cardGrid: document.querySelector("#card-grid"),
  resultsSummary: document.querySelector("#results-summary"),
  statTotal: document.querySelector("#stat-total"),
  statPlanets: document.querySelector("#stat-planets"),
  statMoons: document.querySelector("#stat-moons"),
  statAsteroids: document.querySelector("#stat-asteroids"),
  catalogNote: document.querySelector("#catalog-note"),
  largestBodyName: document.querySelector("#largest-body-name"),
  largestBodyRadius: document.querySelector("#largest-body-radius"),
  largestBodyDescription: document.querySelector("#largest-body-description"),
  featurePrimaryLabel: document.querySelector("#feature-stat-label-primary"),
  strongestGravity: document.querySelector("#strongest-gravity"),
  featureBodyType: document.querySelector("#feature-body-type"),
  featureAverageTemp: document.querySelector("#feature-average-temp"),
  featureMoonsCount: document.querySelector("#feature-moons-count"),
  featurePlanetStatus: document.querySelector("#feature-planet-status"),
  featureExtraContainer: document.querySelector("#feature-extra-container"),
  featureExtraLabel: document.querySelector("#feature-extra-label"),
  featureExtraValue: document.querySelector("#feature-extra-value"),
};

function updateText(id, value) {
  if (ui[id]) {
    ui[id].textContent = value;
  }
}

function getHsl(hue, offset, s, l) {
  return `hsl(${(hue + offset) % 360}, ${s}%, ${l}%)`;
}


const catalogState = {
  bodiesData: [],
  filteredBodies: [],
  hasLoadedData: false,
};

async function fetchCatalogBodies() {
  try {
    const response = await fetch(REMOTE_BODIES_API_URL, { cache: "no-store" });

    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : (data.bodies ?? []);
    }
  } catch (error) {
    console.warn(
      "Remote catalog unavailable. Falling back to local JSON.",
      error,
    );
  }

  const localResponse = await fetch(LOCAL_BODIES_JSON_URL, {
    cache: "no-store",
  });

  if (!localResponse.ok) {
    throw new Error(
      `Local fallback failed with status ${localResponse.status}`,
    );
  }

  const localData = await localResponse.json();
  return Array.isArray(localData) ? localData : (localData.bodies ?? []);
}

function normalizeBodies(bodies) {
  return bodies
    .filter(
      ({ englishName, bodyType }) =>
        englishName && ALLOWED_BODY_TYPES.includes(bodyType),
    )
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
      catalogCode: buildCatalogCode(body),
      summary: getBodySummary(body),
      imageUrl: body.image ?? body.imageUrl ?? generateCardArtwork(body),
    }))
    .sort((firstBody, secondBody) =>
      firstBody.name.localeCompare(secondBody.name),
    );
}

function buildCatalogCode(body) {
  const prefixMap = {
    Planet: "SOL",
    Moon: "LUN",
    "Dwarf Planet": "DWF",
    Asteroid: "AST",
  };

  const compressedName = body.englishName
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();

  return `${prefixMap[body.bodyType] ?? "OBJ"}-${compressedName || "CAT"}`;
}

function getBodySummary(body) {
  if (body.summary) {
    return body.summary;
  }

  const bodyTypeCopy = {
    Planet:
      "Major planetary body with enough scale for direct surface and density comparison.",
    Moon: "Natural satellite tracked for orbital context, gravity, and companion count.",
    "Dwarf Planet":
      "Outer-system body retained for edge-case comparison across mass and scale.",
    Asteroid:
      "Minor rocky object included to keep the archive broader than a planet-only list.",
  };

  return (
    bodyTypeCopy[body.bodyType] ??
    "Catalog object prepared for quick comparison."
  );
}

function generateCardArtwork(body) {
  const seed = body.englishName
    .split("")
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const hue = body.englishName === "Earth" ? 210 : seed % 360; // 210 is Earth Blue
  const starOneX = 90 + (seed % 220);
  const starOneY = 40 + (seed % 150);
  const starTwoX = 430 + (seed % 210);
  const starTwoY = 70 + (seed % 180);
  const starThreeX = 620 + (seed % 120);
  const starThreeY = 120 + (seed % 140);

  const sceneMap = {
    Planet: buildPlanetScene(seed, hue),
    Moon: buildMoonScene(seed, hue),
    "Dwarf Planet": buildDwarfPlanetScene(seed, hue),
    Asteroid: buildAsteroidScene(seed, hue),
  };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-label="${escapeSvg(body.name)}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#05080d" />
          <stop offset="55%" stop-color="#0a1018" />
          <stop offset="100%" stop-color="#141d27" />
        </linearGradient>
        <radialGradient id="glow" cx="${18 + (seed % 40)}%" cy="${18 + (seed % 25)}%" r="65%">
          <stop offset="0%" stop-color="hsla(${hue}, 85%, 68%, 0.24)" />
          <stop offset="100%" stop-color="hsla(${hue}, 85%, 68%, 0)" />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#bg)" />
      <rect width="800" height="1000" fill="url(#glow)" />
      <circle cx="${starOneX}" cy="${starOneY}" r="2.1" fill="rgba(255,255,255,0.7)" />
      <circle cx="${starTwoX}" cy="${starTwoY}" r="1.8" fill="rgba(255,255,255,0.6)" />
      <circle cx="${starThreeX}" cy="${starThreeY}" r="1.4" fill="rgba(255,255,255,0.5)" />
      ${sceneMap[body.bodyType] ?? buildPlanetScene(seed, hue)}
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildPlanetScene(seed, hue) {
  const bandA = getHsl(hue, 12, 58, 64);
  const bandB = getHsl(hue, 34, 64, 48);
  const bandC = getHsl(hue, 80, 34, 30);

  return `
    <defs>
      <radialGradient id="planet-core" cx="38%" cy="30%" r="64%">
        <stop offset="0%" stop-color="${bandA}" />
        <stop offset="62%" stop-color="${bandB}" />
        <stop offset="100%" stop-color="${bandC}" />
      </radialGradient>
      <linearGradient id="planet-shade" x1="0" x2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
        <stop offset="100%" stop-color="rgba(0,0,0,0.55)" />
      </linearGradient>
      <clipPath id="planet-clip">
        <circle cx="360" cy="420" r="250" />
      </clipPath>
    </defs>
    <g>
      <circle cx="360" cy="420" r="250" fill="url(#planet-core)" />
      <g clip-path="url(#planet-clip)" opacity="0.92">
        <ellipse cx="360" cy="250" rx="280" ry="48" fill="${bandB}" opacity="0.55" transform="rotate(-10 360 250)" />
        <ellipse cx="360" cy="330" rx="300" ry="52" fill="${bandA}" opacity="0.62" transform="rotate(-9 360 330)" />
        <ellipse cx="360" cy="420" rx="320" ry="66" fill="${bandC}" opacity="0.38" transform="rotate(-8 360 420)" />
        <ellipse cx="360" cy="520" rx="300" ry="56" fill="${bandA}" opacity="0.54" transform="rotate(-8 360 520)" />
        <ellipse cx="360" cy="620" rx="280" ry="52" fill="${bandB}" opacity="0.48" transform="rotate(-7 360 620)" />
      </g>
      <circle cx="360" cy="420" r="250" fill="url(#planet-shade)" opacity="0.45" />
      <ellipse cx="360" cy="420" rx="410" ry="95" fill="none" stroke="rgba(236,219,187,0.36)" stroke-width="24" transform="rotate(-14 360 420)" />
      <ellipse cx="360" cy="420" rx="330" ry="66" fill="none" stroke="rgba(15,21,30,0.9)" stroke-width="20" transform="rotate(-14 360 420)" />
    </g>
  `;
}

function buildMoonScene(seed, hue) {
  const base = getHsl(hue, 190, 18, 76);
  const shadow = getHsl(hue, 205, 20, 30);

  return `
    <defs>
      <radialGradient id="moon-core" cx="36%" cy="28%" r="66%">
        <stop offset="0%" stop-color="${base}" />
        <stop offset="68%" stop-color="hsl(${(hue + 200) % 360}, 14%, 56%)" />
        <stop offset="100%" stop-color="${shadow}" />
      </radialGradient>
    </defs>
    <g>
      <circle cx="360" cy="430" r="245" fill="url(#moon-core)" />
      <circle cx="280" cy="330" r="34" fill="rgba(65,79,92,0.32)" />
      <circle cx="450" cy="390" r="22" fill="rgba(65,79,92,0.28)" />
      <circle cx="340" cy="520" r="42" fill="rgba(65,79,92,0.26)" />
      <circle cx="500" cy="560" r="26" fill="rgba(65,79,92,0.2)" />
      <circle cx="250" cy="560" r="18" fill="rgba(255,255,255,0.08)" />
      <circle cx="360" cy="430" r="245" fill="rgba(7,10,14,0.22)" />
    </g>
  `;
}

function buildDwarfPlanetScene(seed, hue) {
  const ice = getHsl(hue, 165, 38, 72);
  const iceShadow = getHsl(hue, 210, 34, 34);

  return `
    <defs>
      <radialGradient id="dwarf-core" cx="34%" cy="26%" r="66%">
        <stop offset="0%" stop-color="${ice}" />
        <stop offset="60%" stop-color="hsl(${(hue + 180) % 360}, 28%, 56%)" />
        <stop offset="100%" stop-color="${iceShadow}" />
      </radialGradient>
    </defs>
    <g>
      <circle cx="370" cy="430" r="232" fill="url(#dwarf-core)" />
      <path d="M180 420c120-90 254-126 424-85" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="18" stroke-linecap="round" />
      <path d="M196 500c104-70 250-108 388-74" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="14" stroke-linecap="round" />
      <circle cx="370" cy="430" r="232" fill="rgba(5,8,12,0.22)" />
    </g>
  `;
}

function buildAsteroidScene(seed, hue) {
  const rock = getHsl(hue, 28, 32, 42);
  const rockLight = getHsl(hue, 35, 42, 58);

  return `
    <defs>
      <linearGradient id="asteroid-sky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(241,187,128,0.18)" />
        <stop offset="100%" stop-color="rgba(12,15,22,0)" />
      </linearGradient>
      <radialGradient id="asteroid-rock" cx="32%" cy="28%" r="78%">
        <stop offset="0%" stop-color="${rockLight}" />
        <stop offset="75%" stop-color="${rock}" />
        <stop offset="100%" stop-color="hsl(${(hue + 22) % 360}, 26%, 20%)" />
      </radialGradient>
    </defs>
    <rect width="800" height="1000" fill="url(#asteroid-sky)" />
    <path d="M130 702c92-74 228-108 334-92 112 16 146 75 206 80v218H130Z" fill="url(#asteroid-rock)" />
    <path d="M0 820c120-46 216-52 324-28 86 20 134 50 210 60 70 10 154 4 266-32V1000H0Z" fill="hsl(${(hue + 20) % 360}, 36%, 18%)" />
    <circle cx="510" cy="660" r="36" fill="rgba(18,12,10,0.26)" />
    <circle cx="328" cy="642" r="22" fill="rgba(255,255,255,0.08)" />
    <circle cx="648" cy="160" r="74" fill="rgba(255,223,161,0.24)" />
  `;
}

function escapeSvg(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function filterBodiesBySearchQuery(bodies, searchTerm) {
  return bodies.filter((body) =>
    body.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
}

function filterBodiesByType(bodies, selectedType) {
  return bodies.filter(
    (body) => selectedType === "all" || body.bodyType === selectedType,
  );
}

function sortBodiesBySelection(bodies, sortBy) {
  return [...bodies].sort((firstBody, secondBody) =>
    compareBodiesForSort(firstBody, secondBody, sortBy),
  );
}

function compareBodiesForSort(firstBody, secondBody, sortBy) {
  if (sortBy === "gravity") {
    return compareNumericValues(
      firstBody.gravityValue,
      secondBody.gravityValue,
      firstBody.name,
      secondBody.name,
    );
  }

  if (sortBy === "density") {
    return compareNumericValues(
      firstBody.densityValue,
      secondBody.densityValue,
      firstBody.name,
      secondBody.name,
    );
  }

  return firstBody.name.localeCompare(secondBody.name);
}

function compareNumericValues(firstValue, secondValue, firstName, secondName) {
  const metricDifference = firstValue - secondValue;
  return metricDifference !== 0
    ? metricDifference
    : firstName.localeCompare(secondName);
}

function applySearchFilterAndSort() {
  if (!catalogState.hasLoadedData) {
    return;
  }

  const searchTerm = ui.searchInput.value.trim();
  const selectedType = ui.filterSelect.value;
  const sortBy = ui.sortSelect.value;

  const searchedBodies = filterBodiesBySearchQuery(
    catalogState.bodiesData,
    searchTerm,
  );
  const filteredBodies = filterBodiesByType(searchedBodies, selectedType);
  const sortedBodies = sortBodiesBySelection(filteredBodies, sortBy);

  catalogState.filteredBodies = sortedBodies;
  renderBodyCards(sortedBodies);
}

function formatMetric(value, unit) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${value.toLocaleString()} ${unit}`
    : "Unknown";
}

function formatTemperature(value) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${value.toLocaleString()} K`
    : "Unknown";
}

function renderCatalogSnapshot(bodies) {
  const planetCount = bodies.filter(
    (body) => body.bodyType === "Planet",
  ).length;
  const moonCount = bodies.filter((body) => body.bodyType === "Moon").length;
  const asteroidCount = bodies.filter(
    (body) => body.bodyType === "Asteroid",
  ).length;
  const featuredBody =
    bodies.find((body) => body.name === "Earth") || bodies[0];

  const largestBodyByRadius = bodies.reduce((largest, body) => {
    return body.meanRadiusValue > largest.meanRadiusValue ? body : largest;
  }, bodies[0]);

  ui.statTotal.textContent = String(bodies.length);
  ui.statPlanets.textContent = String(planetCount);
  ui.statMoons.textContent = String(moonCount);
  if (ui.statAsteroids) {
    ui.statAsteroids.textContent = String(asteroidCount);
  }
  ui.catalogNote.textContent = `${new Set(bodies.map((body) => body.bodyType)).size} body groups stay available inside one live comparison view.`;

  if (ui.largestBodyName) {
    ui.largestBodyName.textContent = largestBodyByRadius.name;
  }

  if (ui.largestBodyRadius) {
    ui.largestBodyRadius.textContent = largestBodyByRadius.meanRadius;
  }

  renderFeatureSection(featuredBody);
}

function renderFeatureSection(body) {
  if (!body) return;

  const isEarth = body.englishName === "Earth";

  // Use localized "updateText" helper
  updateText("largestBodyName", body.name);
  updateText("largestBodyRadius", isEarth ? "6,371 km" : body.meanRadius);
  updateText("largestBodyDescription", isEarth 
    ? "Our home planet, the only known world in the universe to harbor life. Built upon diverse continents and vast liquid oceans, Earth features a stable nitrogen-oxygen atmosphere and a protective magnetosphere that sustains a global biosphere."
    : body.summary);
  
  updateText("featurePrimaryLabel", isEarth ? "Standard Gravity" : `${body.name} Gravity`);
  updateText("strongestGravity", isEarth ? "9.81 m/s²" : body.gravity);
  updateText("featureBodyType", body.bodyType);
  updateText("featureAverageTemp", isEarth ? "15°C (288 K)" : body.avgTemp);
  updateText("featureMoonsCount", String(body.moonsCount));
  updateText("featurePlanetStatus", isEarth ? "Biological Sanctuary" : (body.isPlanet ? "Major Planet" : body.bodyType));

  // Specialized hardcoded Earth Data
  if (ui.featureExtraContainer) {
    if (isEarth) {
      ui.featureExtraContainer.style.display = "flex";
      updateText("featureExtraLabel", "Atmosphere");
      updateText("featureExtraValue", "78% Nitrogen / 21% O2");
    } else {
      ui.featureExtraContainer.style.display = "none";
    }
  }
}

function renderBodyCards(bodies) {
  clearStatusMessage();

  if (!bodies.length) {
    showEmptyState();
    renderResultsSummary(0);
    return;
  }

  const cardsMarkup = bodies
    .map(
      (body, index) => `
        <article class="body-card" data-body-id="${body.id}" style="--card-index:${index}">
          <div class="card-media">
            <img
              class="card-media-image"
              src="${body.imageUrl}"
              alt="${body.name}"
              loading="${index < 4 ? "eager" : "lazy"}"
              decoding="async"
              fetchpriority="${index < 4 ? "high" : "low"}"
            />
            <div class="card-media-top">
              <span class="card-code">${body.catalogCode}</span>
            </div>
            <div class="card-overlay">
              <span class="card-type">${body.bodyType}</span>
              <h3 class="card-title-main">${body.name}</h3>
            </div>
          </div>
          <div class="card-body">
            <p class="card-summary">${body.summary}</p>
            <div class="metric-strip">
              <div class="metric-pill">
                <span class="metric-label">Gravity</span>
                <span class="metric-value">${body.gravity}</span>
              </div>
              <div class="metric-pill">
                <span class="metric-label">Density</span>
                <span class="metric-value">${body.density}</span>
              </div>
              <div class="metric-pill">
                <span class="metric-label">Mean radius</span>
                <span class="metric-value">${body.meanRadius}</span>
              </div>
              <div class="metric-pill">
                <span class="metric-label">Avg. temp</span>
                <span class="metric-value">${body.avgTemp}</span>
              </div>
              <div class="metric-pill">
                <span class="metric-label">Moons</span>
                <span class="metric-value">${body.moonsCount}</span>
              </div>
              <div class="metric-pill">
                <span class="metric-label">Class</span>
                <span class="metric-value">${body.isPlanet ? "Planetary body" : body.bodyType}</span>
              </div>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  ui.cardGrid.innerHTML = cardsMarkup;
  renderResultsSummary(bodies.length);
}

function renderLoadingSkeletonCards(count = 8) {
  const skeletonMarkup = Array.from(
    { length: count },
    () => `
      <article class="skeleton-card" aria-hidden="true">
        <span class="skeleton-block"></span>
        <span class="skeleton-line skeleton-line--short"></span>
        <span class="skeleton-line skeleton-line--title"></span>
        <span class="skeleton-line"></span>
        <span class="skeleton-line"></span>
        <p class="skeleton-copy">Loading celestial body data...</p>
      </article>
    `,
  ).join("");

  ui.cardGrid.innerHTML = skeletonMarkup;
}

function renderResultsSummary(count) {
  if (!ui.resultsSummary) {
    return;
  }

  const bodyTypeLabelByFilter = {
    all: "bodies",
    Planet: "planets",
    Moon: "moons",
    "Dwarf Planet": "dwarf planets",
    Asteroid: "asteroids",
  };

  ui.resultsSummary.textContent = `${count} ${bodyTypeLabelByFilter[ui.filterSelect.value] ?? "bodies"} in the current view.`;
}

function showLoading() {
  renderLoadingSkeletonCards();
  ui.statusRegion.innerHTML = `
    <div class="status-card">
      <h3>Loading data</h3>
      <p>Fetching the archive and preparing the planetary catalog.</p>
    </div>
  `;
  renderResultsSummary(0);
}

function showError(message) {
  ui.cardGrid.innerHTML = "";
  ui.statusRegion.innerHTML = `
    <div class="status-card status-card--error">
      <h3>Unable to load data</h3>
      <p>${message}</p>
    </div>
  `;

  if (ui.resultsSummary) {
    ui.resultsSummary.textContent = "No data loaded.";
  }
}

function showEmptyState() {
  ui.cardGrid.innerHTML = "";
  ui.statusRegion.innerHTML = `
    <div class="status-card">
      <h3>No results found</h3>
      <p>Adjust the search term or body type filter to reopen the archive.</p>
    </div>
  `;
}

function clearStatusMessage() {
  ui.statusRegion.innerHTML = "";
}

function buildFriendlyErrorMessage(error) {
  if (window.location.protocol === "file:") {
    return "The browser blocked data fetching on file://. Run the project with a local server or use the remote npoint API.";
  }

  if (!navigator.onLine) {
    return "Network connection lost. Please check your connection and try again.";
  }

  return `The celestial database could not be loaded. ${error?.message ?? "Please try again."}`;
}

async function initializeApp() {
  await loadCatalogBodies();
}

async function loadCatalogBodies() {
  try {
    showLoading();
    const bodies = await fetchCatalogBodies();
    catalogState.bodiesData = normalizeBodies(bodies);
    catalogState.hasLoadedData = true;
    renderCatalogSnapshot(catalogState.bodiesData);
    applySearchFilterAndSort();
  } catch (error) {
    catalogState.hasLoadedData = false;
    showError(buildFriendlyErrorMessage(error));
  }
}

function initializeScrollSpy() {
  const navLinks = document.querySelectorAll(".side-nav a");
  if (!navLinks.length) return;

  const sectionTargets = [];
  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href")?.replace("#", "");
    const sectionElement = targetId ? document.getElementById(targetId) : null;
    if (sectionElement) sectionTargets.push(sectionElement);
  });

  if (!sectionTargets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            if (link.getAttribute("href") === `#${entry.target.id}`) {
              link.classList.add("is-current");
            } else {
              link.classList.remove("is-current");
            }
          });
        }
      });
    },
    { rootMargin: "-20% 0px -50% 0px", threshold: 0 },
  );

  sectionTargets.forEach((sectionElement) => observer.observe(sectionElement));
}

function bindUiEvents() {
  ui.searchInput.addEventListener("input", applySearchFilterAndSort);
  ui.filterSelect.addEventListener("change", applySearchFilterAndSort);
  ui.sortSelect.addEventListener("change", applySearchFilterAndSort);
  initializeScrollSpy();
}

bindUiEvents();
initializeApp();
