import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiEdit3, FiTrash2, FiPlus, FiMapPin, FiCheck, FiUser, FiPhone } from 'react-icons/fi';
import { Loader2, ChevronDown } from 'lucide-react';
import { store } from '../../../integrations';
import { addUserAddress, updateUserAddress, deleteUserAddress, type ApiUser } from '../servers';
import type { AddressItem } from './types';

type Props = {
  addresses: AddressItem[];
  isLoading?: boolean;
  onAddressesChange: (updatedList: AddressItem[]) => void;
  firebaseUid: string;
};

type Province = {
  provinceId: number;
  provinceCode: string;
  name: string;
  countryId: number;
};

type Ward = {
  wardId: number;
  wardCode: string;
  name: string;
  provinceId: number;
};

const AddressSection = ({ addresses, isLoading, onAddressesChange, firebaseUid }: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<AddressItem | null>(null);

  // Form states
  const [label, setLabel] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Provinces/Wards states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | number | ''>('');
  const [selectedWardId, setSelectedWardId] = useState<string | number | ''>('');
  
  // Loaders
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Fetch Provinces on mount
  useEffect(() => {
    let isActive = true;
    setLoadingProvinces(true);
    store
      .get<Province[]>('/locations/provinces', undefined, [])
      .then((data) => {
        if (!isActive) return;
        setProvinces(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Failed to load provinces', err))
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
      .catch((err) => console.error('Failed to load wards', err))
      .finally(() => {
        if (!isActive) return;
        setLoadingWards(false);
      });

    return () => {
      isActive = false;
    };
  }, [selectedProvinceId]);

  const handleOpenAdd = () => {
    setLabel('');
    setReceiverName('');
    setPhone('');
    setSelectedProvinceId('');
    setSelectedWardId('');
    setDetailedAddress('');
    setIsDefault(false);
    setEditingItem(null);
    setIsAdding(true);
  };

  const handleOpenEdit = async (item: AddressItem) => {
    setLabel(item.label);
    setReceiverName(item.receiverName ?? '');
    setPhone(item.phone ?? '');
    setDetailedAddress(item.detailedAddress ?? '');
    setIsDefault(!!item.isDefault);
    setIsAdding(false);
    setEditingItem(item);

    // Match provinceId by name from fetched provinces list
    const matchedProvince = provinces.find(
      (p) => p.name.toLowerCase() === item.province?.toLowerCase()
    );

    if (matchedProvince) {
      setSelectedProvinceId(matchedProvince.provinceId);
      
      // Load wards and match wardId
      setLoadingWards(true);
      try {
        const data = await store.get<Ward[]>(`/locations/provinces/${matchedProvince.provinceId}/wards`, undefined, []);
        const loadedWards = Array.isArray(data) ? data : [];
        setWards(loadedWards);

        const matchedWard = loadedWards.find(
          (w) => w.name.toLowerCase() === item.ward?.toLowerCase()
        );
        if (matchedWard) {
          setSelectedWardId(matchedWard.wardId);
        } else {
          setSelectedWardId('');
        }
      } catch (err) {
        console.error('Failed to load wards for editing', err);
      } finally {
        setLoadingWards(false);
      }
    } else {
      setSelectedProvinceId('');
      setSelectedWardId('');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUid || isSaving) return;

    const matchedProvince = provinces.find((p) => String(p.provinceId) === String(selectedProvinceId));
    const matchedWard = wards.find((w) => String(w.wardId) === String(selectedWardId));

    if (
      !label.trim() ||
      !receiverName.trim() ||
      !phone.trim() ||
      !matchedProvince ||
      !matchedWard ||
      !detailedAddress.trim()
    ) {
      toast.error('Vui lòng chọn đầy đủ Tỉnh/Xã và điền chính xác thông tin!');
      return;
    }

    const provinceName = matchedProvince.name;
    const wardName = matchedWard.name;

    const computedAddress = [
      detailedAddress.trim(),
      wardName,
      provinceName,
    ]
      .filter(Boolean)
      .join(', ');

    setIsSaving(true);

    try {
      if (isAdding) {
        const newItemPayload: Partial<AddressItem> = {
          label: label.trim(),
          receiverName: receiverName.trim(),
          phone: phone.trim(),
          province: provinceName,
          provinceId: matchedProvince.provinceId,
          ward: wardName,
          wardId: matchedWard.wardId,
          detailedAddress: detailedAddress.trim(),
          address: computedAddress,
          isDefault: isDefault || addresses.length === 0,
        };

        const createdAddress = await addUserAddress(firebaseUid, newItemPayload);
        
        let updatedList = [...addresses];
        if (createdAddress.isDefault) {
          updatedList = updatedList.map((item) => ({ ...item, isDefault: false }));
        }
        updatedList.push(createdAddress);
        onAddressesChange(updatedList);
        toast.success('Thêm địa chỉ mới thành công!');
      } else if (editingItem) {
        const updatedItemPayload: Partial<AddressItem> = {
          label: label.trim(),
          receiverName: receiverName.trim(),
          phone: phone.trim(),
          province: provinceName,
          provinceId: matchedProvince.provinceId,
          ward: wardName,
          wardId: matchedWard.wardId,
          detailedAddress: detailedAddress.trim(),
          address: computedAddress,
          isDefault: isDefault || editingItem.isDefault,
        };

        const addressId = editingItem._id || editingItem.id;
        const updatedAddress = await updateUserAddress(firebaseUid, addressId, updatedItemPayload);

        let updatedList = addresses.map((item) => {
          const isTarget = item.id === editingItem.id || (item._id && item._id === editingItem._id);
          return isTarget ? updatedAddress : item;
        });

        if (updatedAddress.isDefault) {
          updatedList = updatedList.map((item) => {
            const isTarget = item.id === editingItem.id || (item._id && item._id === editingItem._id);
            return isTarget ? item : { ...item, isDefault: false };
          });
        }
        onAddressesChange(updatedList);
        toast.success('Cập nhật địa chỉ thành công!');
      }

      setIsAdding(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save address:', error);
      toast.error('Có lỗi xảy ra khi lưu địa chỉ. Vui lòng thử lại!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (itemToDelete: AddressItem) => {
    if (!firebaseUid || deletingId !== null) return;
    const targetId = itemToDelete._id || itemToDelete.id;
    setDeletingId(targetId);

    try {
      await deleteUserAddress(firebaseUid, targetId);

      let updatedList = addresses.filter((item) => {
        if (itemToDelete._id && item._id) return item._id !== itemToDelete._id;
        return item.id !== itemToDelete.id;
      });

      if (itemToDelete.isDefault && updatedList.length > 0) {
        // If the deleted address was default, backend makes next default. Sync this on frontend:
        updatedList[0].isDefault = true;
      }
      onAddressesChange(updatedList);
      toast.success('Xóa địa chỉ thành công!');
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast.error('Có lỗi xảy ra khi xóa địa chỉ. Vui lòng thử lại!');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-neutral-200/80 rounded" />
          <div className="h-10 w-32 bg-neutral-200/80 rounded-full" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-neutral-100 p-5 bg-neutral-50/50 space-y-3">
              <div className="h-6 w-32 bg-neutral-200/80 rounded" />
              <div className="h-4 w-48 bg-neutral-200/60 rounded" />
              <div className="h-4 w-full bg-neutral-200/40 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">Địa chỉ giao hàng</h3>
        {!isAdding && !editingItem && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-colors shadow-sm hover:shadow"
          >
            <FiPlus /> Thêm địa chỉ
          </button>
        )}
      </div>

      {/* Form Section */}
      {(isAdding || editingItem) && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 space-y-5">
          <h4 className="font-bold text-lg text-foreground">
            {isAdding ? 'Thêm địa chỉ giao hàng mới' : 'Cập nhật địa chỉ giao hàng'}
          </h4>
          <div className="space-y-4">
            {/* Receiver Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Tên người nhận</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên người nhận"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  required
                  disabled={isSaving}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại liên hệ"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isSaving}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Location hierarchy info (Province, Ward - NO DISTRICT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Province dropdown */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Tỉnh / Thành phố</label>
                <div className="relative">
                  <select
                    value={selectedProvinceId}
                    onChange={(e) => {
                      setSelectedProvinceId(e.target.value || '');
                      setSelectedWardId('');
                    }}
                    required
                    disabled={loadingProvinces || isSaving}
                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 pr-10 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm appearance-none"
                  >
                    <option value="">Chọn Tỉnh / Thành phố</option>
                    {provinces.map((prov) => (
                      <option key={prov.provinceId} value={prov.provinceId}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                  {loadingProvinces ? (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Ward dropdown */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Xã / Phường</label>
                <div className="relative">
                  <select
                    value={selectedWardId}
                    onChange={(e) => setSelectedWardId(e.target.value || '')}
                    required
                    disabled={!selectedProvinceId || loadingWards || isSaving}
                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 pr-10 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm appearance-none disabled:bg-neutral-50 disabled:text-neutral-400"
                  >
                    <option value="">Chọn Xã / Phường</option>
                    {wards.map((w) => (
                      <option key={w.wardId} value={w.wardId}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  {loadingWards ? (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed location */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Số nhà, tên đường (Địa chỉ chi tiết)</label>
              <input
                type="text"
                placeholder="Ví dụ: 123 Lê Lợi"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                required
                disabled={isSaving}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              />
            </div>

            {/* Label name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Tên nhãn (Ví dụ: Nhà riêng, Cơ quan)</label>
              <div className="relative">
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                  disabled={isSaving}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 pr-10 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm appearance-none"
                >
                  <option value="">Chọn Tên nhãn / Loại địa chỉ</option>
                  <option value="Nhà riêng">Nhà riêng</option>
                  <option value="Văn phòng">Văn phòng</option>
                  <option value="Cơ quan">Cơ quan</option>
                  <option value="Trường học">Trường học</option>
                  <option value="Khác">Khác</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Default Address Checkbox */}
            {(!editingItem || !editingItem.isDefault) && (
              <label className="flex items-center gap-3 cursor-pointer group text-[15px] pt-1">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  disabled={isSaving}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                  Đặt làm địa chỉ mặc định
                </span>
              </label>
            )}
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-foreground/75 hover:bg-neutral-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-full bg-primary text-white px-6 py-2.5 text-sm font-bold hover:bg-primary/95 transition-all shadow-md hover:shadow-lg disabled:opacity-75"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Lưu địa chỉ
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border/80 rounded-2xl text-foreground/40 font-semibold bg-neutral-50/20">
            Bạn chưa lưu địa chỉ nào. Vui lòng thêm địa chỉ giao hàng!
          </div>
        ) : (
          addresses.map((address) => {
            const targetId = address._id || address.id;
            const isDeleting = deletingId === targetId;

            return (
              <div key={targetId} className="rounded-2xl border border-border/60 p-5 hover:shadow-md transition-all bg-white relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <FiMapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5">
                        <h4 className="font-bold text-foreground text-[16px]">{address.label}</h4>
                        {address.isDefault && (
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary flex items-center gap-1">
                            <FiCheck className="w-3.5 h-3.5" /> Mặc định
                          </span>
                        )}
                      </div>

                      {/* Receiver detail text */}
                      {(address.receiverName || address.phone) && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-foreground/60 pt-0.5">
                          {address.receiverName && (
                            <span className="flex items-center gap-1.5">
                              <FiUser className="w-3.5 h-3.5 text-foreground/45" /> {address.receiverName}
                            </span>
                          )}
                          {address.phone && (
                            <span className="flex items-center gap-1.5">
                              <FiPhone className="w-3.5 h-3.5 text-foreground/45" /> {address.phone}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="pt-1.5 text-sm font-semibold text-foreground/75 leading-relaxed">{address.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-foreground/60 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(address)}
                      disabled={isDeleting || isSaving}
                      className="rounded-xl border border-border p-2.5 hover:text-primary hover:border-primary transition-all duration-300 hover:shadow-sm disabled:opacity-50"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleDelete(address)}
                        disabled={isDeleting || isSaving}
                        className="rounded-xl border border-border p-2.5 hover:text-rose-500 hover:border-rose-300 transition-all duration-300 hover:shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[38px] min-h-[38px]"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                        ) : (
                          <FiTrash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default AddressSection;
