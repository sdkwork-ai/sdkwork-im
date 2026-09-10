import { getBackendSdkClientWithSession } from '@sdkwork/im-pc-admin-sdk';

export interface AuditLog {
  id: string;
  time: string;
  actor: string;
  action: string;
  resource: string;
  ip: string;
}

export interface ComplianceData {
  systemSecure: boolean;
  legalHolds: number;
  uptime: string;
  auditLogs: AuditLog[];
  /** True when the audit-records capability backing the audit log is absent. */
  auditLogsUnavailable: boolean;
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as UnknownRecord : {};
}

function readString(record: UnknownRecord, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
  }
  return fallback;
}

function readNumber(record: UnknownRecord, keys: string[], fallback = 0): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value.replace(/[,%\s]/gu, ''));
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return fallback;
}

function readBoolean(record: UnknownRecord, keys: string[], fallback = false): boolean {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      return ['1', 'true', 'yes', 'healthy', 'secure', 'ok', 'ready'].includes(value.trim().toLowerCase());
    }
  }
  return fallback;
}

function formatUptime(health: UnknownRecord): string {
  const explicit = readString(health, ['uptime', 'uptimePercent', 'availability'], '');
  if (explicit) {
    return explicit.endsWith('%') ? explicit : `${explicit}%`;
  }
  const uptimePercent = readNumber(health, ['availabilityPercent', 'slaPercent'], Number.NaN);
  if (Number.isFinite(uptimePercent)) {
    return `${uptimePercent.toFixed(3)}%`;
  }
  return '0%';
}

function hasCriticalSignals(health: UnknownRecord): boolean {
  const healthStatus = readString(health, ['status', 'state', 'health'], '').toLowerCase();
  return ['critical', 'failed', 'down', 'error', 'unhealthy'].includes(healthStatus);
}

class AdminComplianceService {
  async getComplianceData(searchTerm: string): Promise<ComplianceData> {
    const backend = getBackendSdkClientWithSession();
    // The audit-records capability was pruned from the backend SDK contract
    // (no server implementation exists), so the audit log fails closed: the
    // page keeps the implemented ops health surface and reports the log as
    // explicitly unavailable instead of issuing a request that 404s. The
    // search term stays part of the page contract for the capability's return.
    void searchTerm;
    const normalizedHealth = asRecord(await backend.ops.health.retrieve());

    return {
      auditLogs: [],
      auditLogsUnavailable: true,
      legalHolds: readNumber(normalizedHealth, ['legalHolds', 'activeLegalHolds'], 0),
      systemSecure: readBoolean(normalizedHealth, ['systemSecure', 'secure'], !hasCriticalSignals(normalizedHealth)),
      uptime: formatUptime(normalizedHealth),
    };
  }
}

export const adminComplianceService = new AdminComplianceService();
