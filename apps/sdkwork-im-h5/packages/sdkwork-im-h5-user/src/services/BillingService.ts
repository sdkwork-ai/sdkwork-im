/**
 * Billing records — fail-closed (PRD).
 *
 * Audited as fabricated data (hard-coded mock payment history rendered as
 * real records) with no owner backend SDK composed. The mock records are
 * removed: every method throws a typed `UserCapabilityUnavailableError` so
 * the billing page surfaces a typed unavailable state instead of fabricated
 * payment history.
 */
import { UserCapabilityUnavailableError } from "./UserCapabilityUnavailableError";

export interface BillingRecord {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: "expense" | "income";
  status: "success" | "pending" | "failed";
}

export const BillingService = {
  getRecords: async (): Promise<BillingRecord[]> => {
    throw new UserCapabilityUnavailableError("Billing records");
  },
};
