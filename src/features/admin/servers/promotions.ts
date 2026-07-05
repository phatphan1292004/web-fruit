import store, { storeClient } from '../../../integrations/store';
import { readCookie } from './products';

export interface PromotionConfigProduct {
  productId: string;
  customPrice?: number;
  limitPerUser: number;
}

export interface PromotionConfig {
  discountType?: 'percentage' | 'fixed_amount' | 'fixed_price';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue?: number;
  limitPerAccount?: number;
  targetMemberTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  products?: PromotionConfigProduct[];
  comboProductIds?: string[];
}

export interface FrontendPromotion {
  _id: string;
  name: string;
  description?: string;
  code?: string;
  type: 'flash_sale' | 'combo' | 'voucher_code' | 'new_user' | 'member_tier';
  status: 'active' | 'inactive' | 'draft' | 'expired';
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  config: PromotionConfig;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromotionStats {
  promotionId: string;
  usedCount: number;
  totalDiscountedAmount: number;
  totalOrderValueGenerated: number;
  roi: number;
}

export interface ClientVoucher {
  id: string;
  promotionId: string;
  code: string;
  name: string;
  description?: string;
  type: string;
  config: PromotionConfig;
  expiresAt: string;
}

export interface ClientVoucherWallet {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  vouchers: ClientVoucher[];
}

const setupAuth = () => {
  const uid = readCookie('userId');
  if (uid) {
    storeClient.defaults.headers.common['x-user-uid'] = uid;
  }
};

// Admin Requests
export async function fetchAdminPromotions(): Promise<FrontendPromotion[]> {
  setupAuth();
  const res = await store.get<FrontendPromotion[]>('/promotions');
  return res || [];
}

export async function fetchAdminPromotionById(id: string): Promise<FrontendPromotion | null> {
  setupAuth();
  return store.get<FrontendPromotion>(`/promotions/${id}`);
}

export async function createAdminPromotion(payload: Partial<FrontendPromotion>): Promise<FrontendPromotion | null> {
  setupAuth();
  return store.post<FrontendPromotion, Partial<FrontendPromotion>>('/promotions', payload);
}

export async function updateAdminPromotion(
  id: string,
  payload: Partial<FrontendPromotion>
): Promise<FrontendPromotion | null> {
  setupAuth();
  return store.put<FrontendPromotion, Partial<FrontendPromotion>>(`/promotions/${id}`, payload);
}

export async function patchAdminPromotionStatus(id: string, status: string): Promise<FrontendPromotion | null> {
  setupAuth();
  return store.patch<FrontendPromotion, { status: string }>(`/promotions/${id}/status`, { status });
}

export async function deleteAdminPromotion(id: string): Promise<any> {
  setupAuth();
  return store.del(`/promotions/${id}`);
}

export async function fetchPromotionStats(id: string): Promise<PromotionStats | null> {
  setupAuth();
  return store.get<PromotionStats>(`/promotions/${id}/stats`);
}

// Client Calculations & Vouchers Wallet
export async function calculateOrderPromotions(payload: {
  code?: string;
  firebaseUid?: string;
  items: Array<{ productId: string; quantity: number }>;
}): Promise<any> {
  setupAuth();
  return store.post<any, any>('/promotions/apply', payload);
}

export async function fetchMyVouchers(firebaseUid: string): Promise<ClientVoucherWallet | null> {
  setupAuth();
  return store.get<ClientVoucherWallet>('/promotions/wallet', { firebaseUid });
}

export async function applyWalletVoucher(payload: {
  userVoucherId: string;
  firebaseUid?: string;
  items: Array<{ productId: string; quantity: number }>;
}): Promise<any> {
  setupAuth();
  return store.post<any, any>('/promotions/apply-wallet', payload);
}

// ─── Public (no auth) ─────────────────────────────────────────────────────────
import { get } from '../../../integrations/store';

export interface PublicFlashSaleProduct {
  productId: string;
  name: string;
  slug: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  category?: string;
}

export interface PublicFlashSale {
  _id: string;
  name: string;
  endDate: string;
  products: PublicFlashSaleProduct[];
}

export interface PublicVoucherPromo {
  _id: string;
  name: string;
  code?: string;
  type: string;
  description?: string;
  endDate: string;
  config: {
    discountType?: string;
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderValue?: number;
    targetMemberTier?: string;
  };
}

export async function fetchPublicFlashSales(): Promise<PublicFlashSale[]> {
  return get<PublicFlashSale[]>('/promotions/public/flash-sales', {}, []);
}

export async function fetchPublicVouchers(): Promise<PublicVoucherPromo[]> {
  return get<PublicVoucherPromo[]>('/promotions/public/vouchers', {}, []);
}
