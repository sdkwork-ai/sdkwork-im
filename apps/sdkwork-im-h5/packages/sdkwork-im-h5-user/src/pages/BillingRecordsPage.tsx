import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { PageLayout } from "@sdkwork/im-h5-commons";
import { ReceiptText } from "lucide-react";
import { BillingService } from "../services/BillingService";

/**
 * 账单记录 — fail-closed (PRD)。
 *
 * 之前硬编码的模拟支付流水已删除：页面改为消费 fail-closed 的
 * `BillingService`，在真实账单 SDK 接入前始终渲染统一的「功能暂不可用」
 * 状态，不再伪造交易数据。
 */
export const BillingRecordsPage = () => {
  const { t } = useTranslation();
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    BillingService.getRecords().catch(() => {
      if (!cancelled) {
        setUnavailable(true);
      }
    }).finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageLayout title={t('user.auto_prop_4173b4d4', 'Billing history')} bgClass="bg-bg-color">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-sub opacity-70">
          <div className="w-8 h-8 rounded-full border-4 border-text-sub border-t-transparent animate-spin mb-3"></div>
          <span className="text-[14px]">{t('user.auto_7f6f37e', 'Loading...')}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 px-8 text-center py-20">
          <ReceiptText className="w-12 h-12 stroke-current opacity-40" />
          <p className="text-[15px] text-text-main">
            {t('commons.feature_unavailable', 'This feature is not available yet while the real service is being integrated.')}
          </p>
        </div>
      )}
    </PageLayout>
  );
};
