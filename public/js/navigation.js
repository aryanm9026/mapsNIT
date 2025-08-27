function buildRoutingGraph(geojson) {
  const graph = {};
  const nodes = {};
  const SNAP_THRESHOLD = 5;
  let edgeCount = 0;

  geojson.features.forEach((feature) => {
    if (feature.geometry.type === "LineString") {
      const coordinates = feature.geometry.coordinates;

      for (let i = 0; i < coordinates.length - 1; i++) {
        const start = snapToNearbyNode(coordinates[i], nodes, SNAP_THRESHOLD);
        const end = snapToNearbyNode(coordinates[i + 1], nodes, SNAP_THRESHOLD);

        if (!nodes[start.id]) {
          nodes[start.id] = {
            id: start.id,
            coords: start.coords,
            lat: start.coords[1],
            lng: start.coords[0],
          };
        }
        if (!nodes[end.id]) {
          nodes[end.id] = {
            id: end.id,
            coords: end.coords,
            lat: end.coords[1],
            lng: end.coords[0],
          };
        }

        const distance = calculateDistance(start.coords, end.coords);

        if (!graph[start.id]) graph[start.id] = {};
        if (!graph[end.id]) graph[end.id] = {};

        if (!graph[start.id][end.id] || graph[start.id][end.id] > distance) {
          graph[start.id][end.id] = distance;
          graph[end.id][start.id] = distance;
          edgeCount++;
        }
      }
    }
  });

  routingGraph = { graph, nodes };
}

function calculateDistance(coord1, coord2) {
  const R = 6371000;
  const lat1 = (coord1[1] * Math.PI) / 180;
  const lat2 = (coord2[1] * Math.PI) / 180;
  const deltaLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const deltaLng = ((coord2[0] - coord1[0]) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function findNearestRoadPoint(coords) {
  if (!routingGraph || !routingGraph.nodes) {
    console.error("Routing graph not available");
    return null;
  }

  let closestNode = null;
  let closestDistance = Infinity;
  let snappedPoint = null;

  Object.values(routingGraph.nodes).forEach((node) => {
    const distance = calculateDistance(coords, node.coords);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestNode = node;
      snappedPoint = node.coords;
    }
  });

  let closestSegmentPoint = null;
  let closestSegmentDistance = Infinity;

  if (pathNetwork && pathNetwork.features) {
    pathNetwork.features.forEach((feature) => {
      if (feature.geometry.type === "LineString") {
        const lineCoords = feature.geometry.coordinates;

        for (let i = 0; i < lineCoords.length - 1; i++) {
          const segmentStart = lineCoords[i];
          const segmentEnd = lineCoords[i + 1];
          const closestPointOnSegment = getClosestPointOnSegment(
            coords,
            segmentStart,
            segmentEnd
          );
          const distanceToSegment = calculateDistance(
            coords,
            closestPointOnSegment
          );

          if (distanceToSegment < closestSegmentDistance) {
            closestSegmentDistance = distanceToSegment;
            closestSegmentPoint = closestPointOnSegment;
          }
        }
      }
    });
  }

  if (closestSegmentPoint && closestSegmentDistance < closestDistance - 10) {
    snappedPoint = closestSegmentPoint;
    closestDistance = closestSegmentDistance;

    let bestNode = null;
    let bestNodeDistance = Infinity;

    Object.values(routingGraph.nodes).forEach((node) => {
      const distance = calculateDistance(closestSegmentPoint, node.coords);
      if (distance < bestNodeDistance) {
        bestNodeDistance = distance;
        bestNode = node;
      }
    });

    closestNode = bestNode;
  }

  return {
    snappedPoint: snappedPoint,
    nearestNode: closestNode,
    distance: closestDistance,
  };
}

function getClosestPointOnSegment(point, segmentStart, segmentEnd) {
  const A = point[0] - segmentStart[0];
  const B = point[1] - segmentStart[1];
  const C = segmentEnd[0] - segmentStart[0];
  const D = segmentEnd[1] - segmentStart[1];

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = segmentStart[0];
    yy = segmentStart[1];
  } else if (param > 1) {
    xx = segmentEnd[0];
    yy = segmentEnd[1];
  } else {
    xx = segmentStart[0] + param * C;
    yy = segmentStart[1] + param * D;
  }

  return [xx, yy];
}

function snapToNearbyNode(coords, existingNodes, threshold) {
  let nearestNode = null;
  let nearestDistance = Infinity;

  Object.values(existingNodes).forEach((node) => {
    const distance = calculateDistance(coords, node.coords);
    if (distance < threshold && distance < nearestDistance) {
      nearestDistance = distance;
      nearestNode = node;
    }
  });

  if (nearestNode) {
    return nearestNode;
  } else {
    return {
      id: coords.join(","),
      coords: coords,
    };
  }
}

function dijkstra(graph, startNodeId, endNodeId) {
  if (!graph[startNodeId]) {
    console.error("Start node not found", startNodeId);
    return [];
  }

  if (!graph[endNodeId]) {
    console.error("End node not found", endNodeId);
    return [];
  }

  const distances = {};
  const previous = {};
  const visited = new Set();

  const queue = [];

  Object.keys(graph).forEach((nodeId) => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  });

  distances[startNodeId] = 0;
  queue.push({ nodeId: startNodeId, distance: 0 });

  let iterations = 0;
  const maxIterations = Object.keys(graph).length * 2;

  while (queue.length > 0 && iterations < maxIterations) {
    iterations++;

    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift();

    if (!current) break;

    const currentNodeId = current.nodeId;
    const currentDistance = current.distance;

    if (visited.has(currentNodeId)) continue;

    visited.add(currentNodeId);

    if (currentNodeId === endNodeId) {
      break;
    }

    if (currentDistance > distances[currentNodeId]) continue;

    const neighbors = graph[currentNodeId] || {};

    Object.keys(neighbors).forEach((neighborId) => {
      if (visited.has(neighborId)) return;

      const edgeWeight = neighbors[neighborId];
      const newDistance = currentDistance + edgeWeight;

      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previous[neighborId] = currentNodeId;

        const existingInQueue = queue.find(
          (item) => item.nodeId === neighborId
        );
        if (!existingInQueue || existingInQueue.distance > newDistance) {
          if (existingInQueue) {
            const index = queue.indexOf(existingInQueue);
            queue.splice(index, 1);
          }
          queue.push({ nodeId: neighborId, distance: newDistance });
        }
      }
    });
  }

  if (distances[endNodeId] === Infinity) {
    console.error("No path found!");
    return [];
  }

  const path = [];
  let currentNodeId = endNodeId;
  let totalDistance = 0;

  while (currentNodeId !== null) {
    path.unshift(currentNodeId);
    if (previous[currentNodeId] !== null) {
      const edgeWeight = graph[previous[currentNodeId]][currentNodeId];
      totalDistance += edgeWeight;
    }
    currentNodeId = previous[currentNodeId];
  }

  return path;
}

function aStar(graph, startNodeId, endNodeId, nodes) {
  if (!graph[startNodeId] || !graph[endNodeId]) {
    console.error("Start or end node not found");
    return [];
  }

  const openSet = [startNodeId];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  function heuristic(nodeId1, nodeId2) {
    const node1 = nodes[nodeId1];
    const node2 = nodes[nodeId2];
    if (!node1 || !node2) return Infinity;
    return calculateDistance(node1.coords, node2.coords);
  }

  Object.keys(graph).forEach((nodeId) => {
    gScore[nodeId] = Infinity;
    fScore[nodeId] = Infinity;
  });

  gScore[startNodeId] = 0;
  fScore[startNodeId] = heuristic(startNodeId, endNodeId);

  while (openSet.length > 0) {
    let current = openSet[0];
    let currentIndex = 0;

    for (let i = 1; i < openSet.length; i++) {
      if (fScore[openSet[i]] < fScore[current]) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    openSet.splice(currentIndex, 1);

    if (current === endNodeId) {
      const path = [];
      let node = current;
      while (node) {
        path.unshift(node);
        node = cameFrom[node];
      }
      return path;
    }

    const neighbors = graph[current] || {};
    Object.keys(neighbors).forEach((neighbor) => {
      const tentativeGScore = gScore[current] + neighbors[neighbor];

      if (tentativeGScore < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, endNodeId);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    });
  }

  return [];
}

function verifyGraphConnectivity() {
  if (!routingGraph || !routingGraph.graph) {
    console.error("No routing graph available");
    return;
  }

  const graph = routingGraph.graph;
  const nodes = Object.keys(graph);
  const visited = new Set();
  const components = [];

  function dfs(node, component) {
    if (visited.has(node)) return;
    visited.add(node);
    component.push(node);

    if (graph[node]) {
      Object.keys(graph[node]).forEach((neighbor) => {
        dfs(neighbor, component);
      });
    }
  }

  nodes.forEach((node) => {
    if (!visited.has(node)) {
      const component = [];
      dfs(node, component);
      components.push(component);
    }
  });

  console.log(`- Connected components: ${components.length}`);
  console.log(
    `- Largest component: ${Math.max(...components.map((c) => c.length))} nodes`
  );

  if (components.length > 1) {
    console.warn("⚠️ Graph has disconnected components - routing may fail");
    components.forEach((comp, i) => {
      if (comp.length > 1) {
        console.log(`  Component ${i + 1}: ${comp.length} nodes`);
      }
    });
  }

  return components;
}

window.navigateTo = function (endCoords) {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  if (!routingGraph || !pathNetwork) {
    alert(
      "Navigation system is still loading. Please wait a moment and try again."
    );
    return;
  }

  verifyGraphConnectivity();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userCoords = [position.coords.longitude, position.coords.latitude];

      if (activeRoute) {
        map.removeLayer(activeRoute);
        activeRoute = null;
      }

      console.log("User location:", userCoords);
      console.log("Destination:", endCoords);

      const startRoadPoint = findNearestRoadPoint(userCoords);
      const endRoadPoint = findNearestRoadPoint(endCoords);

      if (
        !startRoadPoint ||
        !endRoadPoint ||
        !startRoadPoint.nearestNode ||
        !endRoadPoint.nearestNode
      ) {
        alert("Unable to find nearby roads. Please try a different location.");
        return;
      }

      console.log("Start road node:", startRoadPoint.nearestNode.id);
      console.log("End road node:", endRoadPoint.nearestNode.id);

      if (startRoadPoint.nearestNode.id === endRoadPoint.nearestNode.id) {
        console.log(
          "ℹ️ Start and end are at the same road node - creating direct route"
        );

        const directPath = [
          [userCoords[1], userCoords[0]],
          [endCoords[1], endCoords[0]],
        ];

        const directRoute = L.polyline(directPath, {
          color: "#f32121ff",
          weight: 5,
          opacity: 0.9,
        });

        activeRoute = L.layerGroup([directRoute]).addTo(map);
        map.fitBounds(directRoute.getBounds(), { padding: [50, 50] });

        const distance = calculateDistance(userCoords, endCoords);
        const distanceText =
          distance < 1000
            ? `${Math.round(distance)}m`
            : `${(distance / 1000).toFixed(1)}km`;

        alert(`Direct route: ${distanceText}`);
        return;
      }

      let pathNodeIds = dijkstra(
        routingGraph.graph,
        startRoadPoint.nearestNode.id,
        endRoadPoint.nearestNode.id
      );

      if (pathNodeIds.length === 0 && routingGraph.nodes) {
        pathNodeIds = aStar(
          routingGraph.graph,
          startRoadPoint.nearestNode.id,
          endRoadPoint.nearestNode.id,
          routingGraph.nodes
        );
      }

      if (pathNodeIds.length === 0) {
        alert(
          "No route found between the selected locations. The roads may not be connected."
        );
        console.error("❌ Both algorithms failed to find a path");

        console.log(
          "Start node connections:",
          Object.keys(routingGraph.graph[startRoadPoint.nearestNode.id] || {})
        );
        console.log(
          "End node connections:",
          Object.keys(routingGraph.graph[endRoadPoint.nearestNode.id] || {})
        );

        return;
      }

      console.log("Path found with", pathNodeIds.length, "nodes");

      const pathCoords = pathNodeIds
        .map((nodeId) => {
          const node = routingGraph.nodes[nodeId];
          if (!node) {
            console.error("Missing node:", nodeId);
            return null;
          }
          return node.coords;
        })
        .filter((coord) => coord !== null);

      if (pathCoords.length === 0) {
        alert("Error building route path.");
        return;
      }

      const routeLayers = [];

      if (startRoadPoint.distance > 5) {
        const userToRoadLine = L.polyline(
          [
            [userCoords[1], userCoords[0]],
            [startRoadPoint.snappedPoint[1], startRoadPoint.snappedPoint[0]],
          ],
          {
            color: "#FF6B35",
            weight: 3,
            opacity: 0.8,
            dashArray: "10, 10",
          }
        );
        routeLayers.push(userToRoadLine);
      }

      const routeBorder = L.polyline(
        pathCoords.map((coord) => [coord[1], coord[0]]),
        {
          color: "#FFFFFF",
          weight: 8,
          opacity: 0.7,
          lineJoin: "round",
          lineCap: "round",
        }
      );

      const mainRouteLine = L.polyline(
        pathCoords.map((coord) => [coord[1], coord[0]]),
        {
          color: "#f32121ff",
          weight: 6,
          opacity: 0.9,
          lineJoin: "round",
          lineCap: "round",
        }
      );

      routeLayers.push(routeBorder);
      routeLayers.push(mainRouteLine);

      if (endRoadPoint.distance > 5) {
        const roadToDestLine = L.polyline(
          [
            [endRoadPoint.snappedPoint[1], endRoadPoint.snappedPoint[0]],
            [endCoords[1], endCoords[0]],
          ],
          {
            color: "#FF6B35",
            weight: 3,
            opacity: 0.8,
            dashArray: "10, 10",
          }
        );
        routeLayers.push(roadToDestLine);
      }

      const startMarker = L.marker([userCoords[1], userCoords[0]], {
        icon: L.divIcon({
          html: "📍",
          iconSize: [30, 30],
          className: "custom-marker",
        }),
      }).bindPopup("🚶 Start: Your Location");

      const endMarker = L.marker([endCoords[1], endCoords[0]], {
        icon: L.divIcon({
          html: "🎯",
          iconSize: [30, 30],
          className: "custom-marker",
        }),
      }).bindPopup("🏁 Destination");

      routeLayers.push(startMarker);
      routeLayers.push(endMarker);

      activeRoute = L.layerGroup(routeLayers).addTo(map);

      let totalDistance = startRoadPoint.distance; // Walking to road
      for (let i = 0; i < pathCoords.length - 1; i++) {
        totalDistance += calculateDistance(pathCoords[i], pathCoords[i + 1]);
      }
      totalDistance += endRoadPoint.distance; // Walking from road

      const routeBounds = L.latLngBounds([
        [userCoords[1], userCoords[0]],
        [endCoords[1], endCoords[0]],
      ]);
      pathCoords.forEach((coord) => {
        routeBounds.extend([coord[1], coord[0]]);
      });

      map.fitBounds(routeBounds, { padding: [50, 50] });

      // Show route info
      const distanceText =
        totalDistance < 1000
          ? `${Math.round(totalDistance)}m`
          : `${(totalDistance / 1000).toFixed(1)}km`;

      console.log(
        `Shortest route calculated: ${distanceText} via ${pathNodeIds.length} nodes`
      );

      // Show route summary popup
      L.popup()
        .setLatLng([userCoords[1], userCoords[0]])
        .setContent(
          `
          <div style="text-align: center;">
            <h4>🗺️ Shortest Route Found!</h4>
            <p><strong>Distance:</strong> ${distanceText}</p>
            <p><strong>Via:</strong> ${pathNodeIds.length} waypoints</p>
            <button onclick="clearRoute()" style="padding: 5px 10px; margin-top: 5px;">Clear Route</button>
          </div>
        `
        )
        .openOn(map);
    },
    (error) => {
      console.error("❌ Error getting location:", error);
      let errorMessage = "Unable to get your location. ";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += "Please allow location access.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage += "Location request timed out.";
          break;
        default:
          errorMessage += "An unknown error occurred.";
      }

      alert(errorMessage);
    },
    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 60000,
    }
  );
};

// --- Clear current route ---
window.clearRoute = function () {
  if (activeRoute) {
    map.removeLayer(activeRoute);
    activeRoute = null;
  }
};

window.debugRouting = function (startCoords, endCoords) {
  console.log("Debug Mode - Testing routing between specific points");

  if (!routingGraph) {
    console.error("No routing graph available");
    return;
  }

  const startPoint = findNearestRoadPoint(startCoords);
  const endPoint = findNearestRoadPoint(endCoords);

  console.log("Start point:", startPoint);
  console.log("End point:", endPoint);

  if (startPoint && endPoint) {
    const path = dijkstra(
      routingGraph.graph,
      startPoint.nearestNode.id,
      endPoint.nearestNode.id
    );
    console.log("Path result:", path);

    if (path.length > 0) {
      const coords = path.map((nodeId) => routingGraph.nodes[nodeId].coords);
      console.log("Path coordinates:", coords);

      // Calculate and log total distance
      let totalDist = 0;
      for (let i = 0; i < coords.length - 1; i++) {
        totalDist += calculateDistance(coords[i], coords[i + 1]);
      }
      console.log(`Total path distance: ${totalDist.toFixed(0)}m`);
    } else {
      console.log("❌ No path found");
    }
  }
};

window.testGraphQuality = function () {
  if (!routingGraph) {
    console.error("No routing graph available");
    return;
  }

  const graph = routingGraph.graph;
  const nodes = routingGraph.nodes;

  let totalEdges = 0;
  let minEdgeWeight = Infinity;
  let maxEdgeWeight = 0;
  let weightSum = 0;

  Object.keys(graph).forEach((nodeId) => {
    const neighbors = graph[nodeId];
    Object.values(neighbors).forEach((weight) => {
      totalEdges++;
      weightSum += weight;
      minEdgeWeight = Math.min(minEdgeWeight, weight);
      maxEdgeWeight = Math.max(maxEdgeWeight, weight);
    });
  });

  console.log(`Graph Quality Report:`);
  console.log(`- Total edges: ${totalEdges}`);
  console.log(`- Average edge weight: ${(weightSum / totalEdges).toFixed(1)}m`);
  console.log(`- Min edge weight: ${minEdgeWeight.toFixed(1)}m`);
  console.log(`- Max edge weight: ${maxEdgeWeight.toFixed(1)}m`);
  console.log(
    `- Average connections per node: ${(
      totalEdges / Object.keys(graph).length
    ).toFixed(1)}`
  );
};
