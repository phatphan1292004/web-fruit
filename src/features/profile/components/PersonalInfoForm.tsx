import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload } from 'react-icons/fi';
import { userProfile } from './mockData';

const PersonalInfoForm = () => {
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60"
    >
      <h3 className="text-2xl font-bold text-foreground mb-6">Thông tin cá nhân</h3>

      <div className="flex items-center gap-5 mb-6">
        <img src={avatarPreview} alt="Avatar preview" className="w-20 h-20 rounded-full object-cover shadow-md" />
        <label className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
          <FiUpload />
          Upload avatar
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setAvatarPreview(URL.createObjectURL(file));
          }} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          ['Họ tên', userProfile.name],
          ['Email', userProfile.email],
          ['Số điện thoại', userProfile.phone],
          ['Ngày sinh', userProfile.birthday],
        ].map(([label, value]) => (
          <div key={label} className="space-y-2">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <input defaultValue={value} className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
        ))}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Giới tính</label>
          <select defaultValue={userProfile.gender} className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
            <option>Nữ</option>
            <option>Nam</option>
            <option>Khác</option>
          </select>
        </div>
      </div>

      <button className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
        Cập nhật thông tin
      </button>
    </motion.section>
  );
};

export default PersonalInfoForm;
