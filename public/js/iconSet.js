function getIcon(category) {
  switch (category) {
    case "Departments":
      return L.icon({
        iconUrl: "../imgs/icons/education.png",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
    case "Gate":
      return L.icon({
        iconUrl: "../imgs/icons/gate-icon.png",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
    case "Hostels":
      return L.icon({
        iconUrl: "../imgs/icons/hostel-icon.png",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
    case "Cafes":
      return L.icon({
        iconUrl: "../imgs/icons/cafe-icon.png",
        iconSize: [30, 30],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
    case "Locate":
      return L.icon({
        iconUrl: "../imgs/icons/locate.png",
        iconSize: [40, 40],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
    default:
      return L.icon({
        iconUrl: "../imgs/icons/default-poi.png",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
  }
}
