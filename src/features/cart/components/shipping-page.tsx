import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/layout';
import { store } from '../../../integrations';
import CartHeader from './cart-header';
import CartSteps from './cart-steps';
import OrderSummary from './order-summary';
import type { CartTotals } from './types';
import { useCartStore } from '../store/cart-store';

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const ShippingPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const previewTotals = useCartStore((state) => state.previewTotals);
  const isPreviewLoading = useCartStore((state) => state.isPreviewLoading);
  const fetchPreview = useCartStore((state) => state.fetchPreview);
  const getTotals = useCartStore((state) => state.getTotals);
  const shippingInfo = useCartStore((state) => state.shippingInfo);
  const setShippingInfo = useCartStore((state) => state.setShippingInfo);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | ''>(
    shippingInfo.provinceId ?? ''
  );
  const [selectedWardId, setSelectedWardId] = useState<number | ''>(
    shippingInfo.wardId ?? ''
  );
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [fullName, setFullName] = useState(shippingInfo.fullName ?? '');
  const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber ?? '');
  const [addressDetail, setAddressDetail] = useState(shippingInfo.addressDetail ?? '');
  const [note, setNote] = useState(shippingInfo.note ?? '');

  // Saved addresses states
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string>('');

  // Fetch Provinces
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

  // Fetch Wards when selectedProvinceId changes
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

  // Fetch saved addresses from backend
  useEffect(() => {
    const userId = readCookie('userId');
    if (!userId) return;

    store
      .get<any[]>(`/users/${userId}/addresses`, undefined, [])
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setSavedAddresses(list);

        // Find default address and auto-populate it if shippingInfo is currently empty
        const defaultAddr = list.find((a) => a.isDefault);
        const hasExistingInfo = shippingInfo.fullName || shippingInfo.phoneNumber || shippingInfo.addressDetail;
        if (!hasExistingInfo && defaultAddr) {
          const addrId = defaultAddr._id || defaultAddr.id;
          setSelectedSavedAddressId(addrId);
          setFullName(defaultAddr.receiverName || '');
          setPhoneNumber(defaultAddr.phone || '');
          setAddressDetail(defaultAddr.detailedAddress || '');

          const provId = defaultAddr.provinceId ? Number(defaultAddr.provinceId) : '';
          const wId = defaultAddr.wardId ? Number(defaultAddr.wardId) : '';

          setSelectedProvinceId(provId);
          setSelectedWardId(wId);

          setShippingInfo({
            fullName: defaultAddr.receiverName || '',
            phoneNumber: defaultAddr.phone || '',
            provinceId: provId || undefined,
            provinceName: defaultAddr.province || undefined,
            wardId: wId || undefined,
            wardName: defaultAddr.ward || undefined,
            addressDetail: defaultAddr.detailedAddress || '',
          });
        }
      })
      .catch((err) => console.error('Failed to fetch user addresses', err));
  }, [setShippingInfo, shippingInfo.fullName, shippingInfo.phoneNumber, shippingInfo.addressDetail]);

  const handleSelectSavedAddress = async (addressId: string) => {
    setSelectedSavedAddressId(addressId);
    if (!addressId) {
      setFullName('');
      setPhoneNumber('');
      setSelectedProvinceId('');
      setSelectedWardId('');
      setAddressDetail('');
      setShippingInfo({
        fullName: '',
        phoneNumber: '',
        provinceId: undefined,
        provinceName: undefined,
        wardId: undefined,
        wardName: undefined,
        addressDetail: '',
      });
      return;
    }

    const addr = savedAddresses.find((a) => (a._id || a.id) === addressId);
    if (addr) {
      setFullName(addr.receiverName || '');
      setPhoneNumber(addr.phone || '');
      setAddressDetail(addr.detailedAddress || '');

      const provId = addr.provinceId ? Number(addr.provinceId) : '';
      const wId = addr.wardId ? Number(addr.wardId) : '';

      setSelectedProvinceId(provId);
      setSelectedWardId(wId);

      // Fetch wards for selected province immediately so ward select matches name correctly
      if (provId) {
        setLoadingWards(true);
        try {
          const data = await store.get<Ward[]>(`/locations/provinces/${provId}/wards`, undefined, []);
          setWards(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Failed to load wards on saved address select', err);
        } finally {
          setLoadingWards(false);
        }
      }

      setShippingInfo({
        fullName: addr.receiverName || '',
        phoneNumber: addr.phone || '',
        provinceId: provId || undefined,
        provinceName: addr.province || undefined,
        wardId: wId || undefined,
        wardName: addr.ward || undefined,
        addressDetail: addr.detailedAddress || '',
      });
    }
  };

  useEffect(() => {
    if (!selectedProvinceId || shippingInfo.provinceName) return;
    const selected = provinces.find((province) => province.provinceId === selectedProvinceId);
    if (selected) {
      setShippingInfo({ provinceName: selected.name });
    }
  }, [provinces, selectedProvinceId, setShippingInfo, shippingInfo.provinceName]);

  useEffect(() => {
    if (!selectedWardId || shippingInfo.wardName) return;
    const selected = wards.find((ward) => ward.wardId === selectedWardId);
    if (selected) {
      setShippingInfo({ wardName: selected.name });
    }
  }, [selectedWardId, setShippingInfo, shippingInfo.wardName, wards]);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview, items]);

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

  const fallbackTotals = useMemo<CartTotals>(() => getTotals(), [getTotals]);
  const totals =
    items.length > 0 && !isPreviewLoading && previewTotals.subtotal > 0
      ? previewTotals
      : fallbackTotals;

  const isFormComplete = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      phoneNumber.trim().length > 0 &&
      Boolean(selectedProvinceId) &&
      Boolean(selectedWardId) &&
      addressDetail.trim().length > 0
    );
  }, [addressDetail, fullName, phoneNumber, selectedProvinceId, selectedWardId]);

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
                  <select
                    className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={selectedSavedAddressId}
                    onChange={(e) => handleSelectSavedAddress(e.target.value)}
                  >
                    <option value="">Chọn địa chỉ đã lưu</option>
                    {savedAddresses.map((addr) => {
                      const addrId = addr._id || addr.id;
                      return (
                        <option key={addrId} value={addrId}>
                          {addr.receiverName} - {addr.detailedAddress}, {addr.ward}, {addr.province} {addr.isDefault ? '(Mặc định)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Họ và tên"
                    value={fullName}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFullName(value);
                      setShippingInfo({ fullName: value });
                    }}
                  />
                  <input
                    className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Số điện thoại"
                    value={phoneNumber}
                    onChange={(event) => {
                      const value = event.target.value;
                      setPhoneNumber(value);
                      setShippingInfo({ phoneNumber: value });
                    }}
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
                        const nextId = nextValue ? Number(nextValue) : '';
                        const selectedName = event.currentTarget.selectedOptions[0]?.text;
                        const selected = provinces.find((province) => province.provinceId === nextId);
                        setSelectedProvinceId(nextId);
                        setSelectedWardId('');
                        setShippingInfo({
                          provinceId: nextId || undefined,
                          provinceName: nextId ? selectedName || selected?.name : undefined,
                          wardId: undefined,
                          wardName: undefined,
                        });
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
                        const nextId = nextValue ? Number(nextValue) : '';
                        const selectedName = event.currentTarget.selectedOptions[0]?.text;
                        const selected = wards.find((ward) => ward.wardId === nextId);
                        setSelectedWardId(nextId);
                        setShippingInfo({
                          wardId: nextId || undefined,
                          wardName: nextId ? selectedName || selected?.name : undefined,
                        });
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
                    value={addressDetail}
                    onChange={(event) => {
                      const value = event.target.value;
                      setAddressDetail(value);
                      setShippingInfo({ addressDetail: value });
                    }}
                  />
                  <textarea
                    className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[120px]"
                    placeholder="Ghi chú"
                    value={note}
                    onChange={(event) => {
                      const value = event.target.value;
                      setNote(value);
                      setShippingInfo({ note: value });
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/profile?tab=addresses')}
                    className="border border-border px-6 py-3 rounded-full font-semibold text-foreground/70 hover:bg-muted transition-colors"
                  >
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
              primaryDisabled={!isFormComplete}
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
