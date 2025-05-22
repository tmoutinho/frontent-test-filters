import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { BiFilter } from "react-icons/bi";
import type { Filters } from "types/app";
import { customerFocusOptions, fundingTypeOptions, growthStageOptions, MAX_FUNDING_AMOUNT, MAX_RANK } from "~/utils/mocks-data";
import { formatFundingAmount } from "~/utils";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: Filters;
  setActiveFilters: (filters: Filters) => void;
}

// add local state so that we dont refetch the companies on every click or change filter
export default function FilterModal({
  isOpen,
  onClose,
  activeFilters,
  setActiveFilters,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(activeFilters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(activeFilters);
    }
  }, [isOpen, activeFilters]);

  const toggleLocalFilter = (type: "growthStage" | "customerFocus" | "fundingType", value: string) => {
    setLocalFilters(prev => {
      const current = prev[type];
      const isActive = current.includes(value);

      return {
        ...prev,
        [type]: isActive
          ? current.filter(item => item !== value)
          : [...current, value]
      };
    });
  };

  const removeLocalFilter = (type: keyof Filters, value?: string) => {
    if (type === "growthStage" || type === "customerFocus" || type === "fundingType") {
      if (value) {
        setLocalFilters(prev => ({
          ...prev,
          [type]: prev[type].filter(item => item !== value)
        }));
      }
    } else if (type === "rankRange") {
      setLocalFilters(prev => ({
        ...prev,
        rankRange: [0, MAX_RANK]
      }));
    } else if (type === "fundingAmountRange") {
      setLocalFilters(prev => ({
        ...prev,
        fundingAmountRange: [0, MAX_FUNDING_AMOUNT]
      }));
    }
  };

  const clearLocalFilters = () => {
    setLocalFilters({
      growthStage: [],
      customerFocus: [],
      fundingType: [],
      rankRange: [0, MAX_RANK],
      fundingAmountRange: [0, MAX_FUNDING_AMOUNT],

    });
  };

  const applyFilters = () => {
    setActiveFilters(localFilters);
    onClose();
  };

  const handleCancel = () => {
    setLocalFilters(activeFilters);
    onClose();
  };

  // check if filters have changed
  const hasFilterChanges = useMemo(() => {
    const growthStageChanged =
      localFilters.growthStage.length !== activeFilters.growthStage.length ||
      localFilters.growthStage.some(stage => !activeFilters.growthStage.includes(stage));

    const customerFocusChanged =
      localFilters.customerFocus.length !== activeFilters.customerFocus.length ||
      localFilters.customerFocus.some(focus => !activeFilters.customerFocus.includes(focus));

    const fundingTypeChanged =
      localFilters.fundingType.length !== activeFilters.fundingType.length ||
      localFilters.fundingType.some(type => !activeFilters.fundingType.includes(type));

    const rankRangeChanged =
      localFilters.rankRange[0] !== activeFilters.rankRange[0] ||
      localFilters.rankRange[1] !== activeFilters.rankRange[1];

    const fundingAmountChanged =
      localFilters.fundingAmountRange[0] !== activeFilters.fundingAmountRange[0] ||
      localFilters.fundingAmountRange[1] !== activeFilters.fundingAmountRange[1];

    return growthStageChanged || customerFocusChanged || fundingTypeChanged ||
      rankRangeChanged || fundingAmountChanged;
  }, [localFilters, activeFilters]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      size="lg"
      isCentered
      motionPreset="none" // Reduces animation cost
      blockScrollOnMount={false} // Prevents layout calculations
    >
      <ModalOverlay bg="rgba(0,0,0,0.4)" />
      <ModalContent maxH="90vh" display="flex" flexDirection="column">
        <ModalHeader borderBottomWidth="1px">Filter Companies</ModalHeader>
        <ModalCloseButton />

        <ModalBody
          py={6}
          flex="1"
          overflowY="auto"
        >
          <VStack spacing={6} align="stretch">
            {/* Growth Stage Filter */}
            <Box>
              <Heading size="sm" mb={2}>Growth Stage</Heading>
              <SimpleGrid columns={2} spacing={2}>
                {growthStageOptions.map(option => (
                  <Button
                    key={option.value}
                    size="sm"
                    colorScheme={localFilters.growthStage.includes(option.value) ? "blue" : "gray"}
                    variant={localFilters.growthStage.includes(option.value) ? "solid" : "outline"}
                    onClick={() => toggleLocalFilter("growthStage", option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Customer Focus Filter */}
            <Box>
              <Heading size="sm" mb={2}>Customer Focus</Heading>
              <SimpleGrid columns={2} spacing={2}>
                {customerFocusOptions.map(option => (
                  <Button
                    key={option.value}
                    size="sm"
                    colorScheme={localFilters.customerFocus.includes(option.value) ? "blue" : "gray"}
                    variant={localFilters.customerFocus.includes(option.value) ? "solid" : "outline"}
                    onClick={() => toggleLocalFilter("customerFocus", option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Funding Type Filter */}
            <Box>
              <Heading size="sm" mb={2}>Funding Type</Heading>
              <Select
                placeholder="Select funding type"
                onChange={(e) => {
                  if (e.target.value) {
                    toggleLocalFilter("fundingType", e.target.value);
                  }
                }}
                value={localFilters.fundingType[0] || ""}
              >
                {fundingTypeOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              {localFilters.fundingType.length > 0 && (
                <Wrap mt={2} spacing={2}>
                  {localFilters.fundingType.map(type => (
                    <WrapItem key={`modal-funding-${type}`}>
                      <Tag size="md" colorScheme={localFilters.fundingType.includes(type) ? "blue" : "gray"} borderRadius="full">
                        <TagLabel>{type}</TagLabel>
                        <TagCloseButton onClick={() => removeLocalFilter("fundingType", type)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              )}
            </Box>

            <Divider />

            {/* Rank Range Filter */}
            <Box>
              <FormLabel htmlFor="rank-range" display="flex" justifyContent="space-between">
                <Text>Rank Range</Text>
                <Text fontSize="sm" color="gray.500">
                  {localFilters.rankRange[0]} - {localFilters.rankRange[1]}
                </Text>
              </FormLabel>
              <RangeSlider
                id="rank-range"
                min={0}
                max={MAX_RANK}
                step={1}
                value={localFilters.rankRange}
                onChange={(val) => setLocalFilters(prev => ({ ...prev, rankRange: val as [number, number] }))}
                colorScheme="yellow"
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </Box>

            <Divider />

            {/* Funding Amount Filter */}
            <Box>
              <FormLabel htmlFor="funding-range" display="flex" justifyContent="space-between">
                <Text>Funding Amount</Text>
                <Text fontSize="sm" color="gray.500">
                  {formatFundingAmount(localFilters.fundingAmountRange[0])} - {formatFundingAmount(localFilters.fundingAmountRange[1])}
                </Text>
              </FormLabel>

              <RangeSlider
                id="funding-range"
                min={0}
                max={MAX_FUNDING_AMOUNT}
                step={1000}
                value={localFilters.fundingAmountRange}
                onChange={(val) => setLocalFilters(prev => ({ ...prev, fundingAmountRange: val as [number, number] }))}
                colorScheme="green"
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter
          borderTopWidth="1px"
          p={4}
          bg="white"
          justifyContent="space-between"
        >
          <Button variant="outline" onClick={clearLocalFilters}>
            Clear All
          </Button>
          <Flex gap={2}>
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              colorScheme={hasFilterChanges ? "green" : "blue"}
              onClick={applyFilters}
              rightIcon={<BiFilter />}
              isDisabled={!hasFilterChanges}
            >
              {hasFilterChanges ? "Apply Changes" : "Apply Filters"}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}