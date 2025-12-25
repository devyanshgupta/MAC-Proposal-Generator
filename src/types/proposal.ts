export interface ProposalService {
  id: string;
  category: string;
  service: string;
  billingCycle: string;
  price: number;
  scopeOfWork?: string;
  discountedPrice?: number | null;
  finalPrice?: number;
}

export interface ClientInfo {
  name?: string;
  gstin?: string;
  address?: string;
  CIN?: string;
}

export interface ProposalMeta {
  preparedFor?: string;
  preparedBy?: string;
  date?: string;
  message?: string;
}

export interface ProposalPayload {
  client: ClientInfo;
  proposal: ProposalMeta;
  services: ProposalService[];
}

export interface ProposalResponse extends ProposalPayload {
  summary: {
    total: number;
    count: number;
  };
}

