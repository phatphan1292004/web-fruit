import { motion } from 'framer-motion';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useState, type ReactNode } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  rowClassName?: (item: T) => string;
}

function DataTable<T>({ columns, data, keyExtractor, onRowClick, emptyMessage = 'Không có dữ liệu', rowClassName }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as Record<string, unknown>)[sortKey];
    const bVal = (b as Record<string, unknown>)[sortKey];
    if (aVal == null || bVal == null) return 0;
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                className={`text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                  col.sortable ? 'cursor-pointer hover:text-slate-700 select-none' : ''
                } ${col.className || ''}`}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-emerald-500">
                      {sortDir === 'asc' ? <FiChevronUp className="text-xs" /> : <FiChevronDown className="text-xs" />}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, idx) => (
            <motion.tr
              key={keyExtractor(item)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              onClick={() => onRowClick?.(item)}
              className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              } ${rowClassName ? rowClassName(item) : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
