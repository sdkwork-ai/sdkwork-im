import { AdminCapabilityUnavailableError } from '@sdkwork/im-pc-admin-sdk';

export interface BillingStatItem {
  available: boolean;
  title: string;
  value: string;
  trend: string;
  isUp: boolean;
}

export interface PlanDistribution {
  name: string;
  percent: number | null;
  users: number | null;
}

export interface TransactionInfo {
  id: string;
  tenant: string;
  tenantId: string;
  plan: string;
  amount: string;
  status: 'paid' | 'failed' | 'pending' | 'unknown';
  date: string;
}

export interface AdminBillingData {
  stats: Record<string, BillingStatItem>;
  plans: PlanDistribution[];
  transactions: TransactionInfo[];
}

/**
 * The whole /backend/v3/api/admin/* plane (including billing summary and
 * billing events) was pruned from the generated IM backend SDK contract
 * because no server implementation exists — the previous calls 404'd at
 * runtime. The service fails closed with a typed unavailable error so the
 * billing page renders an explicit unavailable state.
 */
class AdminBillingService {
  async getBillingData(): Promise<AdminBillingData> {
    throw new AdminCapabilityUnavailableError('billing analytics');
  }
}

export const adminBillingService = new AdminBillingService();
