const extractedEvents = [
  
  {
    name: "Rangbhoomi",
    venue: "Neeti Sabhagar",
    coords: [26.8637887, 75.8108025], // Used Prabha Bhawan/Neeti Sabhagar coordinates
    category: "drama club",
    description: "Teams perform self-written stage plays. Judging includes expressions, storyline, lighting, and costumes.",
    timings: "2026-02-08, 12PM-5PM"
  },
  {
    name: "Solo-Spotlight",
    venue: "VLTC L008",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "drama club",
    description: "A mono-act competition testing individual acting skills, storytelling, and voice modulation.",
    timings: "2026-02-07, 9AM - 12:00PM"
  },
  {
    name: "Plot-o-Prop",
    venue: "VLTC L008",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "drama club",
    description: "Improvisational acting and storytelling using random mundane objects.",
    timings: "2026-02-07, 1:30PM - 4PM"
  },
  {
    name: "Breakfree",
    venue: "OAT",
    coords: [26.8619364, 75.8118249], // Used OAT coordinates
    category: "dance club",
    description: "Freestyle dancing competition with single or duo performances.",
    timings: "2026-02-06, 10AM-1PM"
  },
  {
    name: "Glow Dance",
    venue: "VLTC L002",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "dance club",
    description: "Dancing in a dark room enhanced by vibrant lighting props and music.",
    timings: "2026-02-07, 11PM-3PM"
  },
  {
    name: "Catch the hook step",
    venue: "OAT",
    coords: [26.8619364, 75.8118249], // Used OAT coordinates
    category: "dance club",
    description: "A Bollywood themed dance face-off between two participants.",
    timings: "2026-02-08, 10PM-1PM"
  },
  {
    name: "British parliamentary debate",
    venue: "VLTC L106",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "debate club",
    description: "Internationally recognised debating format testing critical thinking and teamwork.",
    timings: "2026-02-06, 10AM-1PM"
  },
  {
    name: "Era encounter",
    venue: "VLTC L106",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "debate club",
    description: "Comparing perspectives of the 1900s and 2100s on society and technology.",
    timings: "2026-02-07, 10AM-1PM"
  },
  {
    name: "MNIT's Got Latent",
    venue: "APJ Abdul Kalam Hall (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "debate club",
    description: "Spontaneous speaking event focusing on self‑assessment and creativity.",
    timings: "2026-02-08, 1PM-5PM"
  },
  {
    name: "Filmy Funda",
    venue: "VLTC L004",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "film making club",
    description: "Workshop covering cinematography, scriptwriting, and production planning.",
    timings: "2026-02-06, 10PM-1PM"
  },
  {
    name: "Lights camera action",
    venue: "VLTC L109",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "film making club",
    description: "Short film challenge simulate a real-world production environment within a limited time.",
    timings: "2026-02-07, 10PM-1PM"
  },
  {
    name: "Mnit film festival",
    venue: "VLTC L108",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "film making club",
    description: "Screening of short films submitted or made during the fest.",
    timings: "2026-02-08, 10PM-2PM"
  },
  {
    name: "Jute art on bottle",
    venue: "CV RAMAN HALL (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "creative arts club",
    description: "Upcycling bottles using jute thread to create decorative hanging art.",
    timings: "2026-02-06, 10:00-12:00PM"
  },
  {
    name: "C.D art",
    venue: "CV RAMAN HALL (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "creative arts club",
    description: "Transforming discarded CDs into mirror-like artworks using cut-and-paste techniques.",
    timings: "2026-02-06, 12:30-2:30PM"
  },
  {
    name: "Jewellry making",
    venue: "CV RAMAN HALL (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "creative arts club",
    description: "Hands-on session to design and craft unique jewelry using beads and strings.",
    timings: "2026-02-06, 3:00-4:30 PM"
  },
  {
    name: "Mandala art",
    venue: "CV RAMAN HALL (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "creative arts club",
    description: "Creating symmetrical mandala artworks using paints and markers.",
    timings: "2026-02-07, 10:00-12:00PM"
  },
  {
    name: "button art",
    venue: "CV RAMAN HALL (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "creative arts club",
    description: "Transforming simple buttons into imaginative patterns and designs.",
    timings: "2026-02-07, 12:30-2:30PM"
  },
  {
    name: "lantern making",
    venue: "CV RAMAN HALL (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "creative arts club",
    description: "Designing and constructing decorative lanterns using origami paper techniques.",
    timings: "2026-02-07, 3:00-4:30 PM"
  },
  {
    name: "keychain making",
    venue: "CV RAMAN HALL (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "creative arts club",
    description: "Designing and crafting unique keychains using air-dry clay.",
    timings: "2026-02-08, 10:00-12:00PM"
  },
  {
    name: "bookmark making",
    venue: "CV RAMAN HALL (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "creative arts club",
    description: "Designing personalized bookmarks using various art materials and lettering.",
    timings: "2026-02-08, 12:30-2:30PM"
  },
  {
    name: "Fashionista",
    venue: "CV RAMAN HALL (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "creative arts club",
    description: "On-the-spot outfit design challenge using provided materials.",
    timings: "2026-02-08, 3:00-5:00 PM"
  },
  {
    name: "Squid Games",
    venue: "Cricket Ground",
    coords: [26.8615576, 75.8136685], // Used Cricket Ground coordinates
    category: "mass and media",
    description: "Multi-round eliminator event involving relay, puzzles, and mini-games.",
    timings: "07-02-2026/08-02-2026, 10AM-4PM"
  },
  {
    name: "The Upside Down",
    venue: "Computer Centre",
    coords: [26.8635833, 75.8103205], // Used Computer Centre (CC) coordinates
    category: "mass and media",
    description: "Stranger Things–themed Escape Room challenge with hidden evidence and clues.",
    timings: "2026-02-06, 10AM-4PM"
  },
  {
    name: "Family Fued",
    venue: "Central Canteen",
    coords: [26.8631305, 75.8105471], // Used Central Canteen coordinates
    category: "mass and media",
    description: "Buzzer-based game show revolving around campus culture and student life.",
    timings: "2026-02-07"
  },
  {
    name: "Udta Teer",
    venue: "VLTC Back Porch",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "mass and media",
    description: "Creative canopy space for expression, shayaris, and interactive games.",
    timings: "2026-02-07, 11PM-3PM"
  },
  {
    name: "MNIT's Live",
    venue: "Central Lawn",
    coords: [26.8620375, 75.8092141], // Used Central Lawn coordinates
    category: "mass and media",
    description: "Spontaneous debate event on light-hearted topics revealing on the spot.",
    timings: "2026-02-06, 12PM-3PM"
  },
  {
    name: "Youth Parliament",
    venue: "APJ Abdul Kalam Hall (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "language club",
    description: "Formal discussion event simulating parliamentary proceedings.",
    timings: "06-02-2026/07-02-2026, 1PM-4:30PM"
  },
  {
    name: "Script Art Workshop",
    venue: "VLTC Back Porch",
    coords: [26.862502, 75.8143449], // Used VLTC Back Porch coordinates
    category: "language club",
    description: "Competition for drawing and painting letters from different writing systems.",
    timings: "2026-02-07, 10AM-12PM"
  },
  {
    name: "Feel the Art",
    venue: "VLTC L009",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "limitless ability",
    description: "Creative challenge where participants paint blindfolded on a specific theme.",
    timings: "2026-02-06, 11AM-1PM"
  },
  {
    name: "Puzzle Escape Room",
    venue: "VLTC L009",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "limitless ability",
    description: "Team-based room filled with clues, locks, and mini-mysteries to solve.",
    timings: "2026-02-07, 2PM-4PM"
  },
  {
    name: "Moments",
    venue: "Old Gym (SAC)",
    coords: [26.862502, 75.8143449], // Used SAC/VLTC Back Porch area coordinates
    category: "photography",
    description: "International photo exhibition celebrating creative expression through visual storytelling.",
    timings: "All 3 Days"
  },
  {
    name: "Beyond the Lens",
    venue: "VLTC L104",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "photography",
    description: "Workshop featuring renowned photographers and brand ambassadors.",
    timings: "2026-02-06, 1PM-3PM"
  },
  {
    name: "Vogue",
    venue: "VLTC L007",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "photography",
    description: "Fashion photography initiative offering professional magazine-style images.",
    timings: "2026-02-07, 10AM-3PM"
  },
  {
    name: "CineFrame",
    venue: "Prabha Bhawan",
    coords: [26.8637887, 75.8108025], // Used Prabha Bhawan coordinates
    category: "photography",
    description: "Storytelling competition through short films or photo series.",
    timings: "All 3 Days"
  },
  {
    name: "Reel It",
    venue: "VLTC Back Porch",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "photography",
    description: "Short-video competition focused on creativity and editing skills.",
    timings: "All 3 Days"
  },
  {
    name: "Open Mic",
    venue: "Ramanujan Hall (Prabha Bhawan)",
    coords: [26.8637887, 75.8108025], // Used Prabha Bhawan coordinates
    category: "poetry",
    description: "Expressive space for poets to share original poems, ghazals, and spoken word.",
    timings: "2026-02-06, 1PM-3PM"
  },
  {
    name: "Mushaira",
    venue: "SAC Lawn",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch (SAC Lawn) coordinates
    category: "poetry",
    description: "Traditional celebration of Urdu and Hindustani poetry recitations.",
    timings: "2026-02-07, 10PM-12:30PM"
  },
  {
    name: "Abhivyakti Sabha",
    venue: "Ramanujan Hall (Prabha Bhawan)",
    coords: [26.8637887, 75.8108025], // Used Prabha Bhawan coordinates
    category: "poetry",
    description: "Poetry writing competition based on a provided theme.",
    timings: "2026-02-07, 3PM-4PM"
  },
  {
    name: "Quiz Bowl",
    venue: "VLTC L008",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "think india",
    description: "Lively quiz competition based on pop culture, movies, and current trends.",
    timings: "2026-02-06, 10AM-1PM"
  },
  {
    name: "Human Chess",
    venue: "SAC Lawn",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch (SAC Lawn) coordinates
    category: "think india",
    description: "Strategic chess competition using human tokens for the final match.",
    timings: "2026-02-07, 10AM-1PM"
  },
  {
    name: "Quiz Premier League",
    venue: "VLTC L109",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "quiz club",
    description: "Sports quiz blended with the thrill of an IPL auction.",
    timings: "2026-02-06, 11PM-3PM"
  },
  {
    name: "Kaun Banega Quizpatii",
    venue: "VLTC L108",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "quiz club",
    description: "Challenge inspired by KBC testing knowledge across diverse topics.",
    timings: "2026-02-07, 10am-1pm"
  },
  {
    name: "Buzz Battle",
    venue: "VLTC L106",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "quiz club",
    description: "Fast-paced buzzer round quiz rewarding quick thinking and reflexes.",
    timings: "2026-02-08, 10AM-1PM"
  },
  {
    name: "Mystery palace",
    venue: "VLTC L106/L009",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "quiz club",
    description: "Puzzle-based event where participants crack clues to escape in time.",
    timings: "07-02-2026/08-02-2026, 10am-4pm"
  },
  {
    name: "Cosplay",
    venue: "Ramanujan Hall (Prabha Bhawan)",
    coords: [26.8637887, 75.8108025], // Used Prabha Bhawan coordinates
    category: "fashion club",
    description: "Embodying anime or movie characters through performance and costume.",
    timings: "2026-02-07, 10am-1pm"
  },
  {
    name: "Pop Culture",
    venue: "VLTC L008",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "fashion club",
    description: "Runway event inspired by celebrities, films, and internet icon trends.",
    timings: "2026-02-08"
  },
  {
    name: "Influencer Workshop",
    venue: "VLTC L008",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "fashion club",
    description: "Educational session featuring insights from fashion influencers.",
    timings: "2026-02-08, 1-3pm"
  },
  {
    name: "Voice Choice",
    venue: "OAT",
    coords: [26.8619364, 75.8118249], // Used OAT coordinates
    category: "classic music and dance",
    description: "Classical singing competition showcasing vocal talent.",
    timings: "2026-02-06, 2PM-4PM"
  },
  {
    name: "Nrityanjali",
    venue: "OAT",
    coords: [26.8619364, 75.8118249], // Used OAT coordinates
    category: "classic music and dance",
    description: "Classical dance competition focused on traditional performance arts.",
    timings: "2026-02-08, 2pm-4pm"
  },
  {
    name: "MNIT HUSTLE",
    venue: "SAC LAWN",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch (SAC Lawn) coordinates
    category: "music club",
    description: "Three-level rap music competition with specific criteria for each stage.",
    timings: "2026-02-06, 1:00-4:00 PM"
  },
  {
    name: "JUGALBANDHI",
    venue: "SAC LAWN",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch (SAC Lawn) coordinates
    category: "music club",
    description: "Acoustic ensemble event celebrating musical conversation and harmony.",
    timings: "2026-02-07, 1:00-4:00PM"
  },
  {
    name: "SYMBOLIC SYMPHONY",
    venue: "VLTC L104",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "music club",
    description: "Song guessing via symbols and a muted-portion singing challenge.",
    timings: "2026-02-08, 11AM-3PM"
  },
  {
    name: "Multi Costume Parade",
    venue: "VLTC Front Porch",
    coords: [26.8633609, 75.814597], // Used VLTC Front Porch coordinates
    category: "NSS",
    description: "Campus parade showcasing India’s diverse cultures and traditions.",
    timings: "2026-02-05, 4PM-6PM"
  },
  {
    name: "Pledge Wall",
    venue: "VLTC Back Porch",
    coords: [26.862502, 75.8143449], // Used VLTC Back Porch coordinates
    category: "NSS",
    description: "Interactive board for students to sign the Anti Addiction pledge.",
    timings: "2026-02-05, 5PM onwards"
  },
  {
    name: "MNIT Got Talent !",
    venue: "VLTC L006",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "NSS",
    description: "Quiz competition and games based on IQ and Emotional Intelligence.",
    timings: "2026-02-06, 1 PM - 4 PM"
  },
  {
    name: "Cultural Tales",
    venue: "VLTC L006",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "NSS",
    description: "Hunt educating participants about environmental facts and local heritage.",
    timings: "2026-02-07, 1 PM - 4 PM"
  },
  {
    name: "Green Patrol",
    venue: "VLTC L006",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "NSS",
    description: "Waste disposal management and sustainability initiative during the fest.",
    timings: "2026-02-08, 1 PM - 4 PM"
  },
  {
    name: "Dicey Dares",
    venue: "SAC Lawn",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch (SAC Lawn) coordinates
    category: "travel and heritage",
    description: "Life-sized Snake and Ladders game with fun dares for players.",
    timings: "2026-02-06, 9:00 am to 1:00 pm"
  },
  {
    name: "Charade City",
    venue: "VLTC L004",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "travel and heritage",
    description: "Team game where members guess cities using visual clues.",
    timings: "2026-02-06, 1:30 to 4:30 pm"
  },
  {
    name: "Visa On Arrival",
    venue: "VLTC L004",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "travel and heritage",
    description: "Task-based event where participants collect stamps on a virtual visa.",
    timings: "2026-02-07, all day"
  },
  {
    name: "Pathway Patters",
    venue: "VLTC L004",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "travel and heritage",
    description: "Buzzer round identifying locations from movie and song clips.",
    timings: "2026-02-08, 10:00 am to 1:00 pm"
  },
  {
    name: "Youth Parliament",
    venue: "APJ Abdul Kalam Hall (VLTC Front)",
    coords: [26.8633609, 75.814597], // Updated to VLTC Front Porch coordinates
    category: "electoral literacy",
    description: "Electoral literacy discussion simulating parliamentary procedures.",
    timings: "06-02-2026/07-02-2026, 1PM-4:30PM"
  },
  {
    name: "IPL Auction",
    venue: "VLTC L106, L107, L108",
    coords: [26.862502, 75.8143449], // Updated to VLTC Back Porch coordinates
    category: "Ed cell",
    description: "Mock simulation auction focusing on valuation and negotiation.",
    timings: "2026-02-06, 10AM-4PM"
  },
  {
    name: "Human Monopoly",
    venue: "Homi JB Hall (Prabha Bhawan)",
    coords: [26.8637887, 75.8108025], // Used Prabha Bhawan coordinates as placeholder
    category: "Ed cell",
    description: "Life-sized Monopoly game focused on property and financial decisions.",
    timings: "2026-02-08, 10AM-5PM"
  }
];
