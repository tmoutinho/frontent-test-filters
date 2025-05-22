import { PrismaClient } from "@prisma/client";
import { sortOptions } from "~/utils/mocks-data";

export async function loader({ request }: { request: Request }) {
  const prisma = new PrismaClient();
  const url = new URL(request.url);
  const params = url.searchParams;

  try {
    // build filters with params
    const { filter, orderBy }: any = buildFilterConditions(params);

    const companies = await prisma.company.findMany({
      where: filter,
      orderBy: orderBy
    });

    // fix i with BigInt valueslues
    const serializedCompanies = companies.map(company => ({
      ...company,
      last_funding_amount: company.last_funding_amount ? company.last_funding_amount.toString() : null
    }));

    return { companies: serializedCompanies ?? [] };
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    throw new Response("Failed to fetch companies", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function buildFilterConditions(params: URLSearchParams) {
  const search = params.get('search');
  const growthStage = params.get('growthStage');
  const customerFocus = params.get('customerFocus');
  const fundingType = params.get('fundingType');
  const minRank = params.get('minRank');
  const maxRank = params.get('maxRank');
  const minFundingAmount = params.get('minFundingAmount');
  const maxFundingAmount = params.get('maxFundingAmount');

  const filter: any = {};
  const sortId = params.get('sortId');

  let orderBy: any = { rank: 'asc' };

  if (sortId) {
    const sortOption = sortOptions.find(option => option.id === sortId);

    if (sortOption) {
      orderBy = { [sortOption.field]: sortOption.order };
    }
  }

  if (search) {
    filter.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { domain: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (growthStage) {
    const stages = growthStage.split(',');
    filter.growth_stage = {
      in: stages,
      mode: 'insensitive'
    };
  }

  if (customerFocus) {
    const focuses = customerFocus.split(',');
    filter.customer_focus = {
      in: focuses,
      mode: 'insensitive'
    };
  }

  if (fundingType) {
    const types = fundingType.split(',');
    filter.last_funding_type = {
      in: types,
      mode: 'insensitive'
    };
  }

  if (minRank || maxRank) {
    filter.rank = {};

    if (minRank) {
      filter.rank.gte = parseInt(minRank);
    }

    if (maxRank) {
      filter.rank.lte = parseInt(maxRank);
    }
  }

  if (minFundingAmount || maxFundingAmount) {
    filter.last_funding_amount = {};

    if (minFundingAmount) {
      filter.last_funding_amount.gte = BigInt(minFundingAmount);
    }

    if (maxFundingAmount) {
      filter.last_funding_amount.lte = BigInt(maxFundingAmount);
    }
  }

  return {
    filter,
    orderBy
  };
} 