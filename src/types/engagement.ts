export interface ProposalService {
  id: string;
  category: string;
  service: string;
  billingCycle: string;
  price: number;
  scopeOfWork?: string;
  discountedPrice?: number | null;
  finalPrice?: number;
  notesfromca?: string;
}

export interface ClientInfo {
  name?: string;
  clientRepresentative?: string;
  clientRepresentativePost?: string;
  contactNo?: string;
  email?: string;
  address?: string;
  PAN?: string;
  entityType?: 'company' | 'proprietorship';
  referenceNumber?: string;
}

export interface ProposalMeta {
  preparedFor?: string;
  preparedBy?: string;
  date?: string;
  message?: string;
  para?: string; // Added new field for paragraph
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

export interface AdvancedTerm {
  heading: string;
  points: string[];
}
