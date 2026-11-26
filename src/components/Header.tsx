import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  ShoppingCart,
  Bell,
  HelpCircle,
  ClipboardList,
  Ticket,
  Store,
} from 'lucide-react';
import { CartItem, Product, ScreenView } from '../types/marketplace';
import { ProductVisual } from './ProductVisual';

interface HeaderProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  searchQuery: string;
  onSearchSubmit: (query: string) => void;
  onQuickFilter: (type: 'mall' | 'flash' | 'freeShipping' | 'all') => void;
  cartItems: CartItem[];
  products: Product[];
  claimedVoucherIds: string[];
  onSelectProduct: (product: Product) => void;
  ordersCount: number;
}

const TRENDING_SEARCHES = [
  'Sony WH-1000XM5',
  'Mechanical Keyboard',
  'Vitamin C Serum',
  'Espresso Machine',
  'Running Sneakers',
  'Matcha Powder',
];

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  searchQuery,
  onSearchSubmit,
  onQuickFilter,
  cartItems,
  products,
  claimedVoucherIds,
  onSelectProduct,
  ordersCount,
}) => {
  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const totalCartUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(draftQuery.trim());
  };

  return (
    <header
      className="sticky top-0 z-40 w-full text-white border-b border-[#D73211]/30"
      style={{
        background: 'linear-gradient(180deg, #F53D2D 0%, #FF6633 100%)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Top Utility Row */}
        <div className="flex items-center justify-between h-[32px] text-[12px] text-white/95">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap"
            >
              Marketplace Home
            </button>
            <span className="text-white/40">|</span>
            <button
              type="button"
              onClick={() => onQuickFilter('mall')}
              className="hover:text-white/80 transition-colors cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
            >
              <Store className="w-3 h-3" />
              <span>Shopee Mall</span>
            </button>
            <span className="text-white/40 hidden sm:inline">|</span>
            <button
              type="button"
              onClick={() => onQuickFilter('flash')}
              className="hover:text-white/80 transition-colors cursor-pointer hidden sm:inline whitespace-nowrap"
            >
              Flash Deals
            </button>
            <span className="text-white/40 hidden md:inline">|</span>
            <button
              type="button"
              onClick={() => onQuickFilter('all')}
              className="hover:text-white/80 transition-colors cursor-pointer hidden md:inline whitespace-nowrap"
            >
              Browse Catalog
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Flyout */}
            <div
              className="relative"
              onMouseEnter={() => setNotifOpen(true)}
              onMouseLeave={() => setNotifOpen(false)}
            >
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Notifications</span>
              </button>

              {notifOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-[320px] bg-white text-[#222222] rounded-[2px] border border-[#E0E0E0] z-50 overflow-hidden"
                  style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' }}
                >
                  <div className="px-3 py-2 border-b border-[#EBEBEB] text-[12px] font-medium text-[#757575] flex items-center justify-between">
                    <span>Recently Received Notifications</span>
                    <span className="text-[#EE4D2D]">{claimedVoucherIds.length} Vouchers</span>
                  </div>
                  <div className="divide-y divide-[#F5F5F5] text-[12px]">
                    <button
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        onQuickFilter('flash');
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#FFF5F1] transition-colors"
                    >
                      <div className="font-semibold text-[#222222]">11.25 Payday Flash Sale Live Now</div>
                      <div className="text-[#757575] mt-0.5">Up to 45% OFF Sony, Keychron, Breville & more.</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        onNavigate('cart');
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#FFF5F1] transition-colors"
                    >
                      <div className="font-semibold text-[#222222]">Free Shipping Voucher Ready</div>
                      <div className="text-[#757575] mt-0.5">Apply code FREESHIP in cart on orders over $15.</div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className={`inline-flex items-center gap-1 hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap ${
                currentScreen === 'orders' ? 'underline underline-offset-4 font-semibold' : ''
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>My Orders ({ordersCount})</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('cart')}
              className="hidden sm:inline-flex items-center gap-1 hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Vouchers ({claimedVoucherIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => onQuickFilter('all')}
              className="hidden md:inline-flex items-center gap-1 hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </button>
          </div>
        </div>

        {/* Main Brand + 40px Search Bar + Cart Row */}
        <div className="flex items-center justify-between gap-6 py-3">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 shrink-0 cursor-pointer group focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-[4px] bg-white text-[#EE4D2D] flex items-center justify-center shadow-xs group-hover:scale-[1.02] transition-transform">
              <ShoppingBag className="w-5 h-5 stroke-[2.25]" />
            </div>
            <span className="font-display text-[26px] font-bold tracking-[-0.02em] leading-none text-white whitespace-nowrap">
              Shopee
            </span>
          </button>

          {/* Search Container */}
          <div className="flex-1 max-w-[760px]">
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-white rounded-[2px] p-[3px] h-[40px] shadow-xs"
            >
              <input
                type="text"
                value={draftQuery}
                onChange={(e) => setDraftQuery(e.target.value)}
                placeholder="Search products, brands, and Shopee Mall stores..."
                aria-label="Search marketplace products"
                className="flex-1 h-full px-3 text-[14px] text-[#222222] placeholder:text-[#757575] focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                aria-label="Search"
                className="h-[34px] w-[60px] bg-[#EE4D2D] hover:bg-[#D73211] transition-colors text-white rounded-[2px] flex items-center justify-center cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Quick Search Suggestions */}
            <div className="hidden md:flex items-center gap-3 mt-1.5 text-[11px] text-white/90 overflow-hidden">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setDraftQuery(term);
                    onSearchSubmit(term);
                  }}
                  className="hover:text-white hover:underline cursor-pointer whitespace-nowrap"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Button & Hover Flyout */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => setCartPreviewOpen(true)}
            onMouseLeave={() => setCartPreviewOpen(false)}
          >
            <button
              type="button"
              onClick={() => onNavigate('cart')}
              aria-label={`Shopping cart with ${totalCartUnits} items`}
              className="relative p-2 text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-7 h-7 stroke-[2]" />
              {totalCartUnits > 0 && (
                <span className="absolute -top-0.5 -right-1 min-w-[20px] h-[18px] px-1 rounded-full bg-white text-[#EE4D2D] border border-[#EE4D2D] text-[11px] font-bold flex items-center justify-center tabular-nums">
                  {totalCartUnits}
                </span>
              )}
            </button>

            {/* Cart Preview Dropdown */}
            {cartPreviewOpen && (
              <div
                className="hidden lg:block absolute right-0 top-full mt-1 w-[380px] bg-white text-[#222222] rounded-[2px] border border-[#E0E0E0] z-50"
                style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' }}
              >
                <div className="px-3.5 py-2.5 border-b border-[#EBEBEB] text-[13px] text-[#757575]">
                  Recently Added Products
                </div>
                {cartItems.length === 0 ? (
                  <div className="py-10 px-4 text-center text-[13px] text-[#757575]">
                    Your shopping cart is empty.
                  </div>
                ) : (
                  <div className="max-h-[280px] overflow-y-auto divide-y divide-[#F5F5F5]">
                    {cartItems.slice(0, 5).map((item) => {
                      const product = products.find((p) => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <button
                          key={`${item.productId}-${item.variant}`}
                          type="button"
                          onClick={() => {
                            setCartPreviewOpen(false);
                            onSelectProduct(product);
                          }}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#FAFAFA] transition-colors text-left cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-[2px] border border-[#EBEBEB] overflow-hidden shrink-0">
                            <ProductVisual kind={product.visual} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] text-[#222222] truncate">{product.title}</div>
                            <div className="text-[11px] text-[#757575] mt-0.5">
                              {item.variant} · Qty {item.quantity}
                            </div>
                          </div>
                          <div className="font-display font-semibold text-[13px] text-[#EE4D2D] tabular-nums shrink-0">
                            ${(product.price * item.quantity).toFixed(2)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="px-3.5 py-2.5 bg-[#FAFAFA] border-t border-[#EBEBEB] flex items-center justify-between">
                  <span className="text-[12px] text-[#757575] tabular-nums">
                    {totalCartUnits} item{totalCartUnits === 1 ? '' : 's'} in cart
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCartPreviewOpen(false);
                      onNavigate('cart');
                    }}
                    className="h-[34px] px-4 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[13px] font-medium rounded-[2px] transition-colors cursor-pointer"
                  >
                    View My Shopping Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
