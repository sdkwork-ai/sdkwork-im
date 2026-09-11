# Runbooks

Operational runbooks for Sdkwork IM production deployments. Each runbook follows the `RUNBOOK-*.md` naming convention and covers a single operational procedure.

## Index

| Runbook | Scope |
| --- | --- |
| [RUNBOOK-token-key-rotation.md](RUNBOOK-token-key-rotation.md) | JWT signing key and IAM tenant key rotation |
| [RUNBOOK-tenant-isolation-verification.md](RUNBOOK-tenant-isolation-verification.md) | Cross-tenant data isolation audit |
| [RUNBOOK-migration-rollback.md](RUNBOOK-migration-rollback.md) | Database migration rollback procedure |
| [RUNBOOK-provider-outage.md](RUNBOOK-provider-outage.md) | Postgres/Redis provider outage response |
| [RUNBOOK-audit-log-investigation.md](RUNBOOK-audit-log-investigation.md) | Audit ledger investigation and export |

## Convention

Each runbook MUST include:

1. Trigger conditions (when to execute)
2. Prerequisites (access, tools, env vars)
3. Step-by-step procedure with verification commands
4. Rollback / safety net
5. Escalation contacts


<!-- scaffold-module-runbooks:index -->
## Docker 运维四件套（bin/ 标准，OPERATIONS_SPEC.md §7）

| Runbook | 内容 |
| --- | --- |
| [deploy.md](deploy.md) / [deploy.en.md](deploy.en.md) | 安装 / 升级 / 回滚 / 下线（bin/docker-deploy.sh + bin/docker-image.sh） |
| [troubleshooting.md](troubleshooting.md) / [troubleshooting.en.md](troubleshooting.en.md) | 症状 → doctor 检查 → 处置 |
| [backup-restore.md](backup-restore.md) / [backup-restore.en.md](backup-restore.en.md) | 备份 / 校验 / 恢复 / 演练（bin/backup.sh） |
| [log-reference.md](log-reference.md) / [log-reference.en.md](log-reference.en.md) | 健康日志特征与失败签名（bin/docker-deploy.sh logs） |
