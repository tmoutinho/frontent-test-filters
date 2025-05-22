import { Button, Flex, Tag, TagCloseButton, TagLabel, Wrap, WrapItem } from "@chakra-ui/react";
import type { Filters } from "types/app";
import { formatFundingAmount } from "~/utils";
import { customerFocusOptions, growthStageOptions } from "~/utils/mocks-data";

interface ActiveFilterTagsProps {
  activeFilters: Filters;
  maxRank: number;
  maxFundingAmount: number;
  removeFilter: (type: keyof Filters, value?: string) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

export default function ActiveFilterTags({
  activeFilters,
  maxRank,
  maxFundingAmount,
  removeFilter,
  clearAllFilters,
  hasActiveFilters,
}: ActiveFilterTagsProps) {
  if (!hasActiveFilters) return null;

  return (
    <Flex w="full" maxW="3xl" mx="auto" mt={2}>
      <Wrap spacing={2} flex="1">
        {activeFilters.growthStage.map(stage => {
          const option = growthStageOptions.find(o => o.value === stage);
          return (
            <WrapItem key={`stage-${stage}`}>
              <Tag
                size="md"
                colorScheme={activeFilters.growthStage.includes(stage) ? "blue" : "gray"}
                borderRadius="full"
              >
                <TagLabel>Stage: {option?.label || stage}</TagLabel>
                <TagCloseButton onClick={() => removeFilter("growthStage", stage)} />
              </Tag>
            </WrapItem>
          );
        })}

        {activeFilters.customerFocus.map(focus => {
          const option = customerFocusOptions.find(o => o.value === focus);
          return (
            <WrapItem key={`focus-${focus}`}>
              <Tag
                size="md"
                colorScheme={activeFilters.customerFocus.includes(focus) ? "blue" : "gray"}
                borderRadius="full"
              >
                <TagLabel>Focus: {option?.label || focus}</TagLabel>
                <TagCloseButton onClick={() => removeFilter("customerFocus", focus)} />
              </Tag>
            </WrapItem>
          );
        })}

        {activeFilters.fundingType.map(type => (
          <WrapItem key={`funding-${type}`}>
            <Tag size="md" colorScheme="blue" borderRadius="full">
              <TagLabel>Funding: {type}</TagLabel>
              <TagCloseButton onClick={() => removeFilter("fundingType", type)} />
            </Tag>
          </WrapItem>
        ))}

        {(activeFilters.rankRange[0] > 0 || activeFilters.rankRange[1] < maxRank) && (
          <WrapItem>
            <Tag size="md" colorScheme="yellow" borderRadius="full">
              <TagLabel>Rank: {activeFilters.rankRange[0]} - {activeFilters.rankRange[1]}</TagLabel>
              <TagCloseButton onClick={() => removeFilter("rankRange")} />
            </Tag>
          </WrapItem>
        )}

        {(activeFilters.fundingAmountRange[0] > 0 || activeFilters.fundingAmountRange[1] < maxFundingAmount) && (
          <WrapItem>
            <Tag size="md" colorScheme="green" borderRadius="full">
              <TagLabel>
                Amount: {formatFundingAmount(activeFilters.fundingAmountRange[0])} - {formatFundingAmount(activeFilters.fundingAmountRange[1])}
              </TagLabel>
              <TagCloseButton onClick={() => removeFilter("fundingAmountRange")} />
            </Tag>
          </WrapItem>
        )}
      </Wrap>

      <Button
        size="sm"
        variant="ghost"
        colorScheme="red"
        onClick={clearAllFilters}
        ml={2}
        alignSelf="flex-start"
      >
        Clear all
      </Button>
    </Flex>
  );
} 