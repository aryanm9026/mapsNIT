const fs = require("fs");
const turf = require("@turf/turf");

const pois = JSON.parse(fs.readFileSync("public/data/newpois.geojson"));
const buildings = JSON.parse(fs.readFileSync("public/data/buildings.geojson"));

let clustered = {
  type: "FeatureCollection",
  features: [],
};

buildings.features.forEach((building) => {
  const inside = turf.pointsWithinPolygon(pois, building);

  if (inside.features.length > 0) {
    const coords = turf.center(inside).geometry.coordinates;

    clustered.features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: coords },
      properties: {
        name: building.properties.name || "Unnamed",
        poi_count: inside.features.length,
        merged_pois: inside.features.map((p) => p.properties.name),
      },
    });
  }
});

fs.writeFileSync(
  "public/data/clustered_pois.geojson",
  JSON.stringify(clustered, null, 2)
);
