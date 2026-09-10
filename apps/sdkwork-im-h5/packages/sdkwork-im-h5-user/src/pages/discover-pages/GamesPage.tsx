import { useTranslation } from "react-i18next";
import React from "react";
import { PageLayout } from "../../components/SettingsCommons";
import { Gamepad2 } from "lucide-react";

/**
 * 游戏中心 — fail-closed (PRD)。
 *
 * 之前硬编码的游戏榜单（picsum 占位图、伪造的玩家数量、虚构的推荐位）已
 * 删除：没有真实游戏目录 SDK 之前，页面只渲染统一的「功能暂不可用」状态，
 * 不再伪造商店数据。
 */
export const GamesPage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title={t('user.auto_prop_3394384d', 'Game Center')}>
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center py-20">
        <Gamepad2 className="w-12 h-12 stroke-current opacity-40" />
        <p className="text-[15px] text-text-main">
          {t('commons.feature_unavailable', 'This feature is not available yet while the real service is being integrated.')}
        </p>
      </div>
    </PageLayout>
  );
};
