export type Org = {
  active?: boolean;
  bio?: string;
  logo?: string;
  companyUrl?: string;
  createdAt: string;
  customerId: string;
  id: string;
  name: string;
  updatedAt: string;
  metadata: Record<string, any>;
};

export type OrgOverview = Org & {
  ownerName: string;
  email: string;
  companyAddress: string;
  phone: string;
  customerId: string;
  companySize: string;
  pipedriveDeal: string;
  members: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    metadata: Record<string, any>;
  }>;
  totalInspections: number;
  deliveredInspections: number;
  pendingInspections: number;
};
