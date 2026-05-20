import { motion } from 'framer-motion';
import { FiEdit3, FiAward } from 'react-icons/fi';
import { userProfile } from './mockData';

const ProfileBanner = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-50 via-white to-orange-50 p-6 md:p-10 shadow-[0_12px_40px_rgba(16,185,129,0.08)] border border-border/60"
    >
      <div className="absolute -top-16 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
        <div className="flex items-start gap-5">
          <img src={userProfile.avatar} alt={userProfile.name} className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-4 ring-white shadow-xl" />
          <div>
            <p className="text-sm text-foreground/60">Xin chào,</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{userProfile.name}</h1>
            <p className="text-foreground/70 mt-2">{userProfile.email}</p>
            <p className="text-sm text-foreground/60 mt-1">Thành viên từ năm {userProfile.memberSince}</p>
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

        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg hover:bg-primary/90 transition-all duration-300">
          <FiEdit3 />
          Chỉnh sửa hồ sơ
        </button>
      </div>
    </motion.section>
  );
};

export default ProfileBanner;
