import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { fetchDashboardStats, type BackendDashboardStats } from '../servers/dashboard';
import { ORDER_STATUS_MAP } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const DashboardPage = () => {
  const [data, setData] = useState<BackendDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const stats = await fetchDashboardStats();
        if (stats) {
          setData(stats);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const statsList = [
    {
      id: 'revenue',
      label: 'Tổng doanh thu',
      value: formatCurrency(data.stats.revenue.value),
      change: data.stats.revenue.change,
      changeLabel: 'so với tháng trước',
      icon: <FiDollarSign />,
      color: 'emerald',
    },
    {
      id: 'orders',
      label: 'Đơn hàng',
      value: data.stats.orders.value.toLocaleString('vi-VN'),
      change: data.stats.orders.change,
      changeLabel: 'so với tháng trước',
      icon: <FiShoppingCart />,
      color: 'blue',
    },
    {
      id: 'users',
      label: 'Khách hàng',
      value: data.stats.customers.value.toLocaleString('vi-VN'),
      change: data.stats.customers.change,
      changeLabel: 'so với tháng trước',
      icon: <FiUsers />,
      color: 'orange',
    },
    {
      id: 'products',
      label: 'Sản phẩm',
      value: data.stats.products.value.toLocaleString('vi-VN'),
      change: 0,
      changeLabel: 'tất cả hoạt động',
      icon: <FiPackage />,
      color: 'purple',
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsList.map((stat, index) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            changeLabel={stat.changeLabel}
            icon={stat.icon}
            color={stat.color as 'emerald' | 'blue' | 'orange' | 'purple'}
            index={index}
          />
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Doanh thu theo tháng</h3>
            <p className="text-sm text-slate-400 mt-0.5">Tổng quan doanh thu trong năm {currentYear}</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-500">Doanh thu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-slate-500">Đơn hàng</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                fontSize: '13px',
              }}
              formatter={(value) => [formatCurrency(Number(value)), 'Doanh thu']}
              labelFormatter={(label) => `Tháng ${label}`}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2.5}
              fill="url(#colorRevenue)"
              dot={{ fill: '#22c55e', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">Đơn hàng gần đây</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {data.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                Chưa có đơn hàng nào được ghi nhận.
              </div>
            ) : (
              data.recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">
                        ORD-{order.id.substring(order.id.length - 8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} statusMap={ORDER_STATUS_MAP} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{order.customer} • {order.product}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-slate-700">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-slate-400">{formatDate(order.date)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">Sản phẩm bán chạy</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {data.topProducts.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                Chưa có dữ liệu bán hàng cho sản phẩm nào.
              </div>
            ) : (
              data.topProducts.map((product, idx) => (
                <div key={product.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <span className="text-sm font-bold text-slate-300 w-5">{idx + 1}</span>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] font-semibold flex-shrink-0">
                      NO IMG
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600">{product.sold} đã bán</p>
                    <p className="text-xs text-slate-400">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
