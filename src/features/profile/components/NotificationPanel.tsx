import type { NotificationItem } from './types';

type Props = { items: NotificationItem[] };

const NotificationPanel = ({ items }: Props) => (
  <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
    <h3 className="text-2xl font-bold text-foreground mb-6">Thông báo</h3>
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-border/60 px-4 py-4 hover:shadow-md transition-all">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground">{item.title}</h4>
              <p className="mt-1 text-sm text-foreground/70">{item.description}</p>
            </div>
            <span className="shrink-0 text-xs text-foreground/50">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default NotificationPanel;
