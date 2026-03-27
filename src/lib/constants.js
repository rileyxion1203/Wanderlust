export const LOADING_MSGS = [
  "Searching for top-rated restaurants…",
  "Looking up current ticket prices…",
  "Finding the best hotels for your budget…",
  "Reading recent reviews…",
  "Checking student discounts…",
  "Putting it all together…",
];

export const TAG_PALETTE = [
  { bg: "#f0e6d8", color: "#8a6d4b" },  // warm sand
  { bg: "#ddeee5", color: "#4a7e63" },  // matcha
  { bg: "#e4ddef", color: "#6e5a8a" },  // wisteria
  { bg: "#dce8f0", color: "#4f7289" },  // mist blue
  { bg: "#f5e0db", color: "#9e6055" },  // terracotta
  { bg: "#e8e4d4", color: "#7a7254" },  // moss
  { bg: "#f2dde4", color: "#8a5a6a" },  // plum
  { bg: "#d8ebe8", color: "#4a7a72" },  // celadon
];

export function tagColor(label) {
  if (!label) return TAG_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash = ((hash << 5) - hash + label.charCodeAt(i)) | 0;
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length];
}

export const STOP_ICONS = { breakfast: "·", attraction: "·", lunch: "·", dinner: "·", nightlife: "·" };

export const STOP_GRADIENTS = {
  breakfast: ["#F5C28A", "#F8D8B0"],
  lunch: ["#F5C28A", "#F8D8B0"],
  dinner: ["#E8A89A", "#F0C4BA"],
  attraction: ["#8BC5B8", "#AED8CE"],
  transport: ["#B0C4D8", "#CADAE8"],
  hotel: ["#C8B8D8", "#DDD0EA"],
  nightlife: ["#E8A89A", "#F0C4BA"],
};

export const STOP_COLORS = {
  breakfast: "#F5C28A",
  attraction: "#8BC5B8",
  lunch: "#F5C28A",
  dinner: "#E8A89A",
  transport: "#B0C4D8",
  hotel: "#C8B8D8",
  nightlife: "#E8A89A",
};
