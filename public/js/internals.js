let indoorMap;
let indoorLayers = {};

function initIndoorMap() {
  if (!indoorMap) {
    indoorMap = L.map("indoorMap", {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
    });
  }
}

// Modal with indoor maps
function openBuildingMap(buildingId, buildingName) {
  console.log(buildingId);
  initIndoorMap();

  document.getElementById("buildingModal").style.display = "block";
  document.getElementById("buildingName").innerText = buildingName;

  // Preload all floors for this building
  if (!indoorLayers[buildingId]) {
    indoorLayers[buildingId] = {};
    Object.entries(indoorMaps[buildingId]).forEach(
      ([floor, { url, bounds }]) => {
        indoorLayers[buildingId][floor] = L.imageOverlay(url, bounds);
      }
    );
  }

  // Floor switcher buttons
  const switcher = document.getElementById("floorSwitcher");
  switcher.innerHTML = "";
  Object.keys(indoorMaps[buildingId]).forEach((floor) => {
    const btn = document.createElement("button");
    btn.textContent = `Floor ${floor}`;
    btn.onclick = () => switchFloor(buildingId, floor, btn);
    switcher.appendChild(btn);
  });
  switchFloor(buildingId, 1, switcher.querySelector("button"));
}

function switchFloor(buildingId, floor, btn) {
  document
    .querySelectorAll("#floorSwitcher button")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  Object.values(indoorLayers[buildingId]).forEach((layer) =>
    indoorMap.removeLayer(layer)
  );

  indoorLayers[buildingId][floor].addTo(indoorMap);
  indoorMap.fitBounds(indoorMaps[buildingId][floor].bounds);
}

document.getElementById("closeModal").onclick = () => {
  document.getElementById("buildingModal").style.display = "none";
};
