import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: ReactNode;
  color: 'emerald' | 'blue' | 'orange' | 'purple';
  index?: number;
}

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    shadow: 'shadow-emerald-200',
  },
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
    shadow: 'shadow-blue-200',
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-gradient-to-br from-orange-400 to-orange-600',
    shadow: 'shadow-orange-200',
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600',
    shadow: 'shadow-purple-200',
  },
};

const StatCard = ({ label, value, change, changeLabel, icon, color, index = 0 }: StatCardProps) => {
  const colors = colorMap[color];
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-default"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          <div className="flex items-center gap-1.5 mt-2">
            {isPositive ? (
              <FiTrendingUp className="text-emerald-500 text-sm" />
            ) : (
              <FiTrendingDown className="text-red-500 text-sm" />
            )}
            <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}
              {change}%
            </span>
            <span className="text-xs text-slate-400">{changeLabel}</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center shadow-lg ${colors.shadow}`}>
          <span className="text-white text-xl">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
