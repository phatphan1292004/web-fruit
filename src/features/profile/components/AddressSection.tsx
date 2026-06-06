import { useState } from 'react';
import { FiEdit3, FiTrash2, FiPlus, FiMapPin, FiCheck, FiUser, FiPhone } from 'react-icons/fi';
import type { AddressItem } from './types';

type Props = { addresses: AddressItem[] };

const AddressSection = ({ addresses: initialAddresses }: Props) => {
  const [list, setList] = useState<AddressItem[]>(initialAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<AddressItem | null>(null);

  // Form states
  const [label, setLabel] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleOpenAdd = () => {
    setLabel('');
    setReceiverName('');
    setPhone('');
    setProvince('');
    setDistrict('');
    setWard('');
    setDetailedAddress('');
    setIsDefault(false);
    setEditingItem(null);
    setIsAdding(true);
  };

  const handleOpenEdit = (item: AddressItem) => {
    setLabel(item.label);
    setReceiverName(item.receiverName ?? '');
    setPhone(item.phone ?? '');
    setProvince(item.province ?? '');
    setDistrict(item.district ?? '');
    setWard(item.ward ?? '');
    setDetailedAddress(item.detailedAddress ?? '');
    setIsDefault(!!item.isDefault);
    setIsAdding(false);
    setEditingItem(item);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !label.trim() ||
      !receiverName.trim() ||
      !phone.trim() ||
      !province.trim() ||
      !district.trim() ||
      !ward.trim() ||
      !detailedAddress.trim()
    ) {
      return;
    }

    const computedAddress = [
      detailedAddress.trim(),
      ward.trim(),
      district.trim(),
      province.trim(),
    ]
      .filter(Boolean)
      .join(', ');

    if (isAdding) {
      const newItem: AddressItem = {
        id: Date.now(),
        label: label.trim(),
        receiverName: receiverName.trim(),
        phone: phone.trim(),
        province: province.trim(),
        district: district.trim(),
        ward: ward.trim(),
        detailedAddress: detailedAddress.trim(),
        address: computedAddress,
        isDefault,
      };

      let updatedList = [...list];
      if (isDefault) {
        updatedList = updatedList.map((item) => ({ ...item, isDefault: false }));
      }
      if (list.length === 0) {
        newItem.isDefault = true;
      }
      setList([...updatedList, newItem]);
      setIsAdding(false);
    } else if (editingItem) {
      let updatedList = list.map((item) => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            label: label.trim(),
            receiverName: receiverName.trim(),
            phone: phone.trim(),
            province: province.trim(),
            district: district.trim(),
            ward: ward.trim(),
            detailedAddress: detailedAddress.trim(),
            address: computedAddress,
            isDefault: isDefault || item.isDefault,
          };
        }
        return item;
      });

      if (isDefault && !editingItem.isDefault) {
        updatedList = updatedList.map((item) =>
          item.id === editingItem.id ? { ...item, isDefault: true } : { ...item, isDefault: false }
        );
      }
      setList(updatedList);
      setEditingItem(null);
    }
  };

  const handleDelete = (id: number) => {
    const itemToDelete = list.find((item) => item.id === id);
    let updatedList = list.filter((item) => item.id !== id);

    if (itemToDelete?.isDefault && updatedList.length > 0) {
      updatedList[0].isDefault = true;
    }
    setList(updatedList);
  };

  return (
    <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">Địa chỉ giao hàng</h3>
        {!isAdding && !editingItem && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <FiPlus /> Thêm địa chỉ
          </button>
        )}
      </div>

      {/* Form Section */}
      {(isAdding || editingItem) && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-5">
          <h4 className="font-bold text-lg text-foreground">
            {isAdding ? 'Thêm địa chỉ giao hàng mới' : 'Cập nhật địa chỉ giao hàng'}
          </h4>
          <div className="space-y-4">
            {/* Receiver Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Tên người nhận</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên người nhận"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-[15px] outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại liên hệ"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-[15px] outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Location hierarchy info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Tỉnh / Thành phố</label>
                <input
                  type="text"
                  placeholder="Ví dụ: TP. Hồ Chí Minh"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-[15px] outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Quận / Huyện</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quận 1"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-[15px] outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Xã / Phường</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phường Bến Nghé"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-[15px] outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Detailed location */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">Số nhà, tên đường (Địa chỉ chi tiết)</label>
              <input
                type="text"
                placeholder="Ví dụ: 123 Lê Lợi"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                required
                className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-[15px] outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Label name */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">Tên nhãn (Ví dụ: Nhà riêng, Cơ quan)</label>
              <input
                type="text"
                placeholder="Nhà riêng, Văn phòng..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-[15px] outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Default Address Checkbox */}
            {(!editingItem || !editingItem.isDefault) && (
              <label className="flex items-center gap-3 cursor-pointer group text-[15px] pt-1">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                  Đặt làm địa chỉ mặc định
                </span>
              </label>
            )}
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-2xl border border-border bg-white px-5 py-2.5 font-bold text-foreground/70 hover:bg-neutral-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-primary text-white px-6 py-2.5 font-bold hover:bg-primary/95 transition-all shadow-md"
            >
              Lưu địa chỉ
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="text-center py-8 text-foreground/50 font-medium">
            Bạn chưa lưu địa chỉ nào. Vui lòng thêm địa chỉ mới!
          </div>
        ) : (
          list.map((address) => (
            <div key={address.id} className="rounded-2xl border border-border/60 p-5 hover:shadow-md transition-all bg-white">
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
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-foreground/60">
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

                    <p className="pt-1 text-sm font-semibold text-foreground/75 leading-relaxed">{address.address}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-foreground/60 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(address)}
                    className="rounded-xl border border-border p-2.5 hover:text-primary hover:border-primary transition-all duration-300 hover:shadow-sm"
                  >
                    <FiEdit3 className="w-4 h-4" />
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="rounded-xl border border-border p-2.5 hover:text-rose-500 hover:border-rose-300 transition-all duration-300 hover:shadow-sm"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default AddressSection;
