import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types/marketplace';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  flashSaleMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  flashSaleMode = false,
}) => {
  const wholePrice = product.price.toFixed(2);
  const origPrice = product.originalPrice.toFixed(0);

  return (
    <div
      onClick={() => onSelect(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(product);
        }
      }}
      className="shopee-card group relative flex flex-col cursor-pointer overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE4D2D]"
    >
      {/* 1:1 Square Thumbnail */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F9F9F9]">
        <ProductVisual
          kind={product.visual}
          className="transition-transform duration-200 group-hover:scale-[1.03]"
        />

        {/* Top-left Mall / Preferred Badge */}
        {product.isMall ? (
          <span className="absolute top-2 left-0 bg-[#D0011B] text-white text-[10px] font-bold leading-none px-1.5 py-1 rounded-r-[2px] tracking-[0.02em] shadow-xs">
            Mall
          </span>
        ) : product.isPreferred ? (
          <span className="absolute top-2 left-0 bg-[#EE4D2D] text-white text-[10px] font-bold leading-none px-1.5 py-1 rounded-r-[2px] tracking-[0.02em]">
            Preferred
          </span>
        ) : null}

        {/* Top-right Yellow Discount Ribbon with Chevron Notch */}
        {product.discountPercent > 0 && (
          <div className="discount-ribbon absolute top-0 right-0 w-[36px] bg-[#FFE97A] pt-1 pb-1 text-center">
            <div className="text-[11px] font-bold leading-[12px] text-[#EE4D2D] tabular-nums">
              {product.discountPercent}%
            </div>
            <div className="text-[9px] font-bold leading-[10px] text-[#222222] uppercase">
              OFF
            </div>
          </div>
        )}

        {/* Quick Add hover overlay button */}
        {onQuickAdd && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            aria-label={`Add ${product.title} to cart`}
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 bg-[#EE4D2D] hover:bg-[#D73211] text-white p-1.5 rounded-[2px] shadow-sm flex items-center gap-1 text-[11px] font-medium"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>

      {/* Card Body — 8px padding */}
      <div className="p-2 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          {/* 2-line Clamped Product Title */}
          <h3 className="text-[12px] leading-[16px] text-[#222222] font-normal line-clamp-2 min-h-[32px]">
            {product.title}
          </h3>

          {/* Single Promotion Outline Tag */}
          <div className="mt-1.5 min-h-[16px] flex items-center gap-1">
            {product.promoTag && (
              <span className="inline-block border border-[#EE4D2D] text-[#EE4D2D] text-[10px] leading-[12px] font-medium px-1 py-[1px] rounded-[2px] whitespace-nowrap">
                {product.promoTag}
              </span>
            )}
          </div>
        </div>

        <div className="pt-0.5">
          {/* Price Row */}
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline text-[#EE4D2D] font-display font-semibold tabular-nums">
              <span className="text-[13px] mr-[1px]">$</span>
              <span className="text-[16px] leading-[20px]">{wholePrice}</span>
            </div>
            <span className="text-[12px] leading-[16px] text-[#757575] line-through tabular-nums">
              ${origPrice}
            </span>
          </div>

          {/* Bottom Metadata or Flash Sale Progress Bar */}
          {flashSaleMode ? (
            <div className="mt-1.5 relative h-[14px] w-full rounded-full bg-[#FFBDB8] overflow-hidden">
              <div
                className="h-full bg-[#EE4D2D] rounded-full transition-all"
                style={{ width: `${product.flashSaleSoldPercent ?? 70}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tracking-[0.02em] text-white uppercase">
                {product.flashSaleLabel ?? 'SELLING FAST'}
              </span>
            </div>
          ) : (
            <div className="mt-1.5 flex items-center justify-between text-[10px] leading-[12px] text-[#757575]">
              <span className="inline-flex items-center gap-0.5 tabular-nums">
                <Star className="w-2.5 h-2.5 fill-[#FFCE3D] text-[#FFCE3D]" />
                <span>{product.rating.toFixed(1)}</span>
              </span>
              <span className="tabular-nums">{product.soldDisplay}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
