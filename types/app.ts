export interface Filters {
  growthStage: string[];
  customerFocus: string[];
  fundingType: string[];
  rankRange: [number, number];
  fundingAmountRange: [number, number];
}

export interface FilterParams {
  search?: string;
  growthStage?: string;
  customerFocus?: string;
  fundingType?: string;
  minRank?: number;
  maxRank?: number;
  minFundingAmount?: number;
  maxFundingAmount?: number;
  sortId?: string;
}

export type SortOption = {
  id: string;
  label: string;
  field: string;
  order: 'asc' | 'desc';
};