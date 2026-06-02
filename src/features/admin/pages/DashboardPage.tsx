import { motion } from 'framer-motion';
import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
interface DashboardStat {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface TopProduct {
  id: string;
  name: string;
  image: string;
  sold: number;
  revenue: number;
  category: string;
}

const dashboardStats: DashboardStat[] = [
  {
    id: 'revenue',
    label: 'Tổng doanh thu',
    value: '₫248.500.000',
    change: 12.5,
    changeLabel: 'so với tháng trước',
    icon: 'revenue',
    color: 'emerald',
  },
  {
    id: 'orders',
    label: 'Đơn hàng',
    value: '1.284',
    change: 8.2,
    changeLabel: 'so với tháng trước',
    icon: 'orders',
    color: 'blue',
  },
  {
    id: 'users',
    label: 'Khách hàng',
    value: '3.842',
    change: 5.1,
    changeLabel: 'so với tháng trước',
    icon: 'users',
    color: 'orange',
  },
  {
    id: 'products',
    label: 'Sản phẩm',
    value: '8',
    change: 0.0,
    changeLabel: 'tất cả hoạt động',
    icon: 'products',
    color: 'purple',
  },
];

const revenueData: RevenueData[] = [
  { month: 'T1', revenue: 18500000, orders: 95 },
  { month: 'T2', revenue: 21200000, orders: 108 },
  { month: 'T3', revenue: 19800000, orders: 102 },
  { month: 'T4', revenue: 23500000, orders: 118 },
  { month: 'T5', revenue: 25100000, orders: 125 },
  { month: 'T6', revenue: 22800000, orders: 112 },
  { month: 'T7', revenue: 27300000, orders: 136 },
  { month: 'T8', revenue: 24600000, orders: 122 },
  { month: 'T9', revenue: 26900000, orders: 134 },
  { month: 'T10', revenue: 28400000, orders: 140 },
  { month: 'T11', revenue: 31200000, orders: 155 },
  { month: 'T12', revenue: 29800000, orders: 148 },
];

const recentOrders: RecentOrder[] = [
  {
    id: 'ORD-2024-001',
    customer: 'Nguyễn Văn An',
    product: 'Xoài Cát Hòa Lộc',
    total: 450000,
    status: 'delivered',
    date: '2024-12-15',
  },
  {
    id: 'ORD-2024-002',
    customer: 'Trần Thị Bình',
    product: 'Sầu Riêng Monthong Thái',
    total: 890000,
    status: 'shipped',
    date: '2024-12-15',
  },
  {
    id: 'ORD-2024-003',
    customer: 'Lê Hoàng Cường',
    product: 'Bưởi Da Xanh',
    total: 320000,
    status: 'processing',
    date: '2024-12-14',
  },
  {
    id: 'ORD-2024-004',
    customer: 'Phạm Minh Đức',
    product: 'Dưa Hấu Không Hạt',
    total: 150000,
    status: 'pending',
    date: '2024-12-14',
  },
  {
    id: 'ORD-2024-005',
    customer: 'Hoàng Thị Em',
    product: 'Nho Xanh Mỹ',
    total: 680000,
    status: 'cancelled',
    date: '2024-12-13',
  },
];

const topProducts: TopProduct[] = [
  {
    id: 'prod1',
    name: 'Sầu Riêng Monthong Thái',
    image: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=100&h=100&fit=crop',
    sold: 342,
    revenue: 51300000,
    category: 'Trái cây nhiệt đới',
  },
  {
    id: 'prod2',
    name: 'Xoài Cát Hòa Lộc',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100&h=100&fit=crop',
    sold: 285,
    revenue: 28500000,
    category: 'Trái cây Việt Nam',
  },
  {
    id: 'prod3',
    name: 'Nho Xanh Mỹ',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=100&h=100&fit=crop',
    sold: 256,
    revenue: 38400000,
    category: 'Trái cây nhập khẩu',
  },
  {
    id: 'prod4',
    name: 'Dâu Tây Đà Lạt',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=100&h=100&fit=crop',
    sold: 198,
    revenue: 19800000,
    category: 'Trái cây Việt Nam',
  },
  {
    id: 'prod5',
    name: 'Bưởi Da Xanh',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=100&h=100&fit=crop',
    sold: 176,
    revenue: 14080000,
    category: 'Trái cây Việt Nam',
  },
];
import { ORDER_STATUS_MAP } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

const iconMap: Record<string, React.ReactNode> = {
  revenue: <FiDollarSign />,
  orders: <FiShoppingCart />,
  users: <FiUsers />,
  products: <FiPackage />,
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const DashboardPage = () => {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            changeLabel={stat.changeLabel}
            icon={iconMap[stat.icon]}
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
            <p className="text-sm text-slate-400 mt-0.5">Tổng quan doanh thu trong năm 2024</p>
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
          <AreaChart data={revenueData}>
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
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">{order.id}</span>
                    <StatusBadge status={order.status} statusMap={ORDER_STATUS_MAP} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{order.customer} • {order.product}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-slate-700">{formatCurrency(order.total)}</p>
                  <p className="text-xs text-slate-400">{formatDate(order.date)}</p>
                </div>
              </div>
            ))}
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
            {topProducts.map((product, idx) => (
              <div key={product.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                <span className="text-sm font-bold text-slate-300 w-5">{idx + 1}</span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600">{product.sold} đã bán</p>
                  <p className="text-xs text-slate-400">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
