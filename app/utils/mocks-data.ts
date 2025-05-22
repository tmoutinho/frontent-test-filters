export const MAX_RANK = 1000;
export const MAX_FUNDING_AMOUNT = 590000000;

export const growthStageOptions = [
  { value: "seed", label: "Seed" },
  { value: "early", label: "Early" },
  { value: "growing", label: "Growing" },
  { value: "late", label: "Late" },
  { value: "exit", label: "Exit" }
];

export const customerFocusOptions = [
  { value: "b2b", label: "B2B" },
  { value: "b2c", label: "B2C" },
  { value: "b2b_b2c", label: "B2B + B2C" },
  { value: "b2c_b2b", label: "B2C + B2B" }
];

export const fundingTypeOptions = [
  "Angel",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D",
  "Convertible Note",
];

export const sortOptions = [
  { id: 'name_asc', label: 'Name (A-Z)', field: 'name', order: 'asc' },
  { id: 'name_desc', label: 'Name (Z-A)', field: 'name', order: 'desc' },
  { id: 'rank_asc', label: 'Rank (Low-High)', field: 'rank', order: 'asc' },
  { id: 'rank_desc', label: 'Rank (High-Low)', field: 'rank', order: 'desc' },
];
