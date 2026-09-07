# Runbook — sdkwork-im 日志参考（中文）

健康启动日志特征（RUST_LOG=info）：standalone gateway 监听 `0.0.0.0:18079`，模块生命周期依次 ready。

## 读取

```bash
bin/docker-deploy.sh logs --environment production --tail 200          # 有界读取（默认）
bin/docker-deploy.sh logs --environment production --follow            # 显式跟随
bin/docker-deploy.sh logs --environment production --export ./out      # 导出工单附件（脱敏）
```

## 常见失败签名

| 日志特征 | 含义 | 处置 |
| --- | --- | --- |
| `connection refused ... 5432` | 数据库不可达 | `bin/doctor.sh --environment <env>` 看 ports/config 检查项 |
| `relation "..." does not exist` | 迁移未应用 | 检查 env 数据库名；迁移前向执行，必要时恢复备份 |
| `readyz` 503 依赖不可用 | postgres/redis 未就绪 | 看 `bin/doctor.sh` 的 health 检查项与依赖容器状态 |
| 反复 `panic` + 容器重启 | 启动崩溃循环 | 看 `bin/doctor.sh` resources 的 restart count；回滚版本 |
