# Runbook — sdkwork-im log reference (EN)

Healthy startup signature (RUST_LOG=info): the standalone gateway listens on
`0.0.0.0:18079` and the embedded module lifecycle reports ready in order.

## Reading

```bash
bin/docker-deploy.sh logs --environment production --tail 200          # bounded read (default)
bin/docker-deploy.sh logs --environment production --follow            # explicit follow
bin/docker-deploy.sh logs --environment production --export ./out      # redacted ticket attachment
```

## Known failure signatures

| Signature | Meaning | Action |
| --- | --- | --- |
| `connection refused ... 5432` | database unreachable | run `bin/doctor.sh --environment <env>`, check ports/config |
| `relation "..." does not exist` | migrations not applied | check the env database name; migrations are forward-only, restore a backup if needed |
| `readyz` 503 dependency unavailable | postgres/redis not ready | check the health check and dependency containers via `bin/doctor.sh` |
| repeated `panic` + container restarts | crash loop | check restart count via `bin/doctor.sh`; roll the version back |
