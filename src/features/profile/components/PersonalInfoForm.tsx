import { motion } from 'framer-motion';
import type { ApiUser } from '../servers';

type PersonalInfoFormProps = {
  userProfile: ApiUser | null;
  isLoading?: boolean;
};

const fallbackAvatar = 'https://i.pravatar.cc/240?img=47';

const resolveField = (value?: string | number | null) =>
  value === undefined || value === null || value === '' ? 'Chưa cập nhật' : String(value);

const PersonalInfoForm = ({ userProfile, isLoading }: PersonalInfoFormProps) => {
  console.log('User Profile:', userProfile); // Debug log to check the structure of userProfile
  const avatar = userProfile?.avatarUrl || userProfile?.avatar || fallbackAvatar;
  const name = resolveField(userProfile?.displayName || userProfile?.name);
  const email = resolveField(userProfile?.email);
  const phone = resolveField(userProfile?.phone);
  const birthday = resolveField(userProfile?.birthday);
  const gender = resolveField(userProfile?.gender);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60"
    >
      <h3 className="text-2xl font-bold text-foreground mb-6">Thông tin cá nhân</h3>

      <div className="flex items-center gap-5 mb-6">
        <img src={avatar} alt={name} className="w-20 h-20 rounded-full object-cover shadow-md" />
        {isLoading ? (
          <span className="text-sm text-foreground/60">Đang tải thông tin...</span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          ['Họ tên', name],
          ['Email', email],
          ['Số điện thoại', phone],
          ['Ngày sinh', birthday],
          ['Giới tính', gender],
        ].map(([label, value]) => (
          <div key={label} className="space-y-2">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground">
              {value}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default PersonalInfoForm;
