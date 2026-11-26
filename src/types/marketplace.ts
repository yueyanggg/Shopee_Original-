export type ScreenView = 'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'orders';

export type SortOption = 'relevance' | 'latest' | 'top_sales' | 'price_asc' | 'price_desc';

export type VisualKind =
  | 'headphones'
  | 'keyboard'
  | 'serum'
  | 'espresso'
  | 'smartwatch'
  | 'sneakers'
  | 'tote'
  | 'desklamp'
  | 'blender'
  | 'camera'
  | 'mouse'
  | 'jacket'
  | 'flask'
  | 'diffuser'
  | 'sunglasses'
  | 'backpack'
  | 'speaker'
  | 'cream'
  | 'kettle'
  | 'monitor'
  | 'matcha'
  | 'candle'
  | 'mic'
  | 'luggage';

export interface Category {
  id: string;
  name: string;
  visual: VisualKind;
  accentBg: string;
  itemCount: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  variant: string;
  comment: string;
  helpfulCount: number;
}

export interface Product {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  shopName: string;
  shopFollowers: string;
  shopRating: number;
  shopResponseRate: string;
  isMall: boolean;
  isPreferred: boolean;
  isFlashSale: boolean;
  flashSaleSoldPercent?: number;
  flashSaleLabel?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  soldCount: number;
  soldDisplay: string;
  stock: number;
  shipsFrom: string;
  promoTag?: 'Free Shipping' | '10% Cashback' | 'Lowest Price';
  freeShipping: boolean;
  cashback: boolean;
  visual: VisualKind;
  variants: {
    label: string;
    options: string[];
  };
  specs: { label: string; value: string }[];
  description: string;
  reviews: ProductReview[];
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  discountType: 'fixed' | 'percent' | 'shipping';
  value: number;
  minSpend: number;
  maxCap?: number;
  badge: string;
  expiresIn: string;
}

export interface CartItem {
  productId: string;
  variant: string;
  quantity: number;
  selected: boolean;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: 'Preparing Shipment' | 'In Transit' | 'Delivered';
  items: {
    productId: string;
    title: string;
    variant: string;
    quantity: number;
    unitPrice: number;
    visual: VisualKind;
    shopName: string;
  }[];
  subtotal: number;
  shippingFee: number;
  voucherDiscount: number;
  total: number;
  paymentMethod: string;
  recipientName: string;
  address: string;
}

export interface FilterState {
  query: string;
  categoryIds: string[];
  mallOnly: boolean;
  freeShippingOnly: boolean;
  flashSaleOnly: boolean;
  cashbackOnly: boolean;
  minPrice: string;
  maxPrice: string;
  minRating: number;
  sortBy: SortOption;
}
