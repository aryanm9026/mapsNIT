const path = require("path");
const express = require("express");
const fs = require("fs");
const turf = require("@turf/turf");
const GeoJSONPathFinder = require("geojson-path-finder").default;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const paths = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./public/data/paths.geojson"))
);
const pathFinder = new GeoJSONPathFinder(paths);

app.post("/route", (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({ error: "Missing start or end" });
  }


  try {
    let lund = [75.8105302,26.8589208];
    const route = pathFinder.findPath(
      turf.point(start), // [lng, lat]
      turf.point(lund)    // [lng, lat]
    );

    if (!route) {
      return res.status(404).json({ error: "No route found" });
    }

    res.json({ path: route.path });
  } catch (err) {
    console.error("💥 Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`MNIT Map server running → http://localhost:${PORT}`);
});
