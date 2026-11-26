import React, { useMemo, useState } from 'react';
import {
  Check,
  Minus,
  Plus,
  Trash2,
  Truck,
  Ticket,
  Store,
  MapPin,
  CreditCard,
  Banknote,
  Wallet,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react';
import { CartItem, OrderRecord, Product, Voucher } from '../types/marketplace';
import { ProductVisual } from '../components/ProductVisual';

interface CartScreenProps {
  mode: 'cart' | 'checkout' | 'orders';
  cartItems: CartItem[];
  products: Product[];
  vouchers: Voucher[];
  claimedVoucherIds: string[];
  selectedVoucherId: string | null;
  orders: OrderRecord[];
  latestOrderId: string | null;
  onClaimVoucher: (id: string) => void;
  onSelectVoucher: (id: string | null) => void;
  onToggleSelect: (productId: string, variant: string) => void;
  onToggleSelectAll: (selected: boolean) => void;
  onUpdateQty: (productId: string, variant: string, delta: number) => void;
  onRemoveItem: (productId: string, variant: string) => void;
  onProceedCheckout: () => void;
  onBackToCart: () => void;
  onPlaceOrder: (payload: {
    recipientName: string;
    phone: string;
    address: string;
    paymentMethod: string;
    subtotal: number;
    shippingFee: number;
    voucherDiscount: number;
    total: number;
  }) => void;
  onSelectProduct: (product: Product) => void;
  onContinueShopping: () => void;
}

export const CartAndCheckoutScreen: React.FC<CartScreenProps> = ({
  mode,
  cartItems,
  products,
  vouchers,
  claimedVoucherIds,
  selectedVoucherId,
  orders,
  latestOrderId,
  onClaimVoucher,
  onSelectVoucher,
  onToggleSelect,
  onToggleSelectAll,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
  onBackToCart,
  onPlaceOrder,
  onSelectProduct,
  onContinueShopping,
}) => {
  const [recipientName, setRecipientName] = useState('Alex Tan');
  const [phone, setPhone] = useState('+65 9123 4567');
  const [address, setAddress] = useState('18 Marina Boulevard, #14-02, Singapore 018980');
  const [paymentMethod, setPaymentMethod] = useState('ShopeePay Wallet');
  const [formError, setFormError] = useState('');

  const enrichedItems = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter((x): x is CartItem & { product: Product } => x !== null);
  }, [cartItems, products]);

  const selectedItems = enrichedItems.filter((item) => item.selected);
  const allSelected =
    enrichedItems.length > 0 && enrichedItems.every((item) => item.selected);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const originalSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );
  const itemSavings = Math.max(0, originalSubtotal - subtotal);

  const baseShipping =
    selectedItems.length === 0
      ? 0
      : selectedItems.every((i) => i.product.freeShipping) || subtotal >= 15
      ? 0
      : 4.5;

  const activeVoucher = vouchers.find((v) => v.id === selectedVoucherId) ?? null;

  let voucherDiscount = 0;
  let shippingDiscount = 0;
  if (activeVoucher && subtotal >= activeVoucher.minSpend) {
    if (activeVoucher.discountType === 'fixed') {
      voucherDiscount = activeVoucher.value;
    } else if (activeVoucher.discountType === 'percent') {
      const raw = (subtotal * activeVoucher.value) / 100;
      voucherDiscount = activeVoucher.maxCap ? Math.min(raw, activeVoucher.maxCap) : raw;
    } else if (activeVoucher.discountType === 'shipping') {
      shippingDiscount = Math.min(baseShipping, activeVoucher.value);
    }
  }

  const finalShipping = Math.max(0, baseShipping - shippingDiscount);
  const totalPayable = Math.max(0, subtotal + finalShipping - voucherDiscount);

  // ORDERS VIEW
  if (mode === 'orders') {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-4">
        <div className="bg-white border border-[#EBEBEB] rounded-[2px] px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-[20px] font-bold text-[#222222]">
              My Purchases &amp; Order Tracking
            </h1>
            <p className="text-[13px] text-[#757575] mt-0.5">
              Review your confirmed orders, payment methods, and shipment status.
            </p>
          </div>
          <button
            type="button"
            onClick={onContinueShopping}
            className="h-[36px] px-4 border border-[#EE4D2D] text-[#EE4D2D] hover:bg-[#FFF5F1] text-[13px] font-medium rounded-[2px] cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#EBEBEB] rounded-[2px] py-16 text-center">
            <PackageCheck className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
            <div className="text-[16px] font-medium text-[#222222]">No orders placed yet</div>
            <p className="text-[13px] text-[#757575] mt-1">
              Add items to your cart and complete checkout to track your orders here.
            </p>
            <button
              type="button"
              onClick={onContinueShopping}
              className="mt-4 h-[38px] px-6 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[13px] font-medium rounded-[2px] cursor-pointer"
            >
              Explore Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isJustPlaced = order.id === latestOrderId;
              return (
                <div
                  key={order.id}
                  className={`bg-white border rounded-[2px] overflow-hidden ${
                    isJustPlaced ? 'border-[#EE4D2D]' : 'border-[#EBEBEB]'
                  }`}
                >
                  {isJustPlaced && (
                    <div className="bg-[#FFF5F1] border-b border-[#FADCD4] px-5 py-2.5 flex items-center gap-2 text-[13px] text-[#EE4D2D] font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        Order #{order.id} Confirmed — Preparing Shipment
                      </span>
                    </div>
                  )}

                  <div className="px-5 py-3 border-b border-[#EBEBEB] flex flex-wrap items-center justify-between gap-2 text-[13px]">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#222222] tabular-nums">
                        Order #{order.id}
                      </span>
                      <span className="text-[#757575]">{order.createdAt}</span>
                    </div>
                    <span className="text-[#EE4D2D] font-semibold uppercase text-[12px] tracking-[0.02em]">
                      {order.status}
                    </span>
                  </div>

                  <div className="divide-y divide-[#F5F5F5] px-5">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}-${item.variant}`}
                        className="py-3.5 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-16 h-16 border border-[#EBEBEB] rounded-[2px] overflow-hidden shrink-0">
                            <ProductVisual kind={item.visual} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[14px] text-[#222222] font-medium truncate">
                              {item.title}
                            </div>
                            <div className="text-[12px] text-[#757575] mt-0.5">
                              {item.shopName} · Variation: {item.variant}
                            </div>
                            <div className="text-[12px] text-[#222222] mt-0.5 tabular-nums">
                              x{item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-display font-semibold text-[15px] text-[#222222] tabular-nums shrink-0">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#FFFEFB] border-t border-[#EBEBEB] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]">
                    <div className="text-[#757575]">
                      Deliver to <span className="text-[#222222] font-medium">{order.recipientName}</span> ({order.address}) · Paid via{' '}
                      <span className="text-[#222222] font-medium">{order.paymentMethod}</span>
                    </div>
                    <div className="flex items-baseline gap-2 shrink-0">
                      <span className="text-[#555555]">Order Total:</span>
                      <span className="font-display text-[20px] font-bold text-[#EE4D2D] tabular-nums">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // CHECKOUT VIEW
  if (mode === 'checkout') {
    const handleConfirmOrder = (e: React.FormEvent) => {
      e.preventDefault();
      if (!recipientName.trim() || !phone.trim() || !address.trim()) {
        setFormError('Please fill in your recipient name, phone number, and delivery address.');
        return;
      }
      setFormError('');
      onPlaceOrder({
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        paymentMethod,
        subtotal,
        shippingFee: finalShipping,
        voucherDiscount: voucherDiscount + shippingDiscount,
        total: totalPayable,
      });
    };

    return (
      <form onSubmit={handleConfirmOrder} className="max-w-[1200px] mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-[22px] font-bold text-[#222222]">Checkout</h1>
          <button
            type="button"
            onClick={onBackToCart}
            className="text-[13px] text-[#05A] hover:text-[#EE4D2D] cursor-pointer"
          >
            &larr; Back to Shopping Cart
          </button>
        </div>

        {/* Delivery Address Block */}
        <section className="bg-white border border-[#EBEBEB] rounded-[2px] p-5">
          <div className="flex items-center gap-2 text-[#EE4D2D] font-semibold text-[16px] mb-4">
            <MapPin className="w-4 h-4" />
            <span>Delivery Address</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] text-[#757575] mb-1">Full Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full h-[38px] px-3 text-[14px] border border-[#CCCCCC] rounded-[2px] focus:outline-none focus:border-[#EE4D2D]"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#757575] mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-[38px] px-3 text-[14px] border border-[#CCCCCC] rounded-[2px] focus:outline-none focus:border-[#EE4D2D]"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#757575] mb-1">Street Address &amp; Unit</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-[38px] px-3 text-[14px] border border-[#CCCCCC] rounded-[2px] focus:outline-none focus:border-[#EE4D2D]"
              />
            </div>
          </div>
          {formError && <p className="mt-2 text-[12px] text-[#D0011B]">{formError}</p>}
        </section>

        {/* Products Ordered */}
        <section className="bg-white border border-[#EBEBEB] rounded-[2px] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EBEBEB] grid grid-cols-12 text-[13px] font-medium text-[#757575]">
            <div className="col-span-6">Products Ordered</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2 text-right">Item Subtotal</div>
          </div>

          <div className="divide-y divide-[#F5F5F5]">
            {selectedItems.map(({ product, variant, quantity }) => (
              <div
                key={`${product.id}-${variant}`}
                className="px-5 py-3.5 grid grid-cols-12 items-center text-[13px]"
              >
                <div className="col-span-6 flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-[2px] border border-[#EBEBEB] overflow-hidden shrink-0">
                    <ProductVisual kind={product.visual} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#222222] font-medium truncate">{product.title}</div>
                    <div className="text-[12px] text-[#757575]">
                      {product.shopName} · Variation: {variant}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-right tabular-nums">
                  ${product.price.toFixed(2)}
                </div>
                <div className="col-span-2 text-right tabular-nums">{quantity}</div>
                <div className="col-span-2 text-right font-display font-semibold tabular-nums">
                  ${(product.price * quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Method & Order Summary */}
        <section className="bg-white border border-[#EBEBEB] rounded-[2px] p-5 space-y-5">
          <div>
            <h2 className="text-[16px] font-semibold text-[#222222] mb-3">Payment Method</h2>
            <div className="flex flex-wrap gap-2.5">
              {[
                { label: 'ShopeePay Wallet', icon: Wallet },
                { label: 'Cash on Delivery (COD)', icon: Banknote },
                { label: 'Credit / Debit Card', icon: CreditCard },
              ].map((method) => {
                const Icon = method.icon;
                const active = paymentMethod === method.label;
                return (
                  <button
                    key={method.label}
                    type="button"
                    onClick={() => setPaymentMethod(method.label)}
                    className={`h-[40px] px-4 rounded-[2px] border text-[13px] font-medium inline-flex items-center gap-2 cursor-pointer transition-colors ${
                      active
                        ? 'border-[#EE4D2D] bg-[#FFF5F1] text-[#EE4D2D]'
                        : 'border-[#CCCCCC] bg-white text-[#222222] hover:border-[#EE4D2D]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#EBEBEB] pt-4 flex flex-col items-end space-y-2 text-[14px]">
            <div className="w-full max-w-[340px] flex justify-between">
              <span className="text-[#757575]">Merchandise Subtotal:</span>
              <span className="tabular-nums font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="w-full max-w-[340px] flex justify-between">
              <span className="text-[#757575]">Shipping Total:</span>
              <span className="tabular-nums font-medium">
                {finalShipping === 0 ? 'Free' : `$${finalShipping.toFixed(2)}`}
              </span>
            </div>
            {voucherDiscount + shippingDiscount > 0 && (
              <div className="w-full max-w-[340px] flex justify-between text-[#EE4D2D]">
                <span>Voucher Applied ({activeVoucher?.code}):</span>
                <span className="tabular-nums font-medium">
                  -${(voucherDiscount + shippingDiscount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="w-full max-w-[340px] flex justify-between items-baseline pt-2 border-t border-[#EBEBEB]">
              <span className="text-[#222222] font-medium">Total Payment:</span>
              <span className="font-display text-[26px] font-bold text-[#EE4D2D] tabular-nums">
                ${totalPayable.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              className="mt-3 h-[44px] w-full max-w-[340px] bg-[#EE4D2D] hover:bg-[#D73211] text-white font-semibold text-[15px] rounded-[2px] cursor-pointer transition-colors"
            >
              Place Order
            </button>
          </div>
        </section>
      </form>
    );
  }

  // CART VIEW
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-4">
      <div className="bg-[#FFFBF8] border border-[#F9EDE5] rounded-[2px] px-4 py-2.5 flex items-center gap-2 text-[13px] text-[#222222]">
        <Truck className="w-4 h-4 text-[#00BFA5]" />
        <span>
          Free Shipping on orders $15+ with your claimed platform voucher!
        </span>
      </div>

      {enrichedItems.length === 0 ? (
        <div className="bg-white border border-[#EBEBEB] rounded-[2px] py-16 text-center">
          <ShoppingBag className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
          <div className="font-display text-[18px] font-semibold text-[#222222]">
            Your shopping cart is empty
          </div>
          <p className="text-[13px] text-[#757575] mt-1">
            Explore today&apos;s Flash Deals and Daily Discover picks to fill your cart.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="mt-4 h-[40px] px-8 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[14px] font-medium rounded-[2px] cursor-pointer"
          >
            Go Shopping Now
          </button>
        </div>
      ) : (
        <>
          {/* Cart Table Header */}
          <div className="bg-white border border-[#EBEBEB] rounded-[2px] px-5 py-3.5 grid grid-cols-12 items-center text-[13px] text-[#757575]">
            <div className="col-span-6 flex items-center gap-3">
              <button
                type="button"
                aria-label="Select all cart items"
                onClick={() => onToggleSelectAll(!allSelected)}
                className={`w-[16px] h-[16px] rounded-[2px] border flex items-center justify-center cursor-pointer ${
                  allSelected
                    ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
                    : 'bg-white border-[#CCCCCC]'
                }`}
              >
                {allSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="text-[#222222] font-medium">Product</span>
            </div>
            <div className="col-span-2 text-center hidden sm:block">Unit Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-1 text-center hidden sm:block">Total</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3">
            {enrichedItems.map(({ product, variant, quantity, selected }) => (
              <div
                key={`${product.id}-${variant}`}
                className="bg-white border border-[#EBEBEB] rounded-[2px] overflow-hidden"
              >
                {/* Shop Row */}
                <div className="px-5 py-2.5 border-b border-[#F2F2F2] flex items-center gap-2 text-[13px]">
                  {product.isMall && (
                    <span className="bg-[#D0011B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                      Mall
                    </span>
                  )}
                  <Store className="w-3.5 h-3.5 text-[#555555]" />
                  <span className="font-medium text-[#222222]">{product.shopName}</span>
                </div>

                {/* Product Row */}
                <div className="px-5 py-4 grid grid-cols-12 items-center gap-2">
                  <div className="col-span-6 flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      aria-label={`Select ${product.title}`}
                      onClick={() => onToggleSelect(product.id, variant)}
                      className={`w-[16px] h-[16px] rounded-[2px] border flex items-center justify-center shrink-0 cursor-pointer ${
                        selected
                          ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
                          : 'bg-white border-[#CCCCCC]'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="w-20 h-20 border border-[#EBEBEB] rounded-[2px] overflow-hidden shrink-0 cursor-pointer"
                    >
                      <ProductVisual kind={product.visual} />
                    </button>

                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="text-[13px] leading-[18px] text-[#222222] hover:text-[#EE4D2D] line-clamp-2 text-left cursor-pointer"
                      >
                        {product.title}
                      </button>
                      <div className="text-[12px] text-[#757575] mt-1">
                        Variation: <span className="text-[#222222]">{variant}</span>
                      </div>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2 text-center hidden sm:block tabular-nums">
                    <span className="text-[12px] text-[#929292] line-through mr-1.5">
                      ${product.originalPrice.toFixed(0)}
                    </span>
                    <span className="text-[14px] text-[#222222] font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 sm:col-span-2 flex justify-center">
                    <div className="inline-flex items-center border border-[#D9D9D9] rounded-[2px] h-[30px]">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => onUpdateQty(product.id, variant, -1)}
                        className="w-[28px] h-full flex items-center justify-center text-[#555555] hover:bg-[#F5F5F5] border-r border-[#D9D9D9] cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-[38px] text-center text-[13px] font-medium tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => onUpdateQty(product.id, variant, 1)}
                        className="w-[28px] h-full flex items-center justify-center text-[#555555] hover:bg-[#F5F5F5] border-l border-[#D9D9D9] cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="col-span-1 text-center hidden sm:block font-display font-semibold text-[15px] text-[#EE4D2D] tabular-nums">
                    ${(product.price * quantity).toFixed(2)}
                  </div>

                  {/* Remove */}
                  <div className="col-span-2 sm:col-span-1 text-right">
                    <button
                      type="button"
                      aria-label={`Remove ${product.title}`}
                      onClick={() => onRemoveItem(product.id, variant)}
                      className="text-[#757575] hover:text-[#D0011B] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Platform Vouchers Bar */}
          <div className="bg-white border border-[#EBEBEB] rounded-[2px] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#222222]">
                <Ticket className="w-4 h-4 text-[#EE4D2D]" />
                <span>Shopee Platform Vouchers</span>
              </div>
              {selectedVoucherId && (
                <button
                  type="button"
                  onClick={() => onSelectVoucher(null)}
                  className="text-[12px] text-[#757575] hover:text-[#EE4D2D] cursor-pointer"
                >
                  Remove Voucher
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {vouchers.map((v) => {
                const claimed = claimedVoucherIds.includes(v.id);
                const eligible = subtotal >= v.minSpend;
                const applied = selectedVoucherId === v.id;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      if (!claimed) {
                        onClaimVoucher(v.id);
                      }
                      if (eligible) {
                        onSelectVoucher(applied ? null : v.id);
                      }
                    }}
                    className={`p-2.5 rounded-[2px] border text-left transition-colors cursor-pointer ${
                      applied
                        ? 'border-[#EE4D2D] bg-[#FFF5F1]'
                        : eligible
                        ? 'border-[#E0E0E0] hover:border-[#EE4D2D] bg-white'
                        : 'border-[#EBEBEB] bg-[#FAFAFA] opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-[14px] text-[#EE4D2D]">
                        {v.title}
                      </span>
                      <span className="text-[11px] font-semibold text-[#EE4D2D]">
                        {applied ? 'Applied' : !claimed ? 'Claim & Apply' : eligible ? 'Apply' : `Min $${v.minSpend}`}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#757575] mt-0.5 truncate">{v.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky Checkout Summary Bar */}
          <div
            className="sticky bottom-0 z-30 bg-white border border-[#EBEBEB] rounded-[2px] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.06)' }}
          >
            <div className="flex items-center gap-4 text-[14px]">
              <button
                type="button"
                onClick={() => onToggleSelectAll(!allSelected)}
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <span
                  className={`w-[16px] h-[16px] rounded-[2px] border flex items-center justify-center ${
                    allSelected
                      ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
                      : 'bg-white border-[#CCCCCC]'
                  }`}
                >
                  {allSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <span>Select All ({enrichedItems.length})</span>
              </button>

              <span className="text-[#757575] text-[13px] tabular-nums">
                Saved ${(itemSavings + voucherDiscount + shippingDiscount).toFixed(2)}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-4">
              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] text-[#222222]">
                    Total ({selectedItems.reduce((s, i) => s + i.quantity, 0)} item
                    {selectedItems.reduce((s, i) => s + i.quantity, 0) === 1 ? '' : 's'}):
                  </span>
                  <span className="font-display text-[24px] font-bold text-[#EE4D2D] tabular-nums">
                    ${totalPayable.toFixed(2)}
                  </span>
                </div>
                {voucherDiscount + shippingDiscount > 0 && (
                  <div className="text-[11px] text-[#EE4D2D] tabular-nums">
                    Includes -${(voucherDiscount + shippingDiscount).toFixed(2)} voucher savings
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={selectedItems.length === 0}
                onClick={onProceedCheckout}
                className="h-[42px] px-10 bg-[#EE4D2D] hover:bg-[#D73211] disabled:bg-[#CCCCCC] text-white text-[14px] font-semibold rounded-[2px] cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                Check Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
