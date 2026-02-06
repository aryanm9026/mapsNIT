function getIcon(category,name) {
  switch(name){
     case "VLTC":
      return L.icon({
        iconUrl: "../imgs/icons/Vltc.png",
        iconSize: [30, 30],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
     case "Night canteen (boys)":
      return L.icon({
        iconUrl: "../imgs/icons/canteen.png",
        iconSize: [30, 30],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
  }
 
  switch (category) {
    case "Departments":
      return L.icon({
        iconUrl: "../imgs/icons/Departments.png",
        iconSize: [40, 40],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
    case "Gate":
      return L.icon({
        iconUrl: "../imgs/icons/gate-icon.png",
        iconSize: [23, 23],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
    case "Hostels":
      return L.icon({
        iconUrl: "../imgs/icons/hostels.png",
        iconSize: [25, 25],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
    case "Cafes":
      return L.icon({
        iconUrl: "../imgs/icons/canteen.png",
        iconSize: [40, 40],
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
    case "VLTC":
      return L.icon({
        iconUrl: "../imgs/icons/Vltc.png",
        iconSize: [40, 40],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
    default:
      return L.icon({
        iconUrl: "../imgs/icons/default-poi.png",
        iconSize: [23, 23],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
  }
}
