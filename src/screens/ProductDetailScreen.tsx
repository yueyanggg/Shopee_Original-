import React, { useState } from 'react';
import {
  Star,
  Truck,
  ShieldCheck,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Product, Voucher } from '../types/marketplace';
import { ProductVisual } from '../components/ProductVisual';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailScreenProps {
  product: Product;
  relatedProducts: Product[];
  vouchers: Voucher[];
  claimedVoucherIds: string[];
  onClaimVoucher: (id: string) => void;
  onAddToCart: (product: Product, variant: string, quantity: number) => void;
  onBuyNow: (product: Product, variant: string, quantity: number) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: Product) => void;
  onBackHome: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  relatedProducts,
  vouchers,
  claimedVoucherIds,
  onClaimVoucher,
  onAddToCart,
  onBuyNow,
  onSelectCategory,
  onSelectProduct,
  onBackHome,
}) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants.options[0]);
  const [activeThumb, setActiveThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [favorited, setFavorited] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 5 | 4>('all');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddCart = () => {
    onAddToCart(product, selectedVariant, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1600);
  };

  const filteredReviews = product.reviews.filter((r) =>
    reviewFilter === 'all' ? true : r.rating === reviewFilter
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-5 space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#05A] overflow-hidden">
        <button
          type="button"
          onClick={onBackHome}
          className="hover:text-[#EE4D2D] cursor-pointer shrink-0"
        >
          Shopee
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[#757575] shrink-0" />
        <button
          type="button"
          onClick={() => onSelectCategory(product.categoryId)}
          className="hover:text-[#EE4D2D] cursor-pointer shrink-0"
        >
          {product.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[#757575] shrink-0" />
        <span className="text-[#222222] truncate">{product.title}</span>
      </nav>

      {/* Main Split Product Showcase & Purchase Module */}
      <section className="bg-white border border-[#EBEBEB] rounded-[2px] p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left 5 Columns: Sticky Media Gallery */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative aspect-square w-full border border-[#EBEBEB] rounded-[2px] overflow-hidden bg-[#FAFAFA]">
              <ProductVisual kind={product.visual} variantTint={activeThumb} />

              {product.isMall && (
                <span className="absolute top-3 left-0 bg-[#D0011B] text-white text-[11px] font-bold px-2 py-1 rounded-r-[2px]">
                  Mall
                </span>
              )}
              {product.discountPercent > 0 && (
                <div className="discount-ribbon absolute top-0 right-3 w-[40px] bg-[#FFE97A] pt-1.5 pb-1 text-center">
                  <div className="text-[12px] font-bold text-[#EE4D2D] tabular-nums">
                    {product.discountPercent}%
                  </div>
                  <div className="text-[9px] font-bold text-[#222222]">OFF</div>
                </div>
              )}
            </div>

            {/* 4 Interactive Angle/Edition Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((thumbIdx) => (
                <button
                  key={thumbIdx}
                  type="button"
                  onClick={() => setActiveThumb(thumbIdx)}
                  className={`aspect-square rounded-[2px] overflow-hidden border-2 cursor-pointer transition-colors ${
                    activeThumb === thumbIdx
                      ? 'border-[#EE4D2D]'
                      : 'border-[#EBEBEB] hover:border-[#EE4D2D]/50'
                  }`}
                >
                  <ProductVisual kind={product.visual} variantTint={thumbIdx} />
                </button>
              ))}
            </div>

            {/* Favorite & Guarantee Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F2F2F2] text-[13px] text-[#555555]">
              <button
                type="button"
                onClick={() => setFavorited((prev) => !prev)}
                className="inline-flex items-center gap-1.5 hover:text-[#EE4D2D] cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorited ? 'fill-[#EE4D2D] text-[#EE4D2D]' : 'text-[#EE4D2D]'
                  }`}
                />
                <span>Favorite ({product.ratingCount + (favorited ? 1 : 0)})</span>
              </button>

              <span className="inline-flex items-center gap-1 text-[12px] text-[#222222]">
                <ShieldCheck className="w-4 h-4 text-[#D0011B]" />
                <span>100% Authentic Guarantee</span>
              </span>
            </div>
          </div>

          {/* Right 7 Columns: Contiguous Purchase Module */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Title + Inline Mall Badge */}
              <div>
                <h1 className="text-[20px] leading-[26px] font-medium text-[#222222]">
                  {product.isMall ? (
                    <span className="inline-block align-middle mr-2 bg-[#D0011B] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-[2px]">
                      Mall
                    </span>
                  ) : product.isPreferred ? (
                    <span className="inline-block align-middle mr-2 bg-[#EE4D2D] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-[2px]">
                      Preferred
                    </span>
                  ) : null}
                  <span>{product.title}</span>
                </h1>

                {/* Rating | Ratings Count | Sold */}
                <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[14px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#EE4D2D] font-semibold border-b border-[#EE4D2D] tabular-nums">
                      {product.rating.toFixed(1)}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[#EE4D2D] text-[#EE4D2D]"
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[#DBDBDB]">|</span>
                  <div className="tabular-nums">
                    <span className="font-medium text-[#222222] border-b border-[#222222]">
                      {product.ratingCount.toLocaleString()}
                    </span>{' '}
                    <span className="text-[#757575]">Ratings</span>
                  </div>
                  <span className="text-[#DBDBDB]">|</span>
                  <div className="tabular-nums">
                    <span className="font-medium text-[#222222]">
                      {product.soldCount.toLocaleString()}
                    </span>{' '}
                    <span className="text-[#757575]">Sold</span>
                  </div>
                </div>
              </div>

              {/* Price Block */}
              <div className="bg-[#FAFAFA] px-5 py-4 rounded-[2px] flex flex-wrap items-baseline gap-3">
                <span className="text-[15px] text-[#929292] line-through tabular-nums">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="font-display text-[30px] font-bold text-[#EE4D2D] leading-none tabular-nums">
                  <span className="text-[22px] mr-0.5">$</span>
                  {product.price.toFixed(2)}
                </span>
                <span className="bg-[#EE4D2D] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase tracking-[0.02em]">
                  {product.discountPercent}% OFF
                </span>
              </div>

              {/* Claimable Vouchers Row */}
              <div className="grid grid-cols-12 items-center gap-2 text-[13px]">
                <div className="col-span-3 text-[#757575]">Shop Vouchers</div>
                <div className="col-span-9 flex flex-wrap items-center gap-2">
                  {vouchers.slice(0, 3).map((v) => {
                    const claimed = claimedVoucherIds.includes(v.id);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => onClaimVoucher(v.id)}
                        className={`px-2.5 py-1 text-[12px] font-medium rounded-[2px] border cursor-pointer transition-colors inline-flex items-center gap-1 ${
                          claimed
                            ? 'bg-[#FFF5F1] border-[#EE4D2D] text-[#EE4D2D]'
                            : 'bg-[#FFEEE8] border-[#FFBDAA] text-[#EE4D2D] hover:border-[#EE4D2D]'
                        }`}
                      >
                        {claimed && <Check className="w-3 h-3" />}
                        <span>{v.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-12 items-start gap-2 text-[13px]">
                <div className="col-span-3 text-[#757575]">Shipping</div>
                <div className="col-span-9 space-y-1">
                  <div className="flex items-center gap-2 text-[#222222] font-medium">
                    <Truck className="w-4 h-4 text-[#00BFA5]" />
                    <span>
                      {product.freeShipping
                        ? 'Free Shipping (Orders $15+)'
                        : 'Standard Express ($2.99)'}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#757575]">
                    Ships from {product.shipsFrom} · Estimated delivery 1–3 business days
                  </div>
                </div>
              </div>

              {/* Variant Selector */}
              <div className="grid grid-cols-12 items-start gap-2 text-[13px] pt-1">
                <div className="col-span-3 text-[#757575] pt-2">{product.variants.label}</div>
                <div className="col-span-9 flex flex-wrap gap-2">
                  {product.variants.options.map((opt) => {
                    const isSelected = selectedVariant === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedVariant(opt)}
                        className={`relative min-w-[84px] px-3.5 py-2 text-[13px] rounded-[2px] border transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#EE4D2D] text-[#EE4D2D] bg-[#FFF5F1] font-medium'
                            : 'border-[#E0E0E0] text-[#222222] bg-white hover:border-[#EE4D2D]'
                        }`}
                      >
                        {opt}
                        {isSelected && (
                          <span
                            aria-hidden="true"
                            className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#EE4D2D] text-white flex items-center justify-center rounded-tl-[2px]"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="grid grid-cols-12 items-center gap-2 text-[13px] pt-1">
                <div className="col-span-3 text-[#757575]">Quantity</div>
                <div className="col-span-9 flex items-center gap-4">
                  <div className="inline-flex items-center border border-[#D9D9D9] rounded-[2px] h-[32px]">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-[32px] h-full flex items-center justify-center text-[#555555] hover:bg-[#F5F5F5] border-r border-[#D9D9D9] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-[46px] text-center text-[14px] font-medium text-[#222222] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="w-[32px] h-full flex items-center justify-center text-[#555555] hover:bg-[#F5F5F5] border-l border-[#D9D9D9] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[12px] text-[#757575] tabular-nums">
                    {product.stock} pieces available
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-7 pt-5 border-t border-[#F2F2F2]">
              <button
                type="button"
                onClick={handleAddCart}
                className="h-[46px] px-6 bg-[#FFEEE8] hover:bg-[#FFE3D9] border border-[#EE4D2D] text-[#EE4D2D] text-[14px] font-semibold rounded-[2px] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{addedFeedback ? 'Added to Cart!' : 'Add To Cart'}</span>
              </button>

              <button
                type="button"
                onClick={() => onBuyNow(product, selectedVariant, quantity)}
                className="h-[46px] px-10 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[14px] font-semibold rounded-[2px] transition-colors cursor-pointer shadow-xs"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Shop Profile Bar */}
      <section className="bg-white border border-[#EBEBEB] rounded-[2px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border border-[#EBEBEB] bg-[#FFF5F1] flex items-center justify-center relative shrink-0">
            <Store className="w-7 h-7 text-[#EE4D2D]" />
            {product.isMall && (
              <span className="absolute -bottom-1 bg-[#D0011B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[2px]">
                Shopee Mall
              </span>
            )}
          </div>
          <div>
            <div className="text-[16px] font-semibold text-[#222222]">{product.shopName}</div>
            <div className="text-[12px] text-[#757575] mt-0.5">Active 4 mins ago · {product.shipsFrom}</div>
            <button
              type="button"
              onClick={() => onSelectCategory(product.categoryId)}
              className="mt-2 h-[30px] px-3 border border-[#CCCCCC] hover:border-[#EE4D2D] hover:text-[#EE4D2D] text-[12px] text-[#555555] rounded-[2px] inline-flex items-center gap-1 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>View Category</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 sm:border-l sm:border-[#EBEBEB] sm:pl-8 text-[13px]">
          <div>
            <div className="text-[#757575]">Ratings</div>
            <div className="text-[#EE4D2D] font-semibold mt-0.5 tabular-nums">
              {product.shopRating.toFixed(1)} / 5.0
            </div>
          </div>
          <div>
            <div className="text-[#757575]">Response Rate</div>
            <div className="text-[#EE4D2D] font-semibold mt-0.5 tabular-nums">
              {product.shopResponseRate}
            </div>
          </div>
          <div>
            <div className="text-[#757575]">Followers</div>
            <div className="text-[#EE4D2D] font-semibold mt-0.5 tabular-nums">
              {product.shopFollowers}
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications & Description */}
      <section className="bg-white border border-[#EBEBEB] rounded-[2px] p-6 space-y-6">
        <div>
          <h2 className="bg-[#FAFAFA] px-4 py-2.5 text-[16px] font-semibold text-[#222222] uppercase tracking-[0.01em] mb-4">
            Product Specifications
          </h2>
          <div className="px-4 space-y-2.5 text-[14px]">
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 sm:col-span-3 text-[#757575]">Category</span>
              <button
                type="button"
                onClick={() => onSelectCategory(product.categoryId)}
                className="col-span-8 sm:col-span-9 text-left text-[#05A] hover:underline cursor-pointer"
              >
                Shopee &gt; {product.categoryName}
              </button>
            </div>
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-12 gap-2">
                <span className="col-span-4 sm:col-span-3 text-[#757575]">{spec.label}</span>
                <span className="col-span-8 sm:col-span-9 text-[#222222]">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="bg-[#FAFAFA] px-4 py-2.5 text-[16px] font-semibold text-[#222222] uppercase tracking-[0.01em] mb-4">
            Product Description
          </h2>
          <p className="px-4 text-[14px] leading-[22px] text-[#222222] max-w-[78ch]">
            {product.description}
          </p>
        </div>
      </section>

      {/* Product Ratings & Reviews */}
      <section className="bg-white border border-[#EBEBEB] rounded-[2px] p-6">
        <h2 className="text-[18px] font-semibold text-[#222222] mb-4">Product Ratings</h2>

        <div className="bg-[#FFFBF8] border border-[#F9EDE5] rounded-[2px] p-5 flex flex-col sm:flex-row sm:items-center gap-6 mb-5">
          <div className="text-center sm:text-left shrink-0">
            <div className="font-display text-[28px] font-bold text-[#EE4D2D] tabular-nums">
              {product.rating.toFixed(1)}{' '}
              <span className="text-[16px] font-normal text-[#EE4D2D]">out of 5</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-[#EE4D2D] text-[#EE4D2D]" />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'all', label: `All (${product.reviews.length})` },
                { id: 5, label: '5 Star' },
                { id: 4, label: '4 Star' },
              ] as const
            ).map((tab) => (
              <button
                key={String(tab.id)}
                type="button"
                onClick={() => setReviewFilter(tab.id)}
                className={`h-[32px] px-4 text-[13px] rounded-[2px] border cursor-pointer transition-colors ${
                  reviewFilter === tab.id
                    ? 'border-[#EE4D2D] text-[#EE4D2D] bg-white font-medium'
                    : 'border-[#E0E0E0] text-[#222222] bg-white hover:border-[#EE4D2D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[#EBEBEB]">
          {filteredReviews.length === 0 ? (
            <div className="py-6 text-[13px] text-[#757575]">
              No reviews matching this star filter yet.
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-medium text-[#222222]">{review.author}</div>
                  <div className="text-[12px] text-[#757575] tabular-nums">{review.date}</div>
                </div>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= review.rating
                          ? 'fill-[#EE4D2D] text-[#EE4D2D]'
                          : 'fill-[#E0E0E0] text-[#E0E0E0]'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[12px] text-[#757575] mt-1">
                  Variation: {review.variant}
                </div>
                <p className="text-[14px] text-[#222222] mt-2 leading-[20px]">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products */}
      <section className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-[16px] font-semibold text-[#757575] uppercase">
            You May Also Like
          </h2>
          <button
            type="button"
            onClick={() => onSelectCategory(product.categoryId)}
            className="text-[13px] text-[#EE4D2D] hover:underline cursor-pointer"
          >
            See All &gt;
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[10px]">
          {relatedProducts.slice(0, 6).map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onSelect={onSelectProduct}
              onQuickAdd={(p) => onAddToCart(p, p.variants.options[0], 1)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
