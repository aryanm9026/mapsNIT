let userMarker = null;
let userAccuracyCircle = null;
let autoFollow = true;

function makePulsingIcon() {
  return L.divIcon({
    className: "",
    html: '<div class="pulse-marker pulse-flicker"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}


function smoothMoveMarker(marker, fromLatLng, toLatLng, duration = 500) {
  const start = performance.now();

  function animate(time) {
    const progress = Math.min((time - start) / duration, 1);

    const lat = fromLatLng.lat + (toLatLng.lat - fromLatLng.lat) * progress;
    const lng = fromLatLng.lng + (toLatLng.lng - fromLatLng.lng) * progress;

    marker.setLatLng([lat, lng]);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// --- User position updates ---
function handlePosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  let speed = Math.floor(position.coords.speed);
  speed = Math.floor((speed * 18) / 5);
  if (speed < 1) {
    speed = 0;
  }

  document.getElementById("speed").innerHTML =
    speed != null ? `${speed} Km/hr` : "No speed data";

  const speedDiv = document.getElementById("speed");

  if (speed !== null && !isNaN(speed)) {
    speedDiv.innerHTML = `${speed} Km/hr`;

    if (speed > 40) {
      speedDiv.classList.add("over-speed");
    } else {
      speedDiv.classList.remove("over-speed");
    }
  } else {
    speedDiv.innerHTML = "No speed data";
  }

  const newLatLng = L.latLng(lat, lng);

  if (!userMarker) {
    userMarker = L.marker(newLatLng, {
      icon: makePulsingIcon(),
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindPopup("📍 You are here")
      .openPopup();
  } else {
    const oldLatLng = userMarker.getLatLng();
    smoothMoveMarker(userMarker, oldLatLng, newLatLng, 600);
  }

  if (userAccuracyCircle) map.removeLayer(userAccuracyCircle);
  userAccuracyCircle = L.circle(newLatLng, {
    radius: position.coords.accuracy || 20,
    color: "#2680ff",
    weight: 1,
    fillColor: "#2680ff",
    fillOpacity: 0.12,
  }).addTo(map);

  if (autoFollow) {
    map.panTo(newLatLng, { animate: true, duration: 0.5 });
  }
}

map.on("dragstart", () => {
  autoFollow = false;
});

window.enableFollowMe = function () {
  autoFollow = true;
  if (userMarker) {
    map.panTo(userMarker.getLatLng(), { animate: true, duration: 0.5 });
  }
};

// --- Start watching user location ---
navigator.geolocation.watchPosition(handlePosition, console.error, {
  enableHighAccuracy: true,
  maximumAge: 1000,
  timeout: 10000,
});
/**
 * Finds the nearest POI from the global 'poiList' array.
 * (Assumes 'poiList' is loaded from poiData.js)
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @returns {object|null} The nearest POI object, or null if not found.
 */
function findNearestPoi(userLat, userLng) {
  if (!window.poiList || !Array.isArray(window.poiList) || window.poiList.length === 0) {
    console.error("poiList is not loaded or is empty. Check poiData.js.");
    return null;
  }

  let nearestPoi = null;
  let minDistance = Infinity;
  const userLatLng = L.latLng(userLat, userLng);

  for (const poi of window.poiList) {
    
    // --- THIS IS THE FIX ---
    // Check if 'coords' is an array with 2 numbers
    if (poi.coords && Array.isArray(poi.coords) && poi.coords.length === 2) {
      
      // Use coords[0] for lat and coords[1] for lng
      const poiLatLng = L.latLng(poi.coords[0], poi.coords[1]);
      const distance = userLatLng.distanceTo(poiLatLng);

      if (distance < minDistance) {
        minDistance = distance;
        nearestPoi = poi;
      }
    } else {
      console.warn("DEBUG: Skipping a POI with invalid 'coords':", poi.name);
    }
    // --- END FIX ---
  }

  if (nearestPoi) {
    console.log(`DEBUG: The nearest POI is ${nearestPoi.name} at ${minDistance} meters.`);
  } else {
    console.warn("DEBUG: Could not find any nearest POI.");
  }

  return nearestPoi;
}

window.locateUser = function () {
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // We got the user's location
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      console.log("chala 1");

      // --- NEW FEATURE LOGIC ---
      // Call our new helper function
      const nearest = findNearestPoi(lat, lng);

      // Create the popup message
      console.log(nearest.name)
      let popupMessage = "📍 You are here"; // Default message
      if (nearest) {
        // 'nearest' is an object like {name: "Main Gate", ...}
        popupMessage = `📍 You are near <b>${nearest.name}</b>`;
      }
      // --- END NEW FEATURE ---
      
      const customIcon = L.icon({
        iconUrl: "../imgs/yaha.png",
        iconSize: [40, 40],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Using 'locationPin' to avoid conflict with your global 'userMarker'
      const locationPin = L.marker([lat, lng], {
        title: "idhar toh dekho !",
        icon: customIcon,
      })
        .addTo(map)
        .bindPopup(popupMessage) // Use the new dynamic message
        .openPopup();

      map.setView([lat, lng], 18, { animate: true });
    },

    (error) => {
      console.error("Error getting location:", error);
      alert("Unable to retrieve your location. Please allow location access.");
    }
  );
};

window.openSphinx = function () {
  window.location.href = "https://sphinx.org.in";
}

window.openAboutUs = function () {
  window.location.href = "aboutus.html";
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((err) => console.error("SW registration failed:", err));
}
