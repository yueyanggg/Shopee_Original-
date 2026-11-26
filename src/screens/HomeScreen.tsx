import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Truck,
  Store,
  Coins,
  Ticket,
  Sparkles,
  Laptop,
  Sofa,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Category, Product, Voucher } from '../types/marketplace';
import { ProductCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';

interface HomeScreenProps {
  categories: Category[];
  products: Product[];
  vouchers: Voucher[];
  claimedVoucherIds: string[];
  onClaimVoucher: (voucherId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onQuickFilter: (type: 'mall' | 'flash' | 'freeShipping' | 'all') => void;
}

const HERO_SLIDES = [
  {
    id: 'slide-1',
    kicker: '11.25 PAYDAY MEGA SALE',
    title: 'Up to 45% Off Flagship Audio & Desk Setups',
    subtitle: 'Stack $12 Mega Vouchers + Free Next-Day Shipping on Shopee Mall orders.',
    cta: 'Shop Flash Deals',
    action: 'flash' as const,
    bgGradient: 'linear-gradient(125deg, #EE4D2D 0%, #D0011B 62%, #9A1205 100%)',
    visual: 'headphones' as const,
    secondaryVisual: 'keyboard' as const,
    badge: 'LIMITED TIME',
  },
  {
    id: 'slide-2',
    kicker: 'SHOPEE MALL BRAND DAY',
    title: '100% Authentic Official Stores & 15-Day Returns',
    subtitle: 'Discover verified flagship electronics, skincare, and specialty kitchenware.',
    cta: 'Explore Shopee Mall',
    action: 'mall' as const,
    bgGradient: 'linear-gradient(125deg, #D0011B 0%, #9F1239 60%, #700B22 100%)',
    visual: 'espresso' as const,
    secondaryVisual: 'serum' as const,
    badge: 'OFFICIAL STORES',
  },
  {
    id: 'slide-3',
    kicker: 'FREE SHIPPING FESTIVAL',
    title: 'Zero Delivery Fee from $15 Minimum Spend',
    subtitle: 'Claim daily platform shipping vouchers and save automatically at checkout.',
    cta: 'Browse Free Shipping',
    action: 'freeShipping' as const,
    bgGradient: 'linear-gradient(125deg, #FF5722 0%, #E64A19 55%, #B22204 100%)',
    visual: 'sneakers' as const,
    secondaryVisual: 'smartwatch' as const,
    badge: 'DAILY PERK',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  categories,
  products,
  vouchers,
  claimedVoucherIds,
  onClaimVoucher,
  onSelectCategory,
  onSelectProduct,
  onQuickAdd,
  onQuickFilter,
}) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [flashOffset, setFlashOffset] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(2 * 3600 + 18 * 60 + 44);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 2 * 3600 + 59 * 60 + 59));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const autoSlide = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => window.clearInterval(autoSlide);
  }, []);

  const hours = String(Math.floor(secondsRemaining / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondsRemaining % 3600) / 60)).padStart(2, '0');
  const seconds = String(secondsRemaining % 60).padStart(2, '0');

  const flashSaleProducts = products.filter((p) => p.isFlashSale);
  const visibleFlashCount = 6;
  const maxFlashOffset = Math.max(0, flashSaleProducts.length - visibleFlashCount);
  const visibleFlashProducts = flashSaleProducts.slice(
    flashOffset,
    flashOffset + visibleFlashCount
  );

  const activeSlide = HERO_SLIDES[heroIndex];

  const quickServices = [
    {
      label: 'Flash Deals',
      icon: Zap,
      bg: '#FFF1EE',
      color: '#EE4D2D',
      onClick: () => onQuickFilter('flash'),
    },
    {
      label: 'Shopee Mall',
      icon: Store,
      bg: '#FDECEF',
      color: '#D0011B',
      onClick: () => onQuickFilter('mall'),
    },
    {
      label: 'Free Shipping',
      icon: Truck,
      bg: '#ECFDF5',
      color: '#059669',
      onClick: () => onQuickFilter('freeShipping'),
    },
    {
      label: '10% Cashback',
      icon: Coins,
      bg: '#FFFBEB',
      color: '#D97706',
      onClick: () => onQuickFilter('all'),
    },
    {
      label: 'Electronics',
      icon: Laptop,
      bg: '#EEF2FF',
      color: '#4F46E5',
      onClick: () => onSelectCategory('electronics'),
    },
    {
      label: 'Beauty Care',
      icon: Sparkles,
      bg: '#FDF2F8',
      color: '#DB2777',
      onClick: () => onSelectCategory('beauty'),
    },
    {
      label: 'Home Living',
      icon: Sofa,
      bg: '#FFF7ED',
      color: '#EA580C',
      onClick: () => onSelectCategory('home'),
    },
    {
      label: 'All Vouchers',
      icon: Ticket,
      bg: '#FEF2F2',
      color: '#EE4D2D',
      onClick: () => {
        const el = document.getElementById('voucher-strip');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <div className="w-full pb-12">
      {/* Top White Banner Surface */}
      <section className="bg-white border-b border-[#EBEBEB] pt-5 pb-4">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Hero Grid: 8-col Carousel + 4-col Stacked Promos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[6px]">
            {/* Main Hero Banner */}
            <div
              className="lg:col-span-8 relative h-[250px] sm:h-[270px] rounded-[2px] overflow-hidden text-white flex items-center justify-between px-6 sm:px-9"
              style={{ background: activeSlide.bgGradient }}
            >
              <div className="relative z-10 max-w-[430px]">
                <div className="inline-block bg-[#FFE97A] text-[#D0011B] text-[10px] font-bold px-2 py-0.5 rounded-[2px] tracking-[0.04em] uppercase mb-2.5">
                  {activeSlide.kicker}
                </div>
                <h1 className="font-display text-[26px] sm:text-[32px] font-bold leading-[1.18] tracking-[-0.02em] text-white">
                  {activeSlide.title}
                </h1>
                <p className="mt-2 text-[13px] leading-[18px] text-white/90">
                  {activeSlide.subtitle}
                </p>
                <button
                  type="button"
                  onClick={() => onQuickFilter(activeSlide.action)}
                  className="mt-4 h-[36px] px-5 bg-white text-[#EE4D2D] hover:bg-[#FFF5F1] font-semibold text-[13px] rounded-[2px] inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>{activeSlide.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dual Showcase Product Cutouts */}
              <div className="hidden sm:flex items-center gap-3 relative z-10">
                <div className="w-[148px] h-[148px] rounded-[4px] bg-white p-1.5 shadow-md rotate-[-3deg]">
                  <ProductVisual kind={activeSlide.visual} />
                </div>
                <div className="w-[112px] h-[112px] rounded-[4px] bg-white p-1 shadow-md rotate-[4deg] -ml-6 mt-12">
                  <ProductVisual kind={activeSlide.secondaryVisual} />
                </div>
              </div>

              {/* Left / Right Carousel Arrows */}
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() =>
                  setHeroIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-11 bg-black/25 hover:bg-black/45 text-white flex items-center justify-center rounded-[2px] transition-colors cursor-pointer z-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-11 bg-black/25 hover:bg-black/45 text-white flex items-center justify-center rounded-[2px] transition-colors cursor-pointer z-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Slide Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === heroIndex ? 'w-5 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right 4-Col Stacked Mini Promo Cards */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-[6px] h-full">
              <button
                type="button"
                onClick={() => onQuickFilter('mall')}
                className="relative h-[132px] rounded-[2px] overflow-hidden border border-[#EBEBEB] bg-[#FFF5F1] hover:border-[#EE4D2D] transition-colors text-left p-4 flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <span className="inline-block bg-[#D0011B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                    Shopee Mall
                  </span>
                  <div className="font-display text-[17px] font-bold text-[#222222] mt-1.5 leading-[21px]">
                    100% Authentic Brands
                  </div>
                  <div className="text-[12px] text-[#757575] mt-1 group-hover:text-[#EE4D2D] transition-colors">
                    Up to 40% Off Official Stores →
                  </div>
                </div>
                <div className="w-[82px] h-[82px] rounded-[2px] overflow-hidden border border-[#EBEBEB] shrink-0 bg-white">
                  <ProductVisual kind="camera" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => onQuickFilter('freeShipping')}
                className="relative h-[132px] rounded-[2px] overflow-hidden border border-[#EBEBEB] bg-[#FFFBEB] hover:border-[#EE4D2D] transition-colors text-left p-4 flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <span className="inline-block bg-[#EE4D2D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                    FREE SHIPPING
                  </span>
                  <div className="font-display text-[17px] font-bold text-[#222222] mt-1.5 leading-[21px]">
                    Daily $15 Free Delivery
                  </div>
                  <div className="text-[12px] text-[#757575] mt-1 group-hover:text-[#EE4D2D] transition-colors">
                    Tap to Shop Eligible Items →
                  </div>
                </div>
                <div className="w-[82px] h-[82px] rounded-[2px] overflow-hidden border border-[#EBEBEB] shrink-0 bg-white">
                  <ProductVisual kind="flask" />
                </div>
              </button>
            </div>
          </div>

          {/* 8 Quick Service Shortcuts */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-5">
            {quickServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <button
                  key={svc.label}
                  type="button"
                  onClick={svc.onClick}
                  className="flex flex-col items-center gap-1.5 py-1.5 rounded-[2px] hover:-translate-y-0.5 transition-transform cursor-pointer group"
                >
                  <div
                    className="w-[46px] h-[46px] rounded-[12px] border border-[#EBEBEB] flex items-center justify-center transition-colors group-hover:border-[#EE4D2D]"
                    style={{ backgroundColor: svc.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: svc.color }} />
                  </div>
                  <span className="text-[12px] leading-[15px] text-[#222222] text-center group-hover:text-[#EE4D2D]">
                    {svc.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 space-y-5 mt-5">
        {/* CATEGORIES 8x2 MATRIX */}
        <section className="bg-white border border-[#EBEBEB] rounded-[2px] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#EBEBEB] flex items-center justify-between">
            <h2 className="font-display text-[16px] font-semibold text-[#757575] uppercase tracking-[0.02em]">
              Categories
            </h2>
            <button
              type="button"
              onClick={() => onQuickFilter('all')}
              className="text-[13px] text-[#EE4D2D] hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col items-center justify-center py-4 px-2 border-r border-b border-[#F2F2F2] hover:border-[#EE4D2D]/40 hover:bg-[#FFFDFC] hover:shadow-[inset_0_0_0_1px_rgba(238,77,45,0.2)] transition-all cursor-pointer group"
              >
                <div
                  className="w-[48px] h-[48px] rounded-[8px] overflow-hidden border border-[#EBEBEB] mb-2 p-1 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: cat.accentBg }}
                >
                  <ProductVisual kind={cat.visual} />
                </div>
                <span className="text-[12px] leading-[15px] text-[#222222] text-center line-clamp-2 group-hover:text-[#EE4D2D]">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* FLASH SALE BLOCK WITH BLACK COUNTDOWN BOXES */}
        <section className="bg-white border border-[#EBEBEB] rounded-[2px] relative">
          <div className="px-5 py-3.5 border-b border-[#EBEBEB] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[#EE4D2D]">
                <Zap className="w-5 h-5 fill-[#EE4D2D]" />
                <span className="font-display text-[20px] font-extrabold tracking-[-0.02em] uppercase">
                  FLASH SALE
                </span>
              </div>

              {/* Black Countdown Boxes */}
              <div className="flex items-center gap-1" aria-label="Flash sale countdown timer">
                <span className="bg-[#000000] text-white font-display text-[15px] font-bold leading-[18px] px-1.5 py-1 rounded-[2px] tabular-nums">
                  {hours}
                </span>
                <span className="text-[#222222] font-bold text-[14px]">:</span>
                <span className="bg-[#000000] text-white font-display text-[15px] font-bold leading-[18px] px-1.5 py-1 rounded-[2px] tabular-nums">
                  {minutes}
                </span>
                <span className="text-[#222222] font-bold text-[14px]">:</span>
                <span className="bg-[#000000] text-white font-display text-[15px] font-bold leading-[18px] px-1.5 py-1 rounded-[2px] tabular-nums">
                  {seconds}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onQuickFilter('flash')}
              className="text-[13px] font-medium text-[#EE4D2D] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative p-3">
            {/* Carousel Controls */}
            {flashOffset > 0 && (
              <button
                type="button"
                aria-label="Previous flash sale items"
                onClick={() => setFlashOffset((prev) => Math.max(0, prev - 1))}
                className="hidden md:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#EBEBEB] shadow-md items-center justify-center text-[#555555] hover:text-[#EE4D2D] hover:scale-110 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {flashOffset < maxFlashOffset && (
              <button
                type="button"
                aria-label="Next flash sale items"
                onClick={() => setFlashOffset((prev) => Math.min(maxFlashOffset, prev + 1))}
                className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#EBEBEB] shadow-md items-center justify-center text-[#555555] hover:text-[#EE4D2D] hover:scale-110 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[10px]">
              {visibleFlashProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                  flashSaleMode
                />
              ))}
            </div>
          </div>
        </section>

        {/* CLAIMABLE VOUCHERS STRIP */}
        <section id="voucher-strip" className="bg-white border border-[#EBEBEB] rounded-[2px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#EE4D2D]" />
              <h2 className="font-display text-[16px] font-semibold text-[#222222] uppercase tracking-[0.01em]">
                Payday Vouchers — Claim & Apply in Cart
              </h2>
            </div>
            <span className="text-[12px] text-[#757575] tabular-nums">
              {claimedVoucherIds.length} of {vouchers.length} claimed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {vouchers.map((voucher) => {
              const isClaimed = claimedVoucherIds.includes(voucher.id);
              return (
                <div
                  key={voucher.id}
                  className="voucher-ticket border border-[#F3D2C9] rounded-[2px] flex items-stretch overflow-hidden"
                >
                  {/* Left Red/Orange Ticket Stub */}
                  <div className="w-[88px] shrink-0 bg-[#FFF5F1] border-r border-dashed border-[#EE4D2D]/40 p-2.5 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-[#EE4D2D] uppercase leading-tight">
                      {voucher.badge}
                    </span>
                    <span className="mt-1 font-mono text-[10px] text-[#757575] font-semibold">
                      {voucher.code}
                    </span>
                  </div>

                  {/* Right Details + Claim Button */}
                  <div className="flex-1 p-2.5 pl-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display text-[16px] font-bold text-[#EE4D2D] leading-tight">
                        {voucher.title}
                      </div>
                      <div className="text-[11px] text-[#222222] mt-0.5 truncate">
                        {voucher.subtitle}
                      </div>
                      <div className="text-[10px] text-[#757575] mt-1">{voucher.expiresIn}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onClaimVoucher(voucher.id)}
                      className={`h-[28px] px-3 rounded-[2px] text-[11px] font-semibold shrink-0 transition-colors cursor-pointer inline-flex items-center gap-1 ${
                        isClaimed
                          ? 'bg-[#FFF5F1] text-[#EE4D2D] border border-[#EE4D2D]'
                          : 'bg-[#EE4D2D] hover:bg-[#D73211] text-white'
                      }`}
                    >
                      {isClaimed ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Claimed</span>
                        </>
                      ) : (
                        <span>Claim</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* DAILY DISCOVER 6-COLUMN FLUID GRID */}
        <section>
          <div className="bg-white border border-[#EBEBEB] rounded-t-[2px] px-5 h-[48px] flex items-center justify-between mb-3">
            <div className="h-full flex items-center border-b-4 border-[#EE4D2D] px-2">
              <h2 className="font-display text-[16px] font-bold text-[#EE4D2D] uppercase tracking-[0.02em]">
                Daily Discover
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onQuickFilter('all')}
              className="text-[13px] text-[#555555] hover:text-[#EE4D2D] font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Filter & Sort All {products.length} Items</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[10px]">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => onQuickFilter('all')}
              className="h-[40px] px-10 bg-white border border-[#EBEBEB] hover:border-[#EE4D2D] hover:bg-[#FFF5F1] text-[#555555] hover:text-[#EE4D2D] text-[14px] font-medium rounded-[2px] transition-colors cursor-pointer"
            >
              Open Full Catalog & Advanced Filters
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
