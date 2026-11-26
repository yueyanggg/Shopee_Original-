/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CATEGORIES, PRODUCTS, VOUCHERS } from './data/marketplaceData';
import { CartItem, FilterState, OrderRecord, Product, ScreenView } from './types/marketplace';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CartAndCheckoutScreen } from './screens/CartAndCheckoutScreen';

const INITIAL_FILTERS: FilterState = {
  query: '',
  categoryIds: [],
  mallOnly: false,
  freeShippingOnly: false,
  flashSaleOnly: false,
  cashbackOnly: false,
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  sortBy: 'relevance',
};

export default function App() {
  const [screen, setScreen] = useState<ScreenView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: 'p-01', variant: 'Midnight Black', quantity: 1, selected: true },
    { productId: 'p-03', variant: '30ml + Mini Cleanser', quantity: 1, selected: true },
  ]);

  const [claimedVoucherIds, setClaimedVoucherIds] = useState<string[]>(['v-ship']);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>('v-ship');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen, selectedProduct.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2200);
  };

  const handleNavigate = (nextScreen: ScreenView) => {
    setScreen(nextScreen);
  };

  const handleSearchSubmit = (query: string) => {
    setFilters({ ...INITIAL_FILTERS, query });
    setScreen('catalog');
  };

  const handleSelectCategory = (categoryId: string) => {
    setFilters({ ...INITIAL_FILTERS, categoryIds: [categoryId] });
    setScreen('catalog');
  };

  const handleQuickFilter = (type: 'mall' | 'flash' | 'freeShipping' | 'all') => {
    setFilters({
      ...INITIAL_FILTERS,
      mallOnly: type === 'mall',
      flashSaleOnly: type === 'flash',
      freeShippingOnly: type === 'freeShipping',
    });
    setScreen('catalog');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setScreen('product');
  };

  const handleAddToCart = (product: Product, variant: string, quantity: number) => {
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === product.id && item.variant === variant
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: Math.min(product.stock, next[idx].quantity + quantity),
          selected: true,
        };
        return next;
      }
      return [...prev, { productId: product.id, variant, quantity, selected: true }];
    });
    showToast(`Added ${quantity}x ${product.title.slice(0, 32)}... to cart`);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, product.variants.options[0], 1);
  };

  const handleBuyNow = (product: Product, variant: string, quantity: number) => {
    handleAddToCart(product, variant, quantity);
    setScreen('cart');
  };

  const handleClaimVoucher = (voucherId: string) => {
    if (!claimedVoucherIds.includes(voucherId)) {
      setClaimedVoucherIds((prev) => [...prev, voucherId]);
      const v = VOUCHERS.find((x) => x.id === voucherId);
      if (v) showToast(`Claimed ${v.title} voucher (${v.code})`);
    }
  };

  const handleToggleSelect = (productId: string, variant: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variant === variant
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const handleToggleSelectAll = (selected: boolean) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const handleUpdateQty = (productId: string, variant: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId || item.variant !== variant) return item;
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          return { ...item, quantity: nextQty };
        })
        .filter((x): x is CartItem => x !== null)
    );
  };

  const handleRemoveItem = (productId: string, variant: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variant === variant))
    );
  };

  const handlePlaceOrder = (payload: {
    recipientName: string;
    phone: string;
    address: string;
    paymentMethod: string;
    subtotal: number;
    shippingFee: number;
    voucherDiscount: number;
    total: number;
  }) => {
    const selectedCartItems = cartItems.filter((i) => i.selected);
    const orderId = `SHP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      id: orderId,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Preparing Shipment',
      items: selectedCartItems.map((ci) => {
        const p = PRODUCTS.find((prod) => prod.id === ci.productId)!;
        return {
          productId: p.id,
          title: p.title,
          variant: ci.variant,
          quantity: ci.quantity,
          unitPrice: p.price,
          visual: p.visual,
          shopName: p.shopName,
        };
      }),
      subtotal: payload.subtotal,
      shippingFee: payload.shippingFee,
      voucherDiscount: payload.voucherDiscount,
      total: payload.total,
      paymentMethod: payload.paymentMethod,
      recipientName: payload.recipientName,
      address: payload.address,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrderId(orderId);
    setCartItems((prev) => prev.filter((item) => !item.selected));
    setSelectedVoucherId(null);
    setScreen('orders');
    showToast(`Order #${orderId} placed successfully!`);
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== selectedProduct.id
  ).sort((a, b) =>
    a.categoryId === selectedProduct.categoryId && b.categoryId !== selectedProduct.categoryId
      ? -1
      : 1
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#222222]">
      <Header
        currentScreen={screen}
        onNavigate={handleNavigate}
        searchQuery={filters.query}
        onSearchSubmit={handleSearchSubmit}
        onQuickFilter={handleQuickFilter}
        cartItems={cartItems}
        products={PRODUCTS}
        claimedVoucherIds={claimedVoucherIds}
        onSelectProduct={handleSelectProduct}
        ordersCount={orders.length}
      />

      <main className="flex-1">
        {screen === 'home' && (
          <HomeScreen
            categories={CATEGORIES}
            products={PRODUCTS}
            vouchers={VOUCHERS}
            claimedVoucherIds={claimedVoucherIds}
            onClaimVoucher={handleClaimVoucher}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onQuickFilter={handleQuickFilter}
          />
        )}

        {screen === 'catalog' && (
          <CatalogScreen
            categories={CATEGORIES}
            products={PRODUCTS}
            filters={filters}
            onUpdateFilters={setFilters}
            onClearFilters={() => setFilters(INITIAL_FILTERS)}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onBackHome={() => setScreen('home')}
          />
        )}

        {screen === 'product' && (
          <ProductDetailScreen
            key={selectedProduct.id}
            product={selectedProduct}
            relatedProducts={relatedProducts}
            vouchers={VOUCHERS}
            claimedVoucherIds={claimedVoucherIds}
            onClaimVoucher={handleClaimVoucher}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            onBackHome={() => setScreen('home')}
          />
        )}

        {(screen === 'cart' || screen === 'checkout' || screen === 'orders') && (
          <CartAndCheckoutScreen
            mode={screen}
            cartItems={cartItems}
            products={PRODUCTS}
            vouchers={VOUCHERS}
            claimedVoucherIds={claimedVoucherIds}
            selectedVoucherId={selectedVoucherId}
            orders={orders}
            latestOrderId={latestOrderId}
            onClaimVoucher={handleClaimVoucher}
            onSelectVoucher={setSelectedVoucherId}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onProceedCheckout={() => setScreen('checkout')}
            onBackToCart={() => setScreen('cart')}
            onPlaceOrder={handlePlaceOrder}
            onSelectProduct={handleSelectProduct}
            onContinueShopping={() => setScreen('home')}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} onQuickFilter={handleQuickFilter} />

      {/* Crisp Action Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#222222]/92 text-white px-5 py-3 rounded-[2px] shadow-lg flex items-center gap-2 text-[13px] font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-[#FFCE3D] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
