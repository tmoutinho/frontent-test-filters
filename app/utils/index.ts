import type { Filters, FilterParams, SortOption } from "types/app";
import type { Company } from "types/companies";
import { MAX_FUNDING_AMOUNT, MAX_RANK } from "./mocks-data";

export const formatFundingAmount = (amount: number) => {
  if (!amount) return "0";
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    compactDisplay: 'short'
  });
};

export const fetchCompanies = async (
  filters: Filters,
  searchQuery: string,
  sortOption?: SortOption
): Promise<{ companies: Company[] }> => {
  // convert filters to params
  const params = filtersToParams(filters, searchQuery, sortOption);

  // create query string
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  const response = await fetch(`/api/companies${queryString ? `?${queryString}` : ''}`);
  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }
  return response.json();
};

export function filtersToParams(
  filters: Filters,
  searchQuery: string,
  sortOption?: SortOption
): FilterParams {
  const params: FilterParams = {};

  if (searchQuery) {
    params.search = searchQuery;
  }

  if (filters.growthStage.length > 0) {
    params.growthStage = filters.growthStage.join(',');
  }

  if (filters.customerFocus.length > 0) {
    params.customerFocus = filters.customerFocus.join(',');
  }

  if (filters.fundingType.length > 0) {
    params.fundingType = filters.fundingType.join(',');
  }

  if (filters.rankRange[0] > 0) {
    params.minRank = filters.rankRange[0];
  }

  if (filters.rankRange[1] < MAX_RANK) {
    params.maxRank = filters.rankRange[1];
  }

  if (filters.fundingAmountRange[0] > 0) {
    params.minFundingAmount = filters.fundingAmountRange[0];
  }

  // Only add maxFundingAmount if it's not at max value
  if (filters.fundingAmountRange[1] < MAX_FUNDING_AMOUNT) {
    params.maxFundingAmount = filters.fundingAmountRange[1];
  }

  // Add sorting parameters if provided
  if (sortOption) {
    params.sortId = sortOption.id;
  }

  return params;
}
