import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import type { Company } from "types/companies";
import { formatFundingAmount } from "~/utils";
import { memo } from "react";

interface CompanyCardProps {
  company: Company;
}

function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card
      key={company.id}
      borderRadius="lg"
      overflow="hidden"
      variant="outline"
      boxShadow="sm"
      _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
      transition="all 0.2s"
    >
      <CardHeader pb={0} pt={4} px={5}>
        <Flex justifyContent="space-between" alignItems="center">
          <Badge colorScheme="gray" fontSize="xs">
            #{company.rank}
          </Badge>
          {company.growth_stage && (
            <Badge colorScheme="gray">
              {company.growth_stage}
            </Badge>
          )}
        </Flex>
        <Flex alignItems="center" mt={2} mb={1}>
          <Box
            mr={3}
            w="40px"
            h="40px"
            borderRadius="md"
            overflow="hidden"
            bg="gray.50"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={`https://app.tryspecter.com/logo?domain=${company.domain}`}
              alt={`${company.name} logo`}
              fallbackSrc="/company-placeholder.svg"
              maxW="30px"
              maxH="30px"
              objectFit="contain"
            />
          </Box>
          <Heading size="md" isTruncated title={company.name}>
            {company.name}
          </Heading>
        </Flex>
        <Text color="gray.500" fontSize="sm" mb={1}>
          {company.domain}
        </Text>
      </CardHeader>
      <CardBody pt={3}>
        <Text fontSize="sm" mb={4} noOfLines={3} color="gray.600">
          {company.description}
        </Text>

        <Text fontSize="sm" mb={4} color="gray.600">
          {company.last_funding_amount ? formatFundingAmount(Number(company.last_funding_amount)) : "No funding"}
        </Text>

        <Stack
          direction="row"
          flexWrap="wrap"
          spacing={2}
          mt="auto"
        >
          {company.customer_focus && (
            <Badge
              colorScheme="gray"
              size="sm"
              variant="subtle"
            >
              {company.customer_focus}
            </Badge>
          )}
          {company.last_funding_type && (
            <Badge colorScheme="blue" size="sm" variant="subtle">
              {company.last_funding_type}
            </Badge>
          )}
          {company.last_funding_amount && (
            <Badge colorScheme="green" size="sm" variant="subtle">
              {company.last_funding_amount}
            </Badge>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}

export default memo(CompanyCard); 