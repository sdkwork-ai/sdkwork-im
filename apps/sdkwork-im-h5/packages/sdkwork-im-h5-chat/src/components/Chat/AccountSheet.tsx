import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";

import { Avatar, showConfirm, showToast } from "@sdkwork/im-h5-commons";
import { requestImH5SessionLogout } from "@sdkwork/im-h5-core/session";
import { ProfileService, type UserProfile } from "@sdkwork/im-h5-user";

interface AccountSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Real-SDK account surface for the default composition.
 *
 * The `user` module stays out of `DEFAULT_IM_H5_MODULES` because most of its
 * pages are fail-closed or fabricated; this sheet intentionally renders only
 * IAM-backed identity fields and the app-owned logout executor
 * (`requestImH5SessionLogout`), so sign-out and profile identity stay
 * reachable without composing the mock-heavy module.
 */
export const AccountSheet: React.FC<AccountSheetProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    let cancelled = false;
    setProfile(null);
    ProfileService.getUserProfile()
      .then((next) => {
        if (!cancelled) {
          setProfile(next);
        }
      })
      .catch((error) => {
        console.error("[sdkwork-im-h5] account profile load failed", error);
        if (!cancelled) {
          showToast(t("chat.account.profile_load_failed", "Unable to load profile"));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, t]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const handleSignOut = async () => {
    const confirmed = await showConfirm(
      t("chat.account.sign_out_confirm", "Sign out of Sdkwork IM?"),
    );
    if (!confirmed) {
      return;
    }
    setIsSigningOut(true);
    try {
      await requestImH5SessionLogout();
    } catch (error) {
      console.error("[sdkwork-im-h5] sign-out failed", error);
      showToast(t("chat.account.sign_out_failed", "Sign-out failed, please retry"));
    } finally {
      setIsSigningOut(false);
    }
  };

  return createPortal(
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[9998] bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-[9999] rounded-t-2xl bg-chat-other-bg pb-safe"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 px-6 pt-6">
          <Avatar
            src={profile?.avatar || undefined}
            alt={profile?.name || undefined}
            fallback={profile?.name?.slice(0, 1) || undefined}
            size="xl"
          />
          <div className="text-center">
            <p className="text-[17px] font-semibold text-text-main">
              {profile?.name || t("chat.account.title", "Account")}
            </p>
            {profile?.id ? (
              <p className="mt-1 text-[13px] text-text-secondary">
                ID: {profile.id}
              </p>
            ) : null}
          </div>
        </div>
        <div className="px-6 pb-6 pt-4">
          <button
            type="button"
            disabled={isSigningOut}
            onClick={() => {
              void handleSignOut();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-color py-3 text-[16px] text-red-500 transition-colors active:bg-active-bg disabled:opacity-60"
          >
            <LogOut className="h-5 w-5" />
            {isSigningOut
              ? t("chat.account.signing_out", "Signing out…")
              : t("chat.account.sign_out", "Sign out")}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};
