import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiUpload } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const themeColors = [
  { name: 'Xanh lá', value: '#22c55e', class: 'bg-emerald-500' },
  { name: 'Xanh dương', value: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Cam', value: '#f97316', class: 'bg-orange-500' },
  { name: 'Tím', value: '#8b5cf6', class: 'bg-purple-500' },
  { name: 'Hồng', value: '#ec4899', class: 'bg-pink-500' },
  { name: 'Đỏ', value: '#ef4444', class: 'bg-red-500' },
];

const SettingsPage = () => {
  const [selectedColor, setSelectedColor] = useState('#22c55e');
  const [saved, setSaved] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com/fruitshop',
    instagram: 'https://instagram.com/fruitshop',
    twitter: '',
    tiktok: 'https://tiktok.com/@fruitshop',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sectionCard = "bg-white rounded-2xl p-6 shadow-sm border border-slate-100";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Theme Color */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={sectionCard}
      >
        <h3 className="text-base font-bold text-slate-800 mb-1">Màu chủ đạo</h3>
        <p className="text-sm text-slate-400 mb-4">Chọn màu chủ đạo cho giao diện cửa hàng</p>
        <div className="flex gap-3">
          {themeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`w-10 h-10 rounded-xl ${color.class} flex items-center justify-center transition-all hover:scale-110 ${
                selectedColor === color.value
                  ? 'ring-2 ring-offset-2 ring-slate-300 scale-110'
                  : ''
              }`}
              title={color.name}
            >
              {selectedColor === color.value && (
                <FiCheck className="text-white text-sm" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={sectionCard}
      >
        <h3 className="text-base font-bold text-slate-800 mb-1">Logo cửa hàng</h3>
        <p className="text-sm text-slate-400 mb-4">Tải lên logo cho cửa hàng (khuyến nghị 200×200px)</p>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-200">
            FS
          </div>
          <div className="flex-1">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-emerald-300 transition-colors cursor-pointer">
              <FiUpload className="text-xl text-slate-400 mx-auto mb-1" />
              <p className="text-sm text-slate-500">Kéo thả hoặc click để tải ảnh</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, SVG (tối đa 2MB)</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={sectionCard}
      >
        <h3 className="text-base font-bold text-slate-800 mb-1">Banner trang chủ</h3>
        <p className="text-sm text-slate-400 mb-4">Banner hiển thị trên trang chủ (khuyến nghị 1920×600px)</p>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-300 transition-colors cursor-pointer bg-gradient-to-r from-emerald-50 to-orange-50">
          <FiUpload className="text-2xl text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Kéo thả hoặc click để tải banner</p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG (tối đa 5MB)</p>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className={sectionCard}
      >
        <h3 className="text-base font-bold text-slate-800 mb-1">Liên kết mạng xã hội</h3>
        <p className="text-sm text-slate-400 mb-4">Thêm link mạng xã hội hiển thị trên website</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FaFacebook className="text-blue-600 text-lg" />
            </div>
            <input
              type="url"
              value={socialLinks.facebook}
              onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
              <FaInstagram className="text-pink-600 text-lg" />
            </div>
            <input
              type="url"
              value={socialLinks.instagram}
              onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <FaXTwitter className="text-slate-800 text-lg" />
            </div>
            <input
              type="url"
              value={socialLinks.twitter}
              onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
              placeholder="https://x.com/..."
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <FaTiktok className="text-white text-lg" />
            </div>
            <input
              type="url"
              value={socialLinks.tiktok}
              onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })}
              placeholder="https://tiktok.com/..."
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all shadow-sm ${
            saved
              ? 'bg-emerald-500 shadow-emerald-200'
              : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
          }`}
        >
          {saved ? (
            <>
              <FiCheck className="text-sm" />
              Đã lưu!
            </>
          ) : (
            'Lưu cài đặt'
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
