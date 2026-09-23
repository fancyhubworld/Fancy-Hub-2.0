"use client";

import React from "react";
import { WidgetInstance, WidgetType } from "@/lib/widget-types";

// 1. Content Widgets
import {
  TextWidget,
  HeadingWidget,
  RichTextWidget,
  ImageWidget,
  VideoWidget,
  IconWidget,
  ButtonWidget,
  HtmlBlockWidget,
} from "./ContentWidgets";

// 2. E-commerce Widgets
import {
  ProductGridWidget,
  ProductCarouselWidget,
  ProductSliderWidget,
  ProductCardWidget,
  FlashDealsWidget,
  BestSellersWidget,
  NewArrivalsWidget,
  FeaturedProductsWidget,
  TrendingProductsWidget,
  RecentlyViewedWidget,
  RecommendedProductsWidget,
  DealsWidget,
  WishlistProductsWidget,
} from "./EcommerceWidgets";

// 3. Category & Vendor Widgets
import {
  CategoryGridWidget,
  CategoryCarouselWidget,
  CategoryCardsWidget,
  FeaturedCategoriesWidget,
  MegaCategoryMenuWidget,
  VendorGridWidget,
  TopVendorsWidget,
  FeaturedVendorsWidget,
  VendorStoreCardWidget,
  VendorProductsWidget,
} from "./CategoryVendorWidgets";

// 4. Marketing & Trust Widgets
import {
  HeroBannerWidget,
  PromoBannerWidget,
  CouponBannerWidget,
  CountdownTimerWidget,
  AnnouncementBarWidget,
  OfferStripWidget,
  FestivalBannerWidget,
  NewsletterWidget,
  CtaBannerWidget,
  FastDeliveryWidget,
  SecurePaymentsWidget,
  TrustedVendorsWidget,
  EasyReturnsWidget,
  TrustBadgesWidget,
} from "./MarketingTrustWidgets";

// 5. Social & Utility Widgets
import {
  BlogPostsWidget,
  TestimonialsWidget,
  FaqWidget,
  ReviewsWidget,
  InstagramGalleryWidget,
  BrandLogosWidget,
  SearchWidget,
  BreadcrumbsWidget,
  PaginationWidget,
  FiltersWidget,
  SortWidget,
  CompareTrayWidget,
  WishlistButtonWidget,
  CartSummaryWidget,
  AccountSummaryWidget,
} from "./SocialUtilityWidgets";
import { ShoppableReelsWidget } from "./ShoppableReelsWidget";
import { SpinWheelWidget } from "./SpinWheelWidget";
import { ScratchCardWidget } from "./ScratchCardWidget";
import { GroupBuyingWidget } from "./GroupBuyingWidget";

interface WidgetDispatcherProps {
  widget: WidgetInstance | any;
  isEditing?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function WidgetDispatcher({ widget, isEditing, isSelected, onSelect }: WidgetDispatcherProps) {
  // Normalize settings, styles, and types from legacy or modern schema
  const parseJson = (val: any) => {
    if (typeof val === "object" && val !== null) return val;
    try {
      return JSON.parse(val || "{}");
    } catch {
      return {};
    }
  };

  const type = (widget.type || "PRODUCT_GRID").toUpperCase();
  const settings = {
    ...parseJson(widget.contentJson),
    ...parseJson(widget.settings),
    title: widget.title || widget.settings?.title,
    subtitle: widget.subtitle || widget.settings?.subtitle,
    badgeText: widget.badgeText || widget.settings?.badgeText,
  };
  const style = {
    ...parseJson(widget.stylingJson),
    ...parseJson(widget.style),
  };

  const normalizedWidget: WidgetInstance = {
    id: widget.id || "widget-preview",
    type: type as WidgetType,
    name: widget.name || widget.title || type,
    status: widget.status || (widget.isActive === false ? "INACTIVE" : "ACTIVE"),
    settings,
    style,
    responsiveSettings: parseJson(widget.responsiveSettings),
    dataSource: parseJson(widget.dataSource),
    visibilityRules: parseJson(widget.visibilityRules),
    sortOrder: widget.sortOrder || 0,
    title: widget.title,
    subtitle: widget.subtitle,
    badgeText: widget.badgeText,
    isActive: widget.isActive !== false,
    desktopVisible: widget.desktopVisible !== false,
    mobileVisible: widget.mobileVisible !== false,
  };

  // Render Component mapping
  const renderWidgetComponent = () => {
    switch (type) {
      // 1. Content
      case "TEXT":
        return <TextWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "HEADING":
        return <HeadingWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "RICH_TEXT":
      case "RICH_CONTENT":
        return <RichTextWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "IMAGE":
      case "CUSTOM_PRINT":
        return <ImageWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "VIDEO":
        return <VideoWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "ICON":
        return <IconWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "BUTTON":
        return <ButtonWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "HTML_BLOCK":
        return <HtmlBlockWidget widget={normalizedWidget} isEditing={isEditing} />;

      // 2. E-commerce
      case "PRODUCT_GRID":
        return <ProductGridWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "PRODUCT_CAROUSEL":
        return <ProductCarouselWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "PRODUCT_SLIDER":
        return <ProductSliderWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "PRODUCT_CARD":
        return <ProductCardWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "FLASH_DEALS":
        return <FlashDealsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "BEST_SELLERS":
        return <BestSellersWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "NEW_ARRIVALS":
        return <NewArrivalsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "FEATURED_PRODUCTS":
        return <FeaturedProductsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "TRENDING_PRODUCTS":
        return <TrendingProductsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "RECENTLY_VIEWED":
        return <RecentlyViewedWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "RECOMMENDED_PRODUCTS":
        return <RecommendedProductsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "DEALS":
        return <DealsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "WISHLIST_PRODUCTS":
        return <WishlistProductsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "GROUP_BUYING":
        return <GroupBuyingWidget settings={settings} style={style} />;

      // 3. Category
      case "CATEGORY_GRID":
        return <CategoryGridWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "CATEGORY_CAROUSEL":
      case "CATEGORY_STRIP":
        return <CategoryCarouselWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "CATEGORY_CARDS":
        return <CategoryCardsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "FEATURED_CATEGORIES":
        return <FeaturedCategoriesWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "MEGA_CATEGORY_MENU":
        return <MegaCategoryMenuWidget widget={normalizedWidget} isEditing={isEditing} />;

      // 4. Vendor
      case "VENDOR_GRID":
      case "VENDOR_SPOTLIGHT":
        return <VendorGridWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "TOP_VENDORS":
        return <TopVendorsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "FEATURED_VENDORS":
        return <FeaturedVendorsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "VENDOR_STORE_CARD":
        return <VendorStoreCardWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "VENDOR_PRODUCTS":
        return <VendorProductsWidget widget={normalizedWidget} isEditing={isEditing} />;

      // 5. Marketing
      case "HERO_BANNER":
      case "HERO_SLIDER":
        return <HeroBannerWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "PROMO_BANNER":
      case "PROMO_BANNERS":
        return <PromoBannerWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "COUPON_BANNER":
        return <CouponBannerWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "COUNTDOWN_TIMER":
        return <CountdownTimerWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "ANNOUNCEMENT_BAR":
      case "ANNOUNCEMENT_TICKER":
        return <AnnouncementBarWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "OFFER_STRIP":
        return <OfferStripWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "FESTIVAL_BANNER":
        return <FestivalBannerWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "NEWSLETTER":
        return <NewsletterWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "CTA_BANNER":
        return <CtaBannerWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "SPIN_WHEEL":
        return <SpinWheelWidget settings={settings} style={style} />;
      case "SCRATCH_CARD":
        return <ScratchCardWidget settings={settings} style={style} />;

      // 6. Trust
      case "FAST_DELIVERY":
        return <FastDeliveryWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "SECURE_PAYMENTS":
        return <SecurePaymentsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "TRUSTED_VENDORS":
        return <TrustedVendorsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "EASY_RETURNS":
        return <EasyReturnsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "TRUST_BADGES":
      case "TRUST_ASSURANCE":
        return <TrustBadgesWidget widget={normalizedWidget} isEditing={isEditing} />;

      // 7. Social & Reviews
      case "BLOG_POSTS":
        return <BlogPostsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "TESTIMONIALS":
        return <TestimonialsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "FAQ":
      case "FAQ_ACCORDION":
        return <FaqWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "REVIEWS":
        return <ReviewsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "INSTAGRAM_GALLERY":
        return <InstagramGalleryWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "SHOPPABLE_REELS":
      case "LIVE_VIDEO_COMMERCE":
        return <ShoppableReelsWidget settings={settings} style={style} />;
      case "BRAND_LOGOS":
        return <BrandLogosWidget widget={normalizedWidget} isEditing={isEditing} />;

      // 8. Utility
      case "SEARCH":
        return <SearchWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "BREADCRUMBS":
        return <BreadcrumbsWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "PAGINATION":
        return <PaginationWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "FILTERS":
        return <FiltersWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "SORT":
        return <SortWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "RECENTLY_VIEWED_UTILITY":
        return <RecentlyViewedWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "COMPARE_TRAY":
        return <CompareTrayWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "WISHLIST_BUTTON":
        return <WishlistButtonWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "CART_SUMMARY":
        return <CartSummaryWidget widget={normalizedWidget} isEditing={isEditing} />;
      case "ACCOUNT_SUMMARY":
        return <AccountSummaryWidget widget={normalizedWidget} isEditing={isEditing} />;

      default:
        return <ProductGridWidget widget={normalizedWidget} isEditing={isEditing} />;
    }
  };

  const paddingY = style.paddingY || "py-4";
  const bgStyle = style.backgroundColor ? { backgroundColor: style.backgroundColor } : {};

  return (
    <section
      onClick={onSelect}
      style={bgStyle}
      className={`w-full ${paddingY} transition-all duration-200 ${
        isEditing ? "cursor-pointer" : ""
      } ${
        isSelected ? "relative z-10" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderWidgetComponent()}
      </div>
    </section>
  );
}
