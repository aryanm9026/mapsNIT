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
  minZoom: 15,
  maxZoom: 20,
}).setView([26.864, 75.815], 16);

L.tileLayer("../imgs/base.jpg", {
  attribution: "",
  maxZoom: 20,
  minZoom: 15,
  noWrap: true,
}).addTo(map);

let allFeatures = [];
let clusteredPOIs, detailedPOIs;
let activeRoute = null;
let pathNetwork = null;
let routingGraph = null;

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
      color: "#124f95ff",
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
        </div>
      `);
      layer.on("dblclick", () => {
        if (feature.properties.id && feature.properties.name) {
          openBuildingMap(feature.properties.id, feature.properties.name);
        }
      });
    },
  }).addTo(map);

  // --- Paths ---
  const pathLayer = L.geoJSON(paths, {
    style: {
      color: "#796dffff",
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
      color: "#796dffff",
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
  overlay.classList.remove("active");
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
