import { getBackendSdkClientWithSession } from '@sdkwork/im-pc-admin-sdk';

export interface AdminMetrics {
  systemLoad: { value: string; trend: string; isUp: boolean };
  activeTenants: { value: string; trend: string; isUp: boolean };
  activeConnections: { value: string; trend: string; isUp: boolean };
  globalNodes: { value: string; trend: string; isUp: boolean };
}

export interface NetworkThroughput {
  egress: number;
  ingress: number;
}

export interface SystemAnomaly {
  id: string;
  type: 'critical' | 'warning' | 'info';
  tenant: string;
  message: string;
  time: string;
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  throughput: NetworkThroughput[];
  anomalies: SystemAnomaly[];
  /** True when the audit-records capability backing the anomaly feed is absent. */
  anomaliesUnavailable: boolean;
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as UnknownRecord : {};
}

function asRecordArray(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.map(asRecord).filter((item) => Object.keys(item).length > 0) : [];
}

function readNumber(record: UnknownRecord, keys: string[], fallback = 0): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return fallback;
}

function formatCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  }
  return String(Math.max(0, Math.round(value)));
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return '—';
  }
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

function resolveSystemLoad(health: UnknownRecord): number | null {
  const direct = readNumber(health, ['systemLoad', 'loadPercent', 'cpuUsagePercent'], Number.NaN);
  return Number.isFinite(direct) ? direct : null;
}

function resolveActiveConnections(health: UnknownRecord, cluster: UnknownRecord): number {
  const direct = readNumber(health, ['activeConnections', 'connectionCount', 'websocketConnections'], Number.NaN);
  if (Number.isFinite(direct)) {
    return direct;
  }
  return asRecordArray(cluster.nodes)
    .reduce((total, node) => total + readNumber(node, ['connectionCount', 'connections', 'clientRouteCount'], 0), 0);
}

function buildThroughput(health: UnknownRecord, diagnostics: UnknownRecord): NetworkThroughput[] {
  const samples = asRecordArray(health.throughputSamples)
    .concat(asRecordArray(diagnostics.throughputSamples));
  return samples.slice(0, 12).map((sample) => ({
    egress: readNumber(sample, ['egress', 'egressPercent', 'outbound'], 0),
    ingress: readNumber(sample, ['ingress', 'ingressPercent', 'inbound'], 0),
  }));
}

class AdminDashboardService {
  async getDashboardData(): Promise<AdminDashboardData> {
    const backend = getBackendSdkClientWithSession();
    // The audit-records capability was pruned from the backend SDK contract
    // (no server implementation exists), so the anomaly feed fails closed:
    // the dashboard keeps the implemented ops surfaces and reports the feed
    // as explicitly unavailable instead of issuing a request that 404s.
    const [health, cluster, diagnostics] = await Promise.all([
      backend.ops.health.retrieve(),
      backend.ops.cluster.retrieve(),
      backend.ops.diagnostics.retrieve(),
    ]);
    const normalizedHealth = asRecord(health);
    const normalizedCluster = asRecord(cluster);
    const normalizedDiagnostics = asRecord(diagnostics);
    const nodeCount = asRecordArray(normalizedCluster.nodes).length;
    const activeConnections = resolveActiveConnections(normalizedHealth, normalizedCluster);
    const systemLoad = resolveSystemLoad(normalizedHealth);
    const activeTenants = readNumber(
      normalizedHealth,
      ['activeTenants', 'tenantCount'],
      Number.NaN,
    );

    return {
      metrics: {
        systemLoad: {
          value: formatPercent(systemLoad),
          trend: '',
          isUp: systemLoad !== null && systemLoad < 80,
        },
        activeTenants: {
          value: Number.isFinite(activeTenants) ? formatCount(activeTenants) : '—',
          trend: '',
          isUp: Number.isFinite(activeTenants),
        },
        activeConnections: { value: formatCount(activeConnections), trend: '', isUp: true },
        globalNodes: { value: String(nodeCount), trend: '', isUp: nodeCount > 0 },
      },
      throughput: buildThroughput(normalizedHealth, normalizedDiagnostics),
      anomalies: [],
      anomaliesUnavailable: true,
    };
  }
}

export const adminDashboardService = new AdminDashboardService();
