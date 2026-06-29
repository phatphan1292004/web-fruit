import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiLoader, FiHome, FiFileText } from 'react-icons/fi';
import { verifyVNPay } from '../../../lib/api/orders';
import Layout from '../../../components/layout/layout';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const VNPayReturnPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{
    success: boolean;
    message?: string;
    orderId?: string;
    total?: number;
  } | null>(null);

  useEffect(() => {
    const query = location.search.substring(1);
    if (!query) {
      setLoading(false);
      setStatus({ success: false, message: 'Tham số phản hồi không hợp lệ.' });
      return;
    }

    verifyVNPay(query)
      .then((res) => {
        setStatus(res);
      })
      .catch((err) => {
        console.error(err);
        setStatus({
          success: false,
          message: 'Đã xảy ra lỗi hệ thống khi kiểm tra giao dịch.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location]);

  return (
    <Layout mainClassName="bg-gradient-to-b from-background to-muted/30 min-h-screen relative pt-20 flex items-center justify-center">
      {/* Background blobs for premium glassmorphism feel */}
      <div className="absolute top-24 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" />
      <div className="absolute top-32 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="container mx-auto px-4 flex justify-center py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass w-full max-w-xl rounded-3xl border border-border/60 p-8 md:p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] bg-white/80 backdrop-blur-md"
        >
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="text-primary text-5xl"
              >
                <FiLoader />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground">Đang xác thực giao dịch...</h3>
              <p className="text-sm text-foreground/60 text-center">Vui lòng không tắt trình duyệt hoặc tải lại trang.</p>
            </div>
          )}

          {!loading && status && status.success && (
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm animate-bounce"
              >
                <FiCheckCircle />
              </motion.div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Thanh toán thành công!</h3>
              <p className="text-slate-500 mb-6 max-w-md">
                Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng. Đơn hàng của bạn đang được chuẩn bị để giao.
              </p>

              <div className="w-full bg-slate-50/70 border border-slate-100 rounded-2xl p-5 mb-8 text-sm text-left flex flex-col gap-3">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Mã đơn hàng</span>
                  <span className="font-semibold text-slate-700">{status.orderId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Phương thức thanh toán</span>
                  <span className="font-semibold text-slate-700">VNPAY Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số tiền thanh toán</span>
                  <span className="font-bold text-emerald-600 text-base">{formatCurrency(status.total ?? 0)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link
                  to="/"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all shadow-sm shadow-primary/20 hover:shadow-lg"
                >
                  <FiHome className="text-lg" />
                  Quay lại trang chủ
                </Link>
                <Link
                  to="/profile"
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-6 rounded-2xl transition-all"
                >
                  <FiFileText className="text-lg" />
                  Lịch sử đơn hàng
                </Link>
              </div>
            </div>
          )}

          {!loading && status && !status.success && (
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm"
              >
                <FiAlertTriangle />
              </motion.div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Thanh toán không thành công</h3>
              <p className="text-slate-500 mb-6 max-w-md">
                {status.message || 'Giao dịch của bạn đã bị hủy hoặc gặp sự cố trong quá trình xử lý.'}
              </p>

              {status.orderId && (
                <div className="w-full bg-slate-50/70 border border-slate-100 rounded-2xl p-5 mb-8 text-sm text-left flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mã đơn hàng</span>
                    <span className="font-semibold text-slate-700">{status.orderId}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link
                  to="/checkout/payment"
                  className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all shadow-sm shadow-rose-200 hover:shadow-lg"
                >
                  Thử thanh toán lại
                </Link>
                <Link
                  to="/"
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-6 rounded-2xl transition-all"
                >
                  <FiHome className="text-lg" />
                  Quay lại trang chủ
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default VNPayReturnPage;
