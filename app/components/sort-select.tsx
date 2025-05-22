import { Flex, Text, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { BiSortAlt2 } from "react-icons/bi";
import type { SortOption } from "~/types/app";
import { sortOptions } from "~/utils/mocks-data";

interface SortSelectProps {
  activeSort: SortOption | null;
  handleSortChange: (option: SortOption) => void;
  companiesCount: number;
}

export default function SortSelect({
  activeSort,
  handleSortChange,
  companiesCount,
}: SortSelectProps) {
  return (
    <Flex justify="space-between" align="center" mb={4}>
      <Text color="gray.500" fontSize="sm">
        {companiesCount} {companiesCount === 1 ? 'company' : 'companies'} found
      </Text>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<BiSortAlt2 />}
          variant="ghost"
          size="sm"
          colorScheme={activeSort ? "blue" : "gray"}
        >
          Sort by{activeSort ? `: ${activeSort.label}` : ""}
        </MenuButton>
        <MenuList>
          {sortOptions.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => handleSortChange(option as SortOption)}
              fontWeight={activeSort?.label === option.label ? "bold" : "normal"}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
}