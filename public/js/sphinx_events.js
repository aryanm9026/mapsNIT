const extractedEvents = [
  {
    eventName: "24 Hour Hackathon",
    venue: "APJ ABDUL KALAM HALL",
    dates: ["7NOV"]
  },
  {
    eventName: "Minute To Pitch It",
    venue: "MIIC",
    dates: ["7NOV"]
  },
  {
    eventName: "Bears And Bulls",
    venue: "VLTC L109",
    dates: ["7NOV"]
  },
  {
    eventName: "E-sports - Bgmi",
    venue: "RADHAKRISHNAN HALL ",
    dates: ["7NOV"]
  },
  {
    eventName: "Aeroquest",
    venue: "OAT GROUND",
    dates: ["8NOV"]
  },
  {
    eventName: "E-sports - Valorant",
    venue: "RADHAKRISHNAN HALL ",
    dates: ["8NOV"]
  },
  {
    eventName: "Design-x",
    venue: "APJ ABDUL KALAM HALL",
    dates: ["9NOV"]
  },
  {
    eventName: "E-sports - Free Fire",
    venue: "RADHAKRISHNAN HALL",
    dates: ["9NOV"]
  },
  {
    eventName: "EvolveX-projectathon",
    venue: "Deekhsa Sabhagar (Prabha Bhawan)",
    dates: ["8NOV"]
  },
  {
    eventName: "Robowars",
    venue: "VLTC BACK PORCH",
    dates: ["8NOV", "9NOV"]
  },
  {
    eventName: "Decode The Dead",
    venue: "RAMANUJAN HALL",
    dates: ["7NOV", "8NOV"]
  },
  {
    eventName: "Celestia",
    venue: "CENTRAL LAWN",
    dates: ["7NOV"]
  },
  {
    eventName: "Industrial Academia Conclave",
    venue: "Deekhsa Sabhagar (Prabha Bhawan)",
    dates: ["8NOV"]
  },
  {
    eventName: "Ardupilot 101: From Setup To Simulation",
    venue: "VLTC L108",
    dates: ["7NOV"]
  },
  {
    eventName: "Algoverse",
    venue: "VLTC L107",
    dates: ["8NOV"]
  },
  {
    eventName: "Innovations In Quantum Science",
    venue: "VLTC L007",
    dates: ["8NOV"]
  },
  {
    eventName: "Vision Voyage",
    venue: "VLTC L108",
    dates: ["9NOV"]
  },
  {
    eventName: "Equity & Derivatives Investment",
    venue: "VLTC L109",
    dates: ["9NOV"]
  },
  {
    eventName: "Codemane",
    venue: "VLTC L107",
    dates: ["7NOV"]
  },
  {
    eventName: "Cosmic Quest",
    venue: "VLTC L009",
    dates: ["7NOV"]
  },
  {
    eventName: "Rube-a-thon",
    venue: "VLTC L003",
    dates: ["7NOV"]
  },
  {
    eventName: "Capture The Flag",
    venue: "VLTC L106",
    dates: ["7NOV"]
  },
  {
    eventName: "Standards Gone Wrong",
    venue: "VLTC L008",
    dates: ["7NOV"]
  },
  {
    eventName: "Cube Open",
    venue: "VLTC L003",
    dates: ["8NOV"]
  },
  {
    eventName: "Toastmasters",
    venue: "VLTC L108",
    dates: ["8NOV"]
  },
  {
    eventName: "Aero-dynamix",
    venue: "OAT",
    dates: ["9NOV"]
  },
  {
    eventName: "Codecrunch 2.0",
    venue: "VLTC L107",
    dates: ["9NOV"]
  },
  {
    eventName: "Global Crisis Challenge",
    venue: "VLTC L007",
    dates: ["9NOV"]
  },
  {
    eventName: "Quiz Science Trivia",
    venue: "VLTC L002",
    dates: ["9NOV"]
  },
  {
    eventName: "CoDecode",
    venue: "VLTC 2ND FLOOR",
    dates: ["8NOV"]
  },
  {
    eventName: "Cozmoclench",
    venue: "VLTC 2ND FLOOR",
    dates: ["8NOV"]
  },
  {
    eventName: "TFO",
    venue: "VLTC 2ND FLOOR",
    dates: ["8NOV"]
  },
  {
    eventName: "Meshmerize",
    venue: "VLTC 2ND FLOOR",
    dates: ["8NOV"]
  },
  {
    eventName: "SparkX",
    venue: "VLTC 2ND FLOOR",
    dates: ["8NOV"]
  },
// New events that added afterwards
  {
    eventName: "Decode The Scam",
    venue: "VLTC L104",
    dates: ["7NOV"]
  },
  {
    eventName: "Electro Hunt",
    venue: "VLTC L007",
    dates: ["7NOV"]
  },
  {
    eventName: "Corporate Catalyst",
    venue: "VLTC L103",
    dates: ["7NOV"]
  },
  {
    eventName: "Bridge Busters",
    venue: "VLTC L002",
    dates: ["7NOV"]
  },
  {
    eventName: "Interactive Installation Challenge",
    venue: "VLTC L009",
    dates: ["7NOV"]
  },
  {
    eventName: "Matquiz - The Materials Science Quiz",
    venue: "VLTC L008",
    dates: ["8NOV"]
  },
  {
    eventName: "Tambola",
    venue: "VLTC L104",
    dates: ["8NOV"]
  },
  {
    eventName: "Ad Mania",
    venue: "VLTC L103",
    dates: ["8NOV"]
  },
  {
    eventName: "Tremor Tech",
    venue: "VLTC L008",
    dates: ["9NOV"]
  },
  {
    eventName: "The Chemical Challenge",
    venue: "VLTC L103",
    dates: ["9NOV"]
  },
  {
    eventName: "Type Racer",
    venue: "VLTC L004",
    dates: ["9NOV"]
  },
  {
    eventName: "Phaseshift",
    venue: "VLTC L006",
    dates: ["9NOV"]
  },
  {
    eventName: "Cad Master",
    venue: "VLTC L104",
    dates: ["9NOV"]
  },
  {
    eventName: "Bidding War",
    venue: "VLTC L103",
    dates: ["9NOV"]
  }
  // more events
 {
    eventName: "Ai Experience",
    venue: "VLTC L006",
    dates: ["8NOV"]
  },
  {
    eventName: "Power Of Standards",
    venue: "VLTC L008",
    dates: ["8NOV"]
  },
  {
    eventName: "Solvent Stories",
    venue: "VLTC L004",
    dates: ["7NOV"]
  },
  {
    eventName: "Laser Tag",
    venue: "CHESS ROOM",
    dates: ["7NOV", "8NOV", "9NOV"]
  },
  {
    eventName: "Silent Disco",
    venue: "WORLD E-SPORTS HALL",
    dates: ["7NOV", "8NOV", "9NOV"]
  },
  {
    eventName: "Room Of Nostalgia",
    venue: "VIKRAM SARABHAI",
    dates: ["7NOV", "8NOV", "9NOV"]
  },
  {
    eventName: "Fun Fusion Arena",
    venue: "VLTC 2.0 FLOOR",
    dates: ["7NOV", "8NOV", "9NOV"]
  },
  {
    eventName: "Turbo Mania",
    venue: "SAC LAWN",
    dates: ["7NOV", "8NOV", "9NOV"]
  },
  {
    eventName: "Magic Of Ice",
    venue: "VLTC L002",
    dates: ["8NOV"]
  },
  {
    eventName: "Physics Escape Room",
    venue: "VLTC L106",
    dates: ["8NOV"]
  },
  {
    eventName: "Cryx Blackout Protocol",
    venue: "VLTC L106",
    dates: ["9NOV"]
  }
];


