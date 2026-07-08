import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { fetchOrderById, updateOrder, type ApiOrder } from '../servers';
import { fetchProducts, type ApiProduct } from '../../../lib/api/products';
import { useCartStore } from '../../cart/store/cart-store';
import { X, Edit2, ShoppingCart, RefreshCw, MapPin, User, Phone, Eye } from 'lucide-react';

type Props = {
  orderId: string;
  onClose: () => void;
};

const statusClass = (status?: string) => {
  switch (status) {
    case 'shipping':
    case 'Đang giao':
      return 'bg-amber-50 text-amber-700 border-amber-200/60';
    case 'completed':
    case 'Đã giao':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    case 'cancelled':
    case 'Đã hủy':
      return 'bg-rose-50 text-rose-700 border-rose-200/60';
    default:
      return 'bg-neutral-50 text-neutral-600 border-neutral-200';
  }
};

const statusLabel = (status?: string) => {
  switch (status) {
    case 'pending':
    case 'Chờ xử lý':
      return 'Chờ xử lý';
    case 'shipping':
    case 'Đang giao':
      return 'Đang giao';
    case 'completed':
    case 'Đã giao':
      return 'Đã hoàn thành';
    case 'cancelled':
    case 'Đã hủy':
      return 'Đã hủy';
    default:
      return status || 'Chờ xử lý';
  }
};

const readCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const orderAddressSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên người nhận.'),
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại.')
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không đúng định dạng Việt Nam.'),
  address: yup.string().required('Vui lòng nhập địa chỉ nhận hàng.'),
});

const OrderDetail = ({ orderId, onClose }: Props) => {
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  
  // Edit Address Form Mode
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(orderAddressSchema),
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchOrderById(orderId);
        if (!active) return;
        setOrder(data ?? null);
        if (data) {
          reset({
            name: data.customer?.name || '',
            phone: data.customer?.phone || '',
            address: data.address || '',
          });
        }
      } catch (err) {
        console.error('Failed loading order detail', err);
        setOrder(null);
      }
      if (active) setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [orderId, reset]);

  useEffect(() => {
    let active = true;
    const loadAllProducts = async () => {
      try {
        const products = await fetchProducts();
        if (!active) return;
        setAllProducts(products || []);
      } catch (err) {
        console.error('Failed to load products list', err);
      }
    };
    loadAllProducts();
    return () => {
      active = false;
    };
  }, []);

  const handleBuyAgain = (item: any) => {
    const matchedProduct = allProducts.find(
      (p) => p._id === item.productId || p.name === item.name
    );
    if (matchedProduct) {
      addItem({
        id: matchedProduct.id,
        productId: matchedProduct._id ?? String(matchedProduct.id),
        name: matchedProduct.name,
        description: matchedProduct.shortDescription || matchedProduct.category || '',
        price: matchedProduct.price,
        image: matchedProduct.image || (matchedProduct.gallery?.[0] ?? ''),
        badge: matchedProduct.label,
        quantity: item.quantity
      });
    } else {
      toast.error(`Không tìm thấy sản phẩm "${item.name}" trên hệ thống.`);
    }
  };

  const handleBuyAllAgain = () => {
    let addedCount = 0;
    if (order && Array.isArray((order as any).items)) {
      ((order as any).items).forEach((item: any) => {
        const matchedProduct = allProducts.find(
          (p) => p._id === item.productId || p.name === item.name
        );
        if (matchedProduct) {
          addItem({
            id: matchedProduct.id,
            productId: matchedProduct._id ?? String(matchedProduct.id),
            name: matchedProduct.name,
            description: matchedProduct.shortDescription || matchedProduct.category || '',
            price: matchedProduct.price,
            image: matchedProduct.image || (matchedProduct.gallery?.[0] ?? ''),
            badge: matchedProduct.label,
            quantity: item.quantity
          }, false);
          addedCount++;
        }
      });
      if (addedCount > 0) {
        toast.success(`Đã thêm lại ${addedCount} sản phẩm vào giỏ hàng!`);
      }
    }
  };

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    try {
      const firebaseUid = readCookie('userId') ?? undefined;
      const updated = await updateOrder(orderId, {
        address: data.address.trim(),
        customer: {
          name: data.name.trim(),
          phone: data.phone.trim()
        }
      }, firebaseUid);

      if (updated) {
        setOrder((prev) =>
          prev ? { ...prev, address: updated.address, customer: updated.customer } : null
        );
        toast.success("Cập nhật thông tin giao hàng thành công!");
        setIsEditingAddress(false);
      } else {
        toast.error("Cập nhật thất bại.");
      }
    } catch (err) {
      console.error("Failed to update order address", err);
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal Card */}
      <motion.div 
        initial={{ scale: 0.95, y: 15, opacity: 0 }} 
        animate={{ scale: 1, y: 0, opacity: 1 }} 
        className="relative z-10 w-full max-w-4xl rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-neutral-100 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-bold text-neutral-800">Chi tiết đơn hàng</h4>
            {order && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusClass(order.status)}`}>
                {statusLabel(order.status)}
              </span>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500 gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm font-medium">Đang tải chi tiết đơn hàng...</p>
            </div>
          ) : order ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Products List (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <h5 className="text-base font-bold text-neutral-800 mb-4 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                    Sản phẩm trong đơn hàng
                  </h5>
                  
                  <div className="divide-y divide-neutral-100 border border-neutral-150 rounded-2xl overflow-hidden bg-white">
                    {Array.isArray(order.items) && order.items.map((it: any) => {
                      const matchedProduct = allProducts.find(
                        (p) => p._id === it.productId || p.name === it.name
                      );
                      const productImage = matchedProduct?.image || (matchedProduct?.gallery?.[0] ?? 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=200&auto=format&fit=crop');

                      return (
                        <div key={it.productId || it.name} className="p-4 flex gap-4 items-center hover:bg-neutral-50/30 transition-colors">
                          <img 
                            src={productImage} 
                            alt={it.name} 
                            className="w-14 h-14 rounded-xl object-cover border border-neutral-100 bg-neutral-50"
                          />
                          <div className="flex-1 min-w-0">
                            <h6 className="font-semibold text-neutral-800 text-sm truncate">{it.name}</h6>
                            <p className="text-xs text-neutral-500 font-medium mt-0.5">
                              Số lượng: {it.quantity} &times; {it.unitPrice?.toLocaleString('vi-VN')}₫
                            </p>
                            <div className="flex gap-4 mt-2">
                              {matchedProduct ? (
                                <Link 
                                  to={`/product/${matchedProduct.slug}`} 
                                  onClick={onClose}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Xem sản phẩm
                                </Link>
                              ) : (
                                <span className="text-xs text-neutral-400 italic">Sản phẩm không có sẵn</span>
                              )}
                              <button
                                onClick={() => handleBuyAgain(it)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Mua lại
                              </button>
                            </div>
                          </div>
                          <div className="text-right font-bold text-neutral-800 text-sm whitespace-nowrap">
                            {((it.totalPrice ?? (it.unitPrice * it.quantity))).toLocaleString('vi-VN')}₫
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleBuyAllAgain}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 px-4 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Mua lại tất cả sản phẩm
                  </button>
                </div>
              </div>

              {/* Delivery & Billing Info (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Card */}
                <div className="rounded-2xl border border-neutral-200/80 p-5 bg-neutral-50/30">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Thông tin giao hàng</h5>
                    {!isEditingAddress && (
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        Thay đổi
                      </button>
                    )}
                  </div>

                  {isEditingAddress ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Tên người nhận</label>
                        <input
                          type="text"
                          {...register('name')}
                          className={`w-full px-3 py-2 text-sm border rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-medium ${
                            errors.name ? 'border-red-500' : 'border-neutral-200'
                          }`}
                          placeholder="Nhập tên người nhận"
                        />
                        {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name.message as string}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Số điện thoại</label>
                        <input
                          type="text"
                          {...register('phone')}
                          className={`w-full px-3 py-2 text-sm border rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-medium ${
                            errors.phone ? 'border-red-500' : 'border-neutral-200'
                          }`}
                          placeholder="Nhập số điện thoại"
                        />
                        {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone.message as string}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Địa chỉ nhận hàng</label>
                        <textarea
                          rows={3}
                          {...register('address')}
                          className={`w-full px-3 py-2 text-sm border rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-medium resize-none ${
                            errors.address ? 'border-red-500' : 'border-neutral-200'
                          }`}
                          placeholder="Nhập địa chỉ nhận hàng"
                        />
                        {errors.address && <p className="text-xs text-red-500 font-medium mt-1">{errors.address.message as string}</p>}
                      </div>
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingAddress(false);
                            if (order) {
                              reset({
                                name: order.customer?.name || '',
                                phone: order.customer?.phone || '',
                                address: order.address || '',
                              });
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-500 hover:bg-neutral-50 transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          {isUpdating && <RefreshCw className="h-3 w-3 animate-spin" />}
                          Lưu thay đổi
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3.5 text-sm">
                      <div className="flex gap-3">
                        <User className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-400 font-medium">Người nhận</p>
                          <p className="font-semibold text-neutral-800 mt-0.5">{order.customer?.name || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Phone className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-400 font-medium">Số điện thoại</p>
                          <p className="font-semibold text-neutral-800 mt-0.5">{order.customer?.phone || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-400 font-medium">Địa chỉ giao hàng</p>
                          <p className="font-semibold text-neutral-800 mt-0.5 leading-relaxed">{order.address || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Billing Summary Card */}
                <div className="rounded-2xl border border-neutral-200/80 p-5 bg-white">
                  <h5 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4">Chi tiết thanh toán</h5>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-neutral-500 font-medium">
                      <span>Mã đơn hàng</span>
                      <span className="font-mono text-xs text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded">
                        #{order._id}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-500 font-medium">
                      <span>Phương thức</span>
                      <span className="font-semibold text-neutral-700">{order.paymentMethod || 'COD'}</span>
                    </div>
                    <div className="border-t border-neutral-100 pt-3 flex justify-between items-center mt-2">
                      <span className="font-bold text-neutral-800">Tổng thanh toán</span>
                      <span className="text-lg font-black text-emerald-600">
                        {order.total?.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              Không tìm thấy thông tin đơn hàng này.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetail;
