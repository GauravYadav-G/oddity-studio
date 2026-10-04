export type Project = {
  id: string;
  name: string;
  tags: string[];
  year: string;
  role: string;
  blurb: string;
  result: string;
  resultLabel: string;
};

export const projects: Project[] = [
  {
    id: "halo",
    name: "Halo Bank",
    tags: ["Identity", "Product"],
    year: "2026",
    role: "Brand, product & launch site",
    blurb:
      "A neobank for people who hate banks. We built the identity, the app UI and a launch site that behaved more like a game than a landing page.",
    result: "312%",
    resultLabel: "waitlist growth in nine days",
  },
  {
    id: "field",
    name: "Field Notes Coffee",
    tags: ["Identity", "Packaging"],
    year: "2025",
    role: "Brand identity & packaging",
    blurb:
      "Roasters with a notebook problem. A warm, slightly wonky identity that turned every bag into a small collectible.",
    result: "4×",
    resultLabel: "subscription retention",
  },
  {
    id: "tempo",
    name: "Tempo Festival",
    tags: ["Web", "Motion"],
    year: "2025",
    role: "Festival site & motion system",
    blurb:
      "A three-day music festival whose website you could play like an instrument. Every stripe on the page is a live waveform.",
    result: "1.2M",
    resultLabel: "visits in launch week",
  },
  {
    id: "nubra",
    name: "Nubra Health",
    tags: ["Product", "Web"],
    year: "2024",
    role: "Product design & web platform",
    blurb:
      "Making a clinical-grade health platform feel like a friendly conversation. Fewer screens, kinder words, softer shapes.",
    result: "−58%",
    resultLabel: "support tickets",
  },
  {
    id: "lumen",
    name: "Lumen Architects",
    tags: ["Web", "Identity"],
    year: "2024",
    role: "Identity & portfolio site",
    blurb:
      "A studio of architects who draw everything on a grid. So we did too — a modular identity and a site that assembles itself.",
    result: "9",
    resultLabel: "design awards shortlisted",
  },
  {
    id: "pulse",
    name: "Pulse Records",
    tags: ["Identity", "3D"],
    year: "2023",
    role: "Identity, 3D & merch",
    blurb:
      "An independent label with a loud back catalogue. A spinning, scratchable identity — and vinyl that looks as good as it sounds.",
    result: "60k",
    resultLabel: "records pressed",
  },
];

export const services = [
  {
    n: "01",
    title: "Identity",
    text: "Names, marks, type, voice. Brands built to be recognised at ten paces and remembered at ten years.",
    items: ["Strategy", "Naming", "Logo & type", "Voice", "Guidelines"],
    bg: "bg-lime text-carbon",
    chip: "border-carbon/30",
  },
  {
    n: "02",
    title: "Websites",
    text: "Fast, accessible and unmistakable. Sites with a point of view, engineered to still feel good in year three.",
    items: ["Art direction", "Design systems", "WebGL", "React", "CMS"],
    bg: "bg-cobalt text-paper",
    chip: "border-paper/40",
  },
  {
    n: "03",
    title: "Motion & 3D",
    text: "Things that move with intent. Title sequences, product films, interface choreography and real-time 3D.",
    items: ["Brand motion", "Product film", "Real-time 3D", "UI animation"],
    bg: "bg-tomato text-carbon",
    chip: "border-carbon/30",
  },
  {
    n: "04",
    title: "Product",
    text: "From napkin to shipped. Research-led product design for teams who'd rather be useful than trendy.",
    items: ["Discovery", "UX & UI", "Prototyping", "Design ops"],
    bg: "bg-carbon text-paper",
    chip: "border-paper/30",
  },
];

export const principles = [
  { n: "01", t: "Be specific", d: "Generic is the most expensive thing you can ship. We look for the one detail only you can own." },
  { n: "02", t: "Be useful", d: "Beauty that doesn't work is decoration. Every idea earns its place by doing a job." },
  { n: "03", t: "Be a little odd", d: "Memorable things sit slightly to the left of expected. We push there on purpose, and carefully." },
];

export const recognition = [
  ["Awwwards", "Site of the Day", "×7"],
  ["FWA", "Site of the Month", "2025"],
  ["D&AD", "Wood Pencil — Digital Design", "2024"],
  ["CSS Design Awards", "Website of the Year — nominee", "2025"],
  ["Type Directors Club", "Certificate of Excellence", "2024"],
];

export const clients = ["Halo", "Field Notes", "Tempo", "Nubra", "Lumen", "Pulse", "Atlas", "Northwind"];
