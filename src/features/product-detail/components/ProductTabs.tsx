import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiFileText, FiActivity, FiPackage, FiMessageCircle } from 'react-icons/fi';
import type { ProductDetail } from './types';

type ProductTabsProps = {
  product: ProductDetail;
};

const tabs = [
  { id: 'description', label: 'Mô tả chi tiết', icon: FiFileText },
  { id: 'nutrition', label: 'Thành phần dinh dưỡng', icon: FiActivity },
  { id: 'storage', label: 'Hướng dẫn bảo quản', icon: FiPackage },
  { id: 'reviews', label: 'Đánh giá khách hàng', icon: FiMessageCircle },
] as const;

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('description');

  return (
    <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)] border border-border/60">
      <div className="flex flex-wrap gap-3 border-b border-border pb-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'bg-muted/40 text-foreground hover:bg-muted'}`}
          >
            <tab.icon />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="text-foreground/75 leading-relaxed"
        >
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Mô tả sản phẩm</h3>
              <p>{product.description}</p>
              <p>
                Đây là dòng trái cây cao cấp phù hợp cho gia đình, biếu tặng hoặc thưởng thức hằng ngày với hương vị tự nhiên và chất lượng ổn định.
              </p>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Thành phần dinh dưỡng</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.nutrition.map((item) => (
                  <li key={item} className="rounded-2xl bg-emerald-50 px-4 py-4 border border-emerald-100">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'storage' && (
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Hướng dẫn bảo quản</h3>
              <ul className="space-y-3">
                {product.storageTips.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl bg-orange-50 px-4 py-4 border border-orange-100">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Tổng quan đánh giá</h3>
              <p>Phần đánh giá chi tiết được hiển thị bên dưới ở mục review khách hàng.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProductTabs;
