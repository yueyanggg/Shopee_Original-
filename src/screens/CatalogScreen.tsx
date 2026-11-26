import React, { useMemo, useState } from 'react';
import { Filter, Check, Star, X, ChevronLeft } from 'lucide-react';
import { Category, FilterState, Product, SortOption } from '../types/marketplace';
import { ProductCard } from '../components/ProductCard';

interface CatalogScreenProps {
  categories: Category[];
  products: Product[];
  filters: FilterState;
  onUpdateFilters: (next: FilterState) => void;
  onClearFilters: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onBackHome: () => void;
}

interface FilterCheckboxProps {
  checked: boolean;
  label: string;
  count?: number;
  onChange: () => void;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  checked,
  label,
  count,
  onChange,
}) => (
  <button
    type="button"
    onClick={onChange}
    className="w-full flex items-center justify-between gap-2 py-1 text-left group cursor-pointer"
  >
    <span className="flex items-center gap-2 min-w-0">
      <span
        className={`w-[14px] h-[14px] rounded-[2px] border flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
            : 'bg-white border-[#CCCCCC] group-hover:border-[#EE4D2D]'
        }`}
      >
        {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
      </span>
      <span
        className={`text-[13px] leading-[18px] truncate ${
          checked ? 'text-[#EE4D2D] font-medium' : 'text-[#222222] group-hover:text-[#EE4D2D]'
        }`}
      >
        {label}
      </span>
    </span>
    {count !== undefined && (
      <span className="text-[11px] text-[#757575] tabular-nums shrink-0">({count})</span>
    )}
  </button>
);

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  categories,
  products,
  filters,
  onUpdateFilters,
  onClearFilters,
  onSelectProduct,
  onQuickAdd,
  onBackHome,
}) => {
  const [draftMin, setDraftMin] = useState(filters.minPrice);
  const [draftMax, setDraftMax] = useState(filters.maxPrice);

  const toggleCategory = (catId: string) => {
    const exists = filters.categoryIds.includes(catId);
    const nextIds = exists
      ? filters.categoryIds.filter((id) => id !== catId)
      : [...filters.categoryIds, catId];
    onUpdateFilters({ ...filters, categoryIds: nextIds });
  };

  const applyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFilters({ ...filters, minPrice: draftMin, maxPrice: draftMax });
  };

  const filteredProducts = useMemo(() => {
    const q = filters.query.toLowerCase();
    const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
    const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;

    const list = products.filter((p) => {
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.categoryName.toLowerCase().includes(q) &&
        !p.shopName.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(p.categoryId)) {
        return false;
      }
      if (filters.mallOnly && !p.isMall) return false;
      if (filters.freeShippingOnly && !p.freeShipping) return false;
      if (filters.flashSaleOnly && !p.isFlashSale) return false;
      if (filters.cashbackOnly && !p.cashback) return false;
      if (p.price < min || p.price > max) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      return true;
    });

    const sorted = [...list];
    switch (filters.sortBy) {
      case 'top_sales':
        sorted.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
        sorted.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'relevance':
      default:
        break;
    }
    return sorted;
  }, [products, filters]);

  const sortButtons: { id: SortOption; label: string }[] = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'latest', label: 'Latest' },
    { id: 'top_sales', label: 'Top Sales' },
    { id: 'price_asc', label: 'Price: Low to High' },
    { id: 'price_desc', label: 'Price: High to Low' },
  ];

  const hasActiveFilters =
    filters.query !== '' ||
    filters.categoryIds.length > 0 ||
    filters.mallOnly ||
    filters.freeShippingOnly ||
    filters.flashSaleOnly ||
    filters.cashbackOnly ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.minRating > 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-5">
      {/* Breadcrumb Bar */}
      <div className="flex items-center justify-between mb-4 text-[13px] text-[#555555]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1 text-[#05A] hover:text-[#EE4D2D] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Shopee Home</span>
          </button>
          <span className="text-[#BDBDBD]">/</span>
          <span className="font-medium text-[#222222]">
            {filters.query
              ? `Search results for "${filters.query}"`
              : filters.flashSaleOnly
              ? 'Flash Sale Catalog'
              : filters.mallOnly
              ? 'Shopee Mall Official Stores'
              : 'All Marketplace Products'}
          </span>
        </div>

        <span className="text-[12px] text-[#757575] tabular-nums">
          Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* 200px Fixed Left Filter Column + 16px Gap + Right 5-Column Grid */}
      <div className="flex flex-col md:flex-row items-start gap-[16px]">
        {/* Left Filter Sidebar — 200px fixed width on desktop */}
        <aside className="w-full md:w-[200px] shrink-0 bg-white border border-[#EBEBEB] rounded-[2px] p-3.5 space-y-5">
          <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#222222] uppercase tracking-[0.02em] pb-2 border-b border-[#EBEBEB]">
            <Filter className="w-3.5 h-3.5 text-[#222222]" />
            <span>Search Filter</span>
          </div>

          {/* By Category */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#222222] mb-2">By Category</h3>
            <div className="space-y-1 max-h-[250px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                if (count === 0) return null;
                return (
                  <FilterCheckbox
                    key={cat.id}
                    label={cat.name}
                    count={count}
                    checked={filters.categoryIds.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* Service & Promotion */}
          <div className="pt-3 border-t border-[#EBEBEB]">
            <h3 className="text-[13px] font-semibold text-[#222222] mb-2">
              Service &amp; Promotion
            </h3>
            <div className="space-y-1">
              <FilterCheckbox
                label="Shopee Mall"
                checked={filters.mallOnly}
                onChange={() => onUpdateFilters({ ...filters, mallOnly: !filters.mallOnly })}
              />
              <FilterCheckbox
                label="Free Shipping"
                checked={filters.freeShippingOnly}
                onChange={() =>
                  onUpdateFilters({ ...filters, freeShippingOnly: !filters.freeShippingOnly })
                }
              />
              <FilterCheckbox
                label="Flash Sale"
                checked={filters.flashSaleOnly}
                onChange={() =>
                  onUpdateFilters({ ...filters, flashSaleOnly: !filters.flashSaleOnly })
                }
              />
              <FilterCheckbox
                label="10% Cashback"
                checked={filters.cashbackOnly}
                onChange={() =>
                  onUpdateFilters({ ...filters, cashbackOnly: !filters.cashbackOnly })
                }
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-3 border-t border-[#EBEBEB]">
            <h3 className="text-[13px] font-semibold text-[#222222] mb-2">Price Range</h3>
            <form onSubmit={applyPriceFilter} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  placeholder="$ MIN"
                  value={draftMin}
                  onChange={(e) => setDraftMin(e.target.value)}
                  className="w-full h-[30px] px-2 text-[12px] border border-[#CCCCCC] rounded-[2px] focus:outline-none focus:border-[#EE4D2D] tabular-nums"
                />
                <span className="text-[#757575] text-[12px]">—</span>
                <input
                  type="number"
                  min={0}
                  placeholder="$ MAX"
                  value={draftMax}
                  onChange={(e) => setDraftMax(e.target.value)}
                  className="w-full h-[30px] px-2 text-[12px] border border-[#CCCCCC] rounded-[2px] focus:outline-none focus:border-[#EE4D2D] tabular-nums"
                />
              </div>
              <button
                type="submit"
                className="w-full h-[30px] bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[12px] font-semibold uppercase rounded-[2px] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
          </div>

          {/* Rating Filter */}
          <div className="pt-3 border-t border-[#EBEBEB]">
            <h3 className="text-[13px] font-semibold text-[#222222] mb-2">Rating</h3>
            <div className="space-y-1.5">
              {[5, 4.8, 4.5].map((ratingVal) => {
                const active = filters.minRating === ratingVal;
                return (
                  <button
                    key={ratingVal}
                    type="button"
                    onClick={() =>
                      onUpdateFilters({
                        ...filters,
                        minRating: active ? 0 : ratingVal,
                      })
                    }
                    className={`w-full flex items-center gap-1.5 px-2 py-1 rounded-[2px] text-[12px] cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#FFF5F1] text-[#EE4D2D] font-semibold border border-[#EE4D2D]'
                        : 'text-[#222222] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3 h-3 ${
                            starIdx <= Math.floor(ratingVal)
                              ? 'fill-[#FFCE3D] text-[#FFCE3D]'
                              : 'fill-[#E0E0E0] text-[#E0E0E0]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="tabular-nums">{ratingVal === 5 ? '5.0' : `${ratingVal} & Up`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear All */}
          <div className="pt-3 border-t border-[#EBEBEB]">
            <button
              type="button"
              onClick={() => {
                setDraftMin('');
                setDraftMax('');
                onClearFilters();
              }}
              className="w-full h-[32px] bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[12px] font-semibold uppercase rounded-[2px] transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </aside>

        {/* Right Main Catalog Area (~1000px 5-column grid) */}
        <div className="flex-1 min-w-0 w-full">
          {/* Sort Bar */}
          <div className="bg-[#EDEDED] border border-[#E2E2E2] rounded-[2px] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-[#555555] mr-1">Sort by</span>
              {sortButtons.map((btn) => {
                const active = filters.sortBy === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => onUpdateFilters({ ...filters, sortBy: btn.id })}
                    className={`h-[34px] px-3.5 text-[13px] rounded-[2px] transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#EE4D2D] text-white font-medium'
                        : 'bg-white text-[#222222] hover:bg-[#FFF5F1] border border-[#E0E0E0]'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            <div className="text-[13px] text-[#555555] tabular-nums">
              <span className="text-[#EE4D2D] font-semibold">1</span>/1
            </div>
          </div>

          {/* Active Filters Strip */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-3 text-[12px]">
              {filters.query && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, query: '' })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#EE4D2D] text-[#EE4D2D] rounded-[2px] cursor-pointer"
                >
                  <span>Search: {filters.query}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.categoryIds.map((catId) => {
                const catName = categories.find((c) => c.id === catId)?.name ?? catId;
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => toggleCategory(catId)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#EE4D2D] text-[#EE4D2D] rounded-[2px] cursor-pointer"
                  >
                    <span>{catName}</span>
                    <X className="w-3 h-3" />
                  </button>
                );
              })}
              {filters.mallOnly && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, mallOnly: false })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#D0011B] text-[#D0011B] rounded-[2px] cursor-pointer"
                >
                  <span>Shopee Mall</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.flashSaleOnly && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, flashSaleOnly: false })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#EE4D2D] text-[#EE4D2D] rounded-[2px] cursor-pointer"
                >
                  <span>Flash Sale</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.freeShippingOnly && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, freeShippingOnly: false })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#EE4D2D] text-[#EE4D2D] rounded-[2px] cursor-pointer"
                >
                  <span>Free Shipping</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* 5-Column Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#EBEBEB] rounded-[2px] py-16 px-6 text-center">
              <div className="font-display text-[18px] font-semibold text-[#222222]">
                No products match your current filters
              </div>
              <p className="text-[13px] text-[#757575] mt-1">
                Try clearing some filters or adjusting your price range.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDraftMin('');
                  setDraftMax('');
                  onClearFilters();
                }}
                className="mt-4 h-[36px] px-6 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[13px] font-medium rounded-[2px] cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[10px]">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                  flashSaleMode={filters.flashSaleOnly}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
