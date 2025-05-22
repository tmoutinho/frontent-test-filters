import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import { customerFocusOptions, growthStageOptions } from "~/utils/mocks-data";

interface PopularFiltersProps {
  activeGrowthStages: string[];
  activeCustomerFocus: string[];
  toggleFilter: (type: "growthStage" | "customerFocus" | "fundingType", value: string) => void;
}

export default function PopularFilters({
  activeGrowthStages,
  activeCustomerFocus,
  toggleFilter,
}: PopularFiltersProps) {
  return (
    <Box w="full" maxW="3xl" mx="auto" display="flex" alignItems="center" gap={2}>
      <Heading as="h5" fontSize="md" mb={2}>Popular Filters</Heading>
      <HStack spacing={1} mb={2}>
        {customerFocusOptions.map(option => (
          <Button
            key={option.value}
            size="sm"
            colorScheme={activeCustomerFocus.includes(option.value) ? "blue" : "gray"}
            variant={activeCustomerFocus.includes(option.value) ? "solid" : "outline"}
            onClick={() => toggleFilter("customerFocus", option.value)}
            height="2rem"
            minW="auto"
            py={0}
            px={3}
            borderRadius="full"
          >
            {option.label}
          </Button>
        ))}

        {growthStageOptions.map(option => (
          <Button
            key={option.value}
            size="sm"
            colorScheme={activeGrowthStages.includes(option.value) ? "blue" : "gray"}
            variant={activeGrowthStages.includes(option.value) ? "solid" : "outline"}
            onClick={() => toggleFilter("growthStage", option.value)}
            height="2rem"
            minW="auto"
            py={0}
            px={3}
            borderRadius="full"
          >
            {option.label}
          </Button>
        ))}
      </HStack>
    </Box>
  );
} 