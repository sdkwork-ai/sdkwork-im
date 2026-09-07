#!/usr/bin/env bash
# Sync fixed identity-projection cloud dists (PC + H5) into the deploy checkout.
# Run inside WSL: bash /mnt/e/sdkwork-space/sdkwork-im/scripts/dev/deploy-sync-im-cloud-dist.sh
set -euo pipefail

SRC=/mnt/e/sdkwork-space/sdkwork-im/apps
TGT=/opt/deploy/sdkwork-space/sdkwork-im/apps

echo "[1/4] sync PC dist/cloud"
rm -rf "${TGT}/sdkwork-im-pc/dist/cloud"
cp -r "${SRC}/sdkwork-im-pc/dist/cloud" "${TGT}/sdkwork-im-pc/dist/cloud"

echo "[2/4] sync H5 dist/cloud"
rm -rf "${TGT}/sdkwork-im-h5/dist/cloud"
cp -r "${SRC}/sdkwork-im-h5/dist/cloud" "${TGT}/sdkwork-im-h5/dist/cloud"

echo "[3/4] fingerprint check (expect >0 hits for x-sdkwork-operation-id)"
PC_HITS=$(grep -rlo "x-sdkwork-operation-id" "${TGT}/sdkwork-im-pc/dist/cloud" | wc -l)
H5_HITS=$(grep -rlo "x-sdkwork-operation-id" "${TGT}/sdkwork-im-h5/dist/cloud" | wc -l)
echo "pc-chunks-with-fingerprint=${PC_HITS} h5-chunks-with-fingerprint=${H5_HITS}"

echo "[4/4] done"
