import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Center,
  Alert,
  AlertIcon,
  Image,
  Button,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import type { Filters, SortOption } from "types/app";
import type { Company } from "types/companies";
import ActiveFilterTags from "~/components/active-filter-tags";
import CompanyCard from "~/components/company-card";
import FilterChips from "~/components/popular-filters";
import FilterModal from "~/components/filter-modal";
import SearchBar from "~/components/search-bar";
import SortSelect from "~/components/sort-select";
import { fetchCompanies } from "~/utils";
import { MAX_FUNDING_AMOUNT } from "~/utils/mocks-data";
import { MAX_RANK } from "~/utils/mocks-data";

export default function Companies() {
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filters>({
    growthStage: [],
    customerFocus: [],
    fundingType: [],
    rankRange: [0, MAX_RANK],
    fundingAmountRange: [0, MAX_FUNDING_AMOUNT],
  });
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  // create a memoized search handler
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["companies", activeFilters, searchQuery, activeSort],
    queryFn: () => fetchCompanies(activeFilters, searchQuery, activeSort || undefined)
  });

  // check if filters are active
  const hasActiveFilters =
    activeFilters.growthStage.length > 0 ||
    activeFilters.customerFocus.length > 0 ||
    activeFilters.fundingType.length > 0 ||
    activeFilters.rankRange[0] > 0 ||
    activeFilters.rankRange[1] < MAX_RANK ||
    activeFilters.fundingAmountRange[0] > 0 ||
    activeFilters.fundingAmountRange[1] < MAX_FUNDING_AMOUNT;

  // clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveFilters({
      growthStage: [],
      customerFocus: [],
      fundingType: [],
      rankRange: [0, MAX_RANK],
      fundingAmountRange: [0, MAX_FUNDING_AMOUNT],

    });
  };

  const removeFilter = (type: keyof Filters, value?: string) => {
    if (type === "growthStage" || type === "customerFocus" || type === "fundingType") {
      if (value) {
        setActiveFilters(prev => ({
          ...prev,
          [type]: prev[type].filter(item => item !== value)
        }));
      }
    } else if (type === "rankRange") {
      setActiveFilters(prev => ({
        ...prev,
        rankRange: [0, MAX_RANK]
      }));
    } else if (type === "fundingAmountRange") {
      setActiveFilters(prev => ({
        ...prev,
        fundingAmountRange: [0, MAX_FUNDING_AMOUNT]
      }));
    }
  };

  const toggleFilter = (type: "growthStage" | "customerFocus" | "fundingType", value: string) => {
    setActiveFilters(prev => {
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

  return (
    <Box
      bgImage="url(bg.png)"
      bgSize="cover"
      bgPosition="center"
      pos="relative"
      zIndex={0}
      minH="100vh"
      py={12}
      _before={{
        content: '""',
        pos: "absolute",
        inset: 0,
        bgGradient: "linear(to-b, rgba(255, 255, 255, 0.6), white)",
        zIndex: -1,
      }}
    >
      <Container maxW="container.xl">
        {/* Header */}
        <Flex direction="column" alignItems="center" mb={6}>
          <Image src="/specter.svg" alt="Specter" h={8} mb={6} />
          <Heading
            as={motion.h1}
            initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            fontSize="3xl"
            fontWeight="semibold"
            textAlign="center"
          >
            Companies
          </Heading>
          <Text color="gray.500" textAlign="center" maxW="xl" mt={2} mb={6}>
            Browse and discover companies from our database
          </Text>

          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterClick={() => setIsFiltersModalOpen(true)}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Quick Filter Chips */}
          <FilterChips
            activeGrowthStages={activeFilters.growthStage}
            activeCustomerFocus={activeFilters.customerFocus}
            toggleFilter={toggleFilter}
          />

          {/* Active Filters */}
          <ActiveFilterTags
            activeFilters={activeFilters}
            maxRank={MAX_RANK}
            maxFundingAmount={MAX_FUNDING_AMOUNT}
            removeFilter={removeFilter}
            clearAllFilters={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </Flex>

        {/* Filter Modal */}
        <FilterModal
          isOpen={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

        {/* Content */}
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        >
          {isLoading ? (
            <Center py={20}>
              <Spinner size="xl" color="gray.500" />
            </Center>
          ) : error ? (
            <Alert status="error" mb={6} rounded="lg">
              <AlertIcon />
              Failed to load companies. Please try again later.
            </Alert>
          ) : (
            <>
              {/* Results counter and sort selector */}
              <SortSelect
                activeSort={activeSort}
                handleSortChange={(option: SortOption) => setActiveSort(option)}
                companiesCount={data?.companies.length || 0}
              />

              {data?.companies.length === 0 ? (
                <Center py={10} flexDirection="column">
                  <Heading size="md" color="gray.500" mb={2}>No companies found</Heading>
                  <Text color="gray.400">Try adjusting your filters or search query</Text>
                  <Button mt={4} onClick={clearAllFilters} colorScheme="blue" variant="outline">
                    Clear all filters
                  </Button>
                </Center>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {data?.companies.map((company: Company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </SimpleGrid>
              )}
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
} 