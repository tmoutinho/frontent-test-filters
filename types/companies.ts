export interface Company {
  id: string;
  name: string;
  domain: string;
  rank: number;
  description: string;
  createdAt?: string;
  growth_stage?: string;
  last_funding_type?: string;
  last_funding_amount?: string;
  customer_focus?: string;
}
