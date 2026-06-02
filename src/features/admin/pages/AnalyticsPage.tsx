import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
} from 'recharts';
interface MonthlyRevenue {
  month: string;
  revenue: number;
  profit: number;
}

interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

interface TopSellingProduct {
  name: string;
  sold: number;
  revenue: number;
}

interface UserGrowthData {
  month: string;
  newUsers: number;
  totalUsers: number;
}

const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'T1', revenue: 18500000, profit: 5550000 },
  { month: 'T2', revenue: 21200000, profit: 6360000 },
  { month: 'T3', revenue: 19800000, profit: 5940000 },
  { month: 'T4', revenue: 23500000, profit: 7050000 },
  { month: 'T5', revenue: 25100000, profit: 7530000 },
  { month: 'T6', revenue: 22800000, profit: 6840000 },
  { month: 'T7', revenue: 27300000, profit: 8190000 },
  { month: 'T8', revenue: 24600000, profit: 7380000 },
  { month: 'T9', revenue: 26900000, profit: 8070000 },
  { month: 'T10', revenue: 28400000, profit: 8520000 },
  { month: 'T11', revenue: 31200000, profit: 9360000 },
  { month: 'T12', revenue: 29800000, profit: 8940000 },
];

const orderStatusData: OrderStatusData[] = [
  { name: 'Đã giao', value: 485, color: '#22c55e' },
  { name: 'Đang giao', value: 128, color: '#3b82f6' },
  { name: 'Đang xử lý', value: 96, color: '#f59e0b' },
  { name: 'Chờ xác nhận', value: 64, color: '#8b5cf6' },
  { name: 'Đã hủy', value: 42, color: '#ef4444' },
];

const topSellingProducts: TopSellingProduct[] = [
  { name: 'Sầu Riêng Monthong', sold: 342, revenue: 51300000 },
  { name: 'Dưa Hấu Không Hạt', sold: 320, revenue: 11200000 },
  { name: 'Xoài Cát Hòa Lộc', sold: 285, revenue: 28500000 },
  { name: 'Nho Xanh Mỹ', sold: 256, revenue: 38400000 },
  { name: 'Chuối Sấy Giòn', sold: 250, revenue: 11250000 },
];

const userGrowthData: UserGrowthData[] = [
  { month: 'T1', newUsers: 120, totalUsers: 1200 },
  { month: 'T2', newUsers: 145, totalUsers: 1345 },
  { month: 'T3', newUsers: 98, totalUsers: 1443 },
  { month: 'T4', newUsers: 167, totalUsers: 1610 },
  { month: 'T5', newUsers: 189, totalUsers: 1799 },
  { month: 'T6', newUsers: 156, totalUsers: 1955 },
  { month: 'T7', newUsers: 210, totalUsers: 2165 },
  { month: 'T8', newUsers: 178, totalUsers: 2343 },
  { month: 'T9', newUsers: 234, totalUsers: 2577 },
  { month: 'T10', newUsers: 267, totalUsers: 2844 },
  { month: 'T11', newUsers: 312, totalUsers: 3156 },
  { month: 'T12', newUsers: 286, totalUsers: 3442 },
];
import { formatCurrency } from '../utils/formatters';

const chartCard = "bg-white rounded-2xl p-6 shadow-sm border border-slate-100";

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={chartCard}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Doanh thu & Lợi nhuận</h3>
            <p className="text-sm text-slate-400 mt-0.5">So sánh theo tháng trong năm 2024</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-500">Doanh thu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-slate-500">Lợi nhuận</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="colorRevAnalytics" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfitAnalytics" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
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
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                name === 'revenue' ? 'Doanh thu' : 'Lợi nhuận',
              ]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} fill="url(#colorRevAnalytics)"
              dot={{ fill: '#22c55e', r: 3, strokeWidth: 2, stroke: '#fff' }} />
            <Area type="monotone" dataKey="profit" stroke="#fb923c" strokeWidth={2.5} fill="url(#colorProfitAnalytics)"
              dot={{ fill: '#fb923c', r: 3, strokeWidth: 2, stroke: '#fff' }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={chartCard}
        >
          <h3 className="text-base font-bold text-slate-800 mb-6">Phân bổ đơn hàng</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '13px',
                  }}
                  formatter={(value, name) => [`${value} đơn`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-500">{item.name}</span>
                <span className="font-semibold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Selling Products Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={chartCard}
        >
          <h3 className="text-base font-bold text-slate-800 mb-6">Top sản phẩm bán chạy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingProducts} layout="vertical" barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '13px',
                }}
                formatter={(value) => [`${value} sản phẩm`, 'Đã bán']}
              />
              <Bar dataKey="sold" fill="#22c55e" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* User Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className={chartCard}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Tăng trưởng người dùng</h3>
            <p className="text-sm text-slate-400 mt-0.5">Người dùng mới và tổng số theo tháng</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-500">Tổng users</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-slate-500">Mới</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                fontSize: '13px',
              }}
              formatter={(value, name) => [
                value,
                name === 'totalUsers' ? 'Tổng users' : 'Mới',
              ]}
            />
            <Line type="monotone" dataKey="totalUsers" stroke="#3b82f6" strokeWidth={2.5}
              dot={{ fill: '#3b82f6', r: 3, strokeWidth: 2, stroke: '#fff' }} />
            <Line type="monotone" dataKey="newUsers" stroke="#8b5cf6" strokeWidth={2.5}
              dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 2, stroke: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
