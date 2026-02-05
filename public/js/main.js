if (localStorage.getItem("visited")) {
  document.getElementById("intro-screen").style.display = "none";
} else {
  setTimeout(() => {
    const m = document.getElementById("m");
    const txtchng = document.getElementById("chng");

    m.style.transform = "translateX(-10px)";

    txtchng.style.maxWidth = "100px";
  }, 2000);
  setTimeout(() => {
    const intro = document.getElementById("intro-screen");
    intro.style.opacity = "0"; // fade out
    setTimeout(() => (intro.style.display = "none"), 3000);
    localStorage.setItem("visited", "true");
  }, 3000);
  document.querySelector(".modol").classList.add("show");
  document.querySelector(".close-modol").addEventListener("click", () => {
    document.querySelector(".modol").classList.remove("show");
  });
}

const map = L.map("map", {
  zoomControl: true,
  preferCanvas: true,
  minZoom: 15,
  maxZoom: 20,
}).setView([26.864, 75.815], 16);

L.tileLayer("../imgs/base.jpg", {
  attribution: "",
  maxZoom: 20,
  minZoom: 15,
  noWrap: true,
  dimOutside: true,
}).addTo(map);

let allFeatures = [];
let clusteredPOIs, detailedPOIs;
let activeRoute = null;
let pathNetwork = null;
let routingGraph = null;
// --- Confirmation Modal Logic ---
// We get the elements ONCE, at the start.
let buildingToOpen = null;
const confirmModal = document.getElementById("confirmModal");
const confirmBtnYes = document.getElementById("confirmBtnYes");
const confirmBtnNo = document.getElementById("confirmBtnNo");
const confirmBuildingName = document.getElementById("confirmBuildingName");

// We set the "Yes" click listener ONCE.
confirmBtnYes.onclick = () => {
  if (buildingToOpen) {
    // This function is in your internal.js file
    openBuildingMap(buildingToOpen.id, buildingToOpen.name);
  }
  confirmModal.style.display = "none"; // Hide confirmation modal
  buildingToOpen = null;
};

// We set the "No" click listener ONCE.
confirmBtnNo.onclick = () => {
  confirmModal.style.display = "none"; // Hide confirmation modal
  buildingToOpen = null;
};
// --- End of Confirmation Modal Logic ---F
// --- All GeoJSON data ---
Promise.all([
  fetch("/data/campus_boundary.geojson").then((res) => res.json()),
  fetch("/data/buildings.geojson").then((res) => res.json()),
  fetch("/data/paths.geojson").then((res) => res.json()),
  fetch("/data/clustered_pois.geojson").then((res) => res.json()),
  fetch("/data/pois.geojson").then((res) => res.json()),
]).then(([boundary, buildings, paths, clustered, detailed]) => {
  pathNetwork = paths;
  buildRoutingGraph(paths);

  // --- Campus boundary ---
  const campusLayer = L.geoJSON(boundary, {
    style: {
      color: "#7d4803ff",
      weight: 10,
      opacity: 1,
      padding: "20px",
      lineJoin: "round",
      lineCap: "round",
    },
  }).addTo(map);
  map.fitBounds(campusLayer.getBounds());
  dimOutside(boundary);

  // --- Buildings ---
  L.geoJSON(buildings, {
    style: {
      color: "#b4b4b4ff",
      weight: 1.5,
    },
    onEachFeature: (feature, layer) => {
      allFeatures.push(layer);
      layer.bindPopup(`
        <div class="popup-content">
          <div class="popup-title">${
            feature.properties.name || "Building"
          }</div>
          <div class="popup-desc">${feature.properties.description || ""}</div>
          <button class="navigate-btn" onclick="navigateTo([${
            layer.getBounds().getCenter().lng
          }, ${layer.getBounds().getCenter().lat}])">
            Navigate
          </button>
          <button class="popup-btn" onclick="openBuildingMap('${feature.properties.id}', '${feature.properties.name}')">
      Open Internal Map
    </button>
        </div>
      `);
      layer.on("click", () => {
       const buildingId = feature.properties.id;
      const buildingName = feature.properties.name || "Building";
      buildingToOpen = { id: buildingId, name: buildingName };
      confirmBuildingName.innerText = buildingName;
      confirmModal.style.display = "none";
        document.getElementById("confirmBtnYes").addEventListener("click",(e)=>{
                    if (feature.properties.id && feature.properties.name) {
                    openBuildingMap(feature.properties.id, feature.properties.name);
                    document.getElementById("confirmModal").style.display = "none"

        }
        })

      });
    },
  }).addTo(map);

  // --- Paths ---
  const pathLayer = L.geoJSON(paths, {
    style: {
      color: "#f69700ff",
      weight: 4.5,
      opacity: 1,
      lineJoin: "round",
      lineCap: "round",
    },
  }).addTo(map);

  map.on("zoomend", () => {
    const zoom = map.getZoom();
    const newWeight = 3 * Math.pow(1.5, zoom - 15);
    pathLayer.setStyle({
      color: "#f69700ff",
      weight: newWeight,
      opacity: 1,
      lineJoin: "round",
      lineCap: "round",
    });
    updateMask();
  });

  // --- Clustered POIs (default) ---
  clusteredPOIs = L.geoJSON(clustered, {
    pointToLayer: (feature, latlng) =>
      L.marker(latlng, { icon: getIcon(feature.properties.category) })
        .bindPopup(`
          <div class="popup-content">
            <div class="popup-title">${feature.properties.name}</div>
            <div class="popup-desc">${
              feature.properties.poi_count || 1
            } POIs merged</div>
            <div class="popup-desc">${
              feature.properties.description || ""
            }</div>
            <button class="navigate-btn" onclick="navigateTo([${latlng.lng}, ${
        latlng.lat
      }])">
              Navigate
            </button>
          </div>
        `),
  }).addTo(map);

  // --- Detailed POIs (hidden) ---
  detailedPOIs = L.geoJSON(detailed, {
    pointToLayer: (feature, latlng) =>
      L.marker(latlng, { icon: getIcon(feature.properties.category) })
        .bindPopup(`
        <div class="popup-content">
          <div class="popup-title">${feature.properties.name}</div>
          <div class="popup-desc">${feature.properties.description || ""}</div>
          <button class="navigate-btn" onclick="navigateTo([${latlng.lng}, ${
        latlng.lat
      }])">
            Navigate
          </button>
        </div>
      `),
  });

  map.on("zoomend", () => {
    const zoom = map.getZoom();
    if (zoom >= 19) {
      if (map.hasLayer(clusteredPOIs)) map.removeLayer(clusteredPOIs);
      if (!map.hasLayer(detailedPOIs)) map.addLayer(detailedPOIs);
    } else {
      if (map.hasLayer(detailedPOIs)) map.removeLayer(detailedPOIs);
      if (!map.hasLayer(clusteredPOIs)) map.addLayer(clusteredPOIs);
    }
  });
});

function dimOutside(boundaryGeoJSON) {
  const world = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-180, -90],
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90],
        ],
      ],
    },
  };

  try {
    const mask = turf.difference(world, boundaryGeoJSON.features[0]);
    L.geoJSON(mask, {
      style: {
        fillColor: "#2b2b2b",
        fillOpacity: 0.55,
        stroke: false,
      },
    }).addTo(map);
  } catch (e) {
    console.warn("Turf error", e);
  }
}

function updateMask() {
  const mask = document.getElementById("focusMask");
  if (!mask) return;
  mask.style.display = map.getZoom() >= 20 ? "block" : "none";
}

// --- Category clusters from poiList.js ---
const categories = {
  Departments: L.markerClusterGroup(),
  Hostels: L.markerClusterGroup(),
  Cafes: L.markerClusterGroup(),
  Sports: L.markerClusterGroup(),
};

// --- Search box ---
const searchBox = document.getElementById("search-box");
const suggestions = document.getElementById("suggestions");
let highlightMarker = null;

searchBox.addEventListener("input", () => {
  const q = searchBox.value.trim().toLowerCase();
  suggestions.innerHTML = "";
  if (!q) {
    suggestions.style.display = "none";
    return;
  }

  const nameMatches = poiList.filter((p) => p.name.toLowerCase().includes(q));

  const descMatches = poiList.filter(
    (p) =>
      !p.name.toLowerCase().includes(q) &&
      p.description?.toLowerCase().includes(q)
  );

  const matches = [...nameMatches, ...descMatches];

  if (!matches.length) {
    suggestions.style.display = "none";
    return;
  }

  matches.forEach((poi) => {
    const li = document.createElement("li");

    function highlightMatch(text, query) {
      const regex = new RegExp(`(${query})`, "gi");
      return text.replace(regex, "<strong>$1</strong>");
    }

    if (nameMatches.includes(poi)) {
      li.innerHTML = highlightMatch(poi.name, q);
    } else {
      li.innerHTML = `${highlightMatch(poi.name, q)} › ${highlightMatch(
        poi.description,
        q
      )}`;
    }

    li.onclick = () => goToPOI(poi);
    suggestions.appendChild(li);
  });

  suggestions.style.display = "block";
});

function goToPOI(poi) {
  suggestions.style.display = "none";
  searchBox.value = poi.name;

  if (highlightMarker) map.removeLayer(highlightMarker);

  highlightMarker = L.marker(poi.coords, { icon: getIcon("Locate") })
    .addTo(map)
    .bindPopup(
      `
      <div style="text-align:center;">
        <h3 style="margin:6px 0 4px;">${poi.name}</h3>
        <p class="popup-desc">${poi.description || ""}</p>
        <p><strong>Timings:</strong> ${poi.timings || "-"}</p>
        <button class="navigate-btn" onclick="navigateTo([${poi.coords[1]}, ${
        poi.coords[0]
      }])">Navigate</button>
      </div>
      `
    )
    .openPopup();

  map.setView(poi.coords, 18, { animate: true });
}

function openModal() {
  const overlay = document.getElementById("modalOverlay");
  if (!overlay) return;
  overlay.classList.toggle("active");
  const modal = document.querySelector(".modal");
  if (!modal) return;
  modal.classList.toggle("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  if (!overlay) return;
  overlay.classList.toggle("active");
  document.body.style.overflow = "";
}

function closeModalOnOverlay(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

document.querySelectorAll(".btn, .member-link, .social-link").forEach((el) => {
  el.addEventListener("click", function (e) {
    let ripple = document.createElement("span");
    ripple.classList.add("ripple");
    this.appendChild(ripple);

    let rect = this.getBoundingClientRect();
    ripple.style.left = e.clientX - rect.left + "px";
    ripple.style.top = e.clientY - rect.top + "px";

    setTimeout(() => ripple.remove(), 600);
  });
});


// Replace the events modal section in main.js with this:

// sphinx-events
function getEventDateString(dateObj) {
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${day}${month}`;
}

/**
 * Finds all events scheduled for a specific date.
 */
function findEventsForDate(dateString) {
    return extractedEvents.filter(event => event.dates.includes(dateString));
}

/**
 * Creates and shows the popup modal with the list of events.
 */
function showEventsPopup(events) {
    const modal = document.getElementById('events-modal');
    const eventListElement = document.getElementById('events-list');
    const noEventsMessage = document.getElementById('no-events-msg');

    if (!modal || !eventListElement || !noEventsMessage) {
        console.error("Modal elements not found!");
        return;
    }

    // Clear any old event items
    eventListElement.innerHTML = '';

    if (events.length === 0) {
        // No events, show the "no events" message
        eventListElement.classList.add('hidden');
        noEventsMessage.classList.remove('hidden');
    } else {
        // We have events, hide the "no events" message
        eventListElement.classList.remove('hidden');
        noEventsMessage.classList.add('hidden');

        // Create and add each event to the list
        events.forEach(event => {
            const li = document.createElement('li');
            li.className = 'bg-gray-800 p-4 rounded-lg shadow-md';
            li.innerHTML = `
                <h3 class="font-bold text-lg text-amber-400">${event.eventName}</h3>
                <p class="text-sm text-gray-300">Venue: ${event.venue}</p>
            `;
            eventListElement.appendChild(li);
        });
    }

    // Show the modal
    modal.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    // CHANGED: Use actual current date instead of hardcoded date
    let dateToCheck = new Date();
    
    // For testing specific dates, uncomment one of these:
    // dateToCheck = new Date("November 7, 2025");
    // dateToCheck = new Date("November 8, 2025");
    
    console.log("Checking events for:", dateToCheck);
    const todayString = getEventDateString(dateToCheck);
    console.log("Date string:", todayString);
    const todaysEvents = findEventsForDate(todayString);
    console.log("Found events:", todaysEvents);

    // Always show the popup (even if no events) on every page load
    showEventsPopup(todaysEvents);

    // Add click listener for the close button
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('events-modal');

    if(closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        
        // Optional: Close modal by clicking on the dark background
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
});

function toggleMenu() {
  const menu = document.getElementById("verticalMenu");
  menu.classList.toggle("show");
}

// Optional: Close the menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.menu-trigger')) {
    const menu = document.getElementById("verticalMenu");
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
    }
  }
}