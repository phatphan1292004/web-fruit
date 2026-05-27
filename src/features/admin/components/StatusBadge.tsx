interface StatusBadgeProps {
  statusMap: Record<string, { label: string; color: string; bg: string }>;
  status: string;
}

const StatusBadge = ({ statusMap, status }: StatusBadgeProps) => {
  const config = statusMap[status] || { label: status, color: 'text-slate-700', bg: 'bg-slate-100' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color} ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
