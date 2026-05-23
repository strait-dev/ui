"use client";

/**
 * Thin re-export shim — all logic now lives in {@link ./banner}.
 *
 * Existing import paths (`from "./notice-banner"`) continue to work unchanged.
 *
 * {@link Banner}
 */
export {
  Banner,
  BannerActions,
  BannerClose,
  BannerContent,
  BannerDescription,
  BannerIcon,
  type BannerProps,
  BannerTitle,
  bannerVariants,
  NoticeBanner,
  NoticeBannerAction,
  type NoticeBannerVariants,
  noticeBannerVariants,
} from "./banner";
