# Runbook — sdkwork-im 部署 / 升级 / 回滚（中文）

前置：目标机已装 Docker + compose 插件；`bin/docker-image.sh build` 已产出镜像（或用 save/load 离线导入）。数据库需 pgvector 扩展（knowledgebase 模块要求）。

## 1. 安装（首次）

```bash
bin/docker-deploy.sh install --environment <development|test|staging|demo|production>
bin/docker-deploy.sh install --environment production --yes   # 生产必须显式 --yes
```

## 2. 升级

staging/demo/production 自动先生成变更前备份（`--skip-backup` 可跳过，会记录证据）：

```bash
bin/docker-image.sh build
bin/docker-deploy.sh upgrade --environment staging --image-tag <新版本>
```

## 3. 验证（发布门禁）

```bash
bin/docker-deploy.sh status --environment staging
```

## 4. 回滚

```bash
bin/docker-deploy.sh rollback --environment staging                  # 台账上一个成功版本
bin/docker-deploy.sh rollback --environment staging --to 0.1.0       # 指定版本
```

回滚由管理端口 `/healthz` 门禁把关；失败自动回退并写入 `release-state/<env>/ledger.jsonl`。迁移是前向的：跨不兼容 schema 只能走数据恢复（backup-restore.md）。

## 5. 下线

```bash
bin/docker-deploy.sh down --environment staging
bin/docker-deploy.sh stop    --environment staging               # 停止（保留容器与卷，不重打包）
bin/docker-deploy.sh start   --environment staging               # 启动已停止的栈（先起嵌入式依赖）
bin/docker-deploy.sh restart --environment staging               # 只重启应用实例（依赖与网关不中断）
bin/docker-deploy.sh down --environment staging --purge --yes
```
