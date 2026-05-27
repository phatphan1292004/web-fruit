import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import type { ApiUser } from '../servers';

type ProfileBannerProps = {
  userProfile: ApiUser | null;
  isLoading?: boolean;
};

const fallbackAvatar = 'https://i.pravatar.cc/240?img=47';

const getMemberSince = (profile: ApiUser | null) => {
  if (profile?.memberSince) return profile.memberSince;
  if (profile?.createdAt) {
    const date = new Date(profile.createdAt);
    if (!Number.isNaN(date.getTime())) return date.getFullYear();
  }
  return null;
};

const ProfileBanner = ({ userProfile, isLoading }: ProfileBannerProps) => {
  const avatar = userProfile?.avatarUrl || userProfile?.avatar || fallbackAvatar;
  const name = userProfile?.displayName || userProfile?.name || 'Chưa cập nhật';
  const email = userProfile?.email || 'Chưa cập nhật';
  const memberSince = getMemberSince(userProfile);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-50 via-white to-orange-50 p-6 md:p-10 shadow-[0_12px_40px_rgba(16,185,129,0.08)] border border-border/60"
    >
      <div className="absolute -top-16 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
        <div className="flex items-start gap-5">
          <img src={avatar} alt={name} className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-4 ring-white shadow-xl" />
          <div>
            <p className="text-sm text-foreground/60">Xin chào,</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{name}</h1>
            <p className="text-foreground/70 mt-2">{email}</p>
            <p className="text-sm text-foreground/60 mt-1">
              {isLoading
                ? 'Đang tải thông tin...'
                : memberSince
                  ? `Thành viên từ năm ${memberSince}`
                  : 'Thành viên mới'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['VIP Customer', 'Organic Lover', 'Premium Member'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm border border-border/50">
                  <FiAward className="text-primary" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProfileBanner;
