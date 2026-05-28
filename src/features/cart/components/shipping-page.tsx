import { useEffect, useMemo, useState } from 'react';
import Layout from '../../../components/layout/layout';
import { store } from '../../../integrations';
import CartHeader from './cart-header';
import CartSteps from './cart-steps';
import OrderSummary from './order-summary';
import type { CartTotals } from './types';

type Province = {
  _id?: string;
  provinceId: number;
  provinceCode: string;
  name: string;
  countryId: number;
};

type Ward = {
  _id?: string;
  wardId: number;
  wardCode: string;
  name: string;
  provinceId: number;
};

const totals: CartTotals = {
  subtotal: 1346520,
  shipping: 0,
  discount: 0,
  total: 1346520,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const ShippingPage = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | ''>('');
  const [selectedWardId, setSelectedWardId] = useState<number | ''>('');
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  useEffect(() => {
    let isActive = true;
    setLoadingProvinces(true);

    store
      .get<Province[]>('/locations/provinces', undefined, [])
      .then((data) => {
        if (!isActive) return;
        setProvinces(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (!isActive) return;
        setLoadingProvinces(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    if (!selectedProvinceId) {
      setWards([]);
      setSelectedWardId('');
      return;
    }

    setLoadingWards(true);
    store
      .get<Ward[]>(`/locations/provinces/${selectedProvinceId}/wards`, undefined, [])
      .then((data) => {
        if (!isActive) return;
        setWards(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (!isActive) return;
        setLoadingWards(false);
      });

    return () => {
      isActive = false;
    };
  }, [selectedProvinceId]);

  const provinceOptions = useMemo(
    () =>
      provinces.map((province) => (
        <option key={province.provinceId} value={province.provinceId}>
          {province.name}
        </option>
      )),
    [provinces]
  );

  const wardOptions = useMemo(
    () =>
      wards.map((ward) => (
        <option key={ward.wardId} value={ward.wardId}>
          {ward.name}
        </option>
      )),
    [wards]
  );

  return (
    <Layout mainClassName="bg-gradient-to-b from-background to-muted/30 relative pt-20">
      <div className="absolute top-24 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" />
      <div className="absolute top-32 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute -bottom-16 left-1/2 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="py-10 md:py-14 flex flex-col gap-10">
          <CartHeader
            title="Giao hàng"
            breadcrumb="Trang chủ > Đặt hàng"
            subtitle="Điền thông tin nhận hàng để hoàn tất đơn đặt hàng của bạn."
          />

          <CartSteps currentStep={2} />

          <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.7fr] gap-8 xl:gap-10 items-start">
            <div className="glass rounded-3xl border border-border/60 p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-foreground">Thông tin người nhận</h3>
                  <span className="text-sm text-primary font-medium">Chọn địa chỉ đã lưu</span>
                  <select className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option>Chọn địa chỉ đã lưu</option>
                    <option>Phát Phan - 123, Xã Đức Thịnh, Hà Tĩnh</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Họ và tên"
                  />
                  <input
                    className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Số điện thoại"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-primary">Địa chỉ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
                      value={selectedProvinceId}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setSelectedProvinceId(nextValue ? Number(nextValue) : '');
                      }}
                    >
                      <option value="">{loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}</option>
                      {provinceOptions}
                    </select>
                    <select
                      className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
                      value={selectedWardId}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setSelectedWardId(nextValue ? Number(nextValue) : '');
                      }}
                      disabled={!selectedProvinceId || loadingWards}
                    >
                      <option value="">
                        {!selectedProvinceId
                          ? 'Chọn phường/xã'
                          : loadingWards
                          ? 'Đang tải...'
                          : 'Chọn phường/xã'}
                      </option>
                      {wardOptions}
                    </select>
                  </div>
                  <input
                    className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Địa chỉ cụ thể"
                  />
                  <textarea
                    className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[120px]"
                    placeholder="Ghi chú"
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
                    Lưu
                  </button>
                  <button className="border border-border px-6 py-3 rounded-full font-semibold text-foreground/70 hover:bg-muted transition-colors">
                    Thêm địa chỉ mới
                  </button>
                </div>
              </div>
            </div>

            <OrderSummary
              totals={totals}
              formatCurrency={formatCurrency}
              primaryLabel="Thanh toán"
              primaryHref="/checkout/payment"
              primaryDisabled={true}
              secondaryLabel="Quay lại giỏ hàng"
              secondaryHref="/cart"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPage;
