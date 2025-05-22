import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { BiFilter, BiSearch } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  hasActiveFilters: boolean;
  debounceTime?: number;
}

// added local state to allow debouncing the search
export default function SearchBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
  hasActiveFilters,
  debounceTime = 300,
}: SearchBarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearchChange(value);
    }, debounceTime);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Flex w="full" maxW="3xl" mx="auto" mb={4}>
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none">
          <BiSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search by company name, domain, or description..."
          value={localSearch}
          onChange={handleInputChange}
          bg="white"
          shadow="md"
          borderRadius="full"
          pr="4rem"
        />
      </InputGroup>

      <Button
        leftIcon={<BiFilter size={24} />}
        ml={2}
        onClick={onFilterClick}
        colorScheme={hasActiveFilters ? "blue" : "gray"}
        variant={hasActiveFilters ? "solid" : "outline"}
        height="auto"
        py={0}
        px={6}
        borderRadius="full"
      >
        Filters
      </Button>
    </Flex>
  );
} 