import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, Loader2, User } from 'lucide-react';
import { updateUserProfile, type ApiUser } from '../servers';

type PersonalInfoFormProps = {
  userProfile: ApiUser | null;
  isLoading?: boolean;
  onProfileUpdate?: (updated: ApiUser) => void;
};

const getFallbackAvatar = (seed?: string) => {
  if (!seed) return sampleAvatars[0];
  let sum = 0;
  for (let i = 0; i < seed.length; i++) {
    sum += seed.charCodeAt(i);
  }
  return sampleAvatars[sum % sampleAvatars.length];
};

const sampleAvatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
];

const resolveField = (value?: string | number | null) =>
  value === undefined || value === null || value === '' ? 'Chưa cập nhật' : String(value);

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

const displayFormatDate = (dateStr?: string | null) => {
  if (!dateStr) return 'Chưa cập nhật';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';
  return date.toLocaleDateString('vi-VN');
};

const PersonalInfoForm = ({ userProfile, isLoading, onProfileUpdate }: PersonalInfoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    birthday: '',
    gender: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || userProfile.name || '',
        phone: userProfile.phone || '',
        birthday: formatDate(userProfile.birthday || (userProfile as any).birthDay),
        gender: userProfile.gender || '',
      });
    }
  }, [userProfile]);

  if (isLoading) {
    return (
      <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60 animate-pulse">
        <div className="h-8 w-48 bg-neutral-200/80 rounded mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-neutral-200/80 shrink-0" />
          <div className="space-y-3 w-full">
            <div className="h-4 w-36 bg-neutral-200/80 rounded" />
            <div className="flex gap-2.5 flex-wrap">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-neutral-200/80" />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-neutral-200/80 rounded" />
              <div className="h-12 w-full bg-neutral-200/40 rounded-2xl border border-neutral-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const avatar = userProfile?.avatarUrl || userProfile?.avatar || getFallbackAvatar(userProfile?.firebaseUid || userProfile?.email);

  const handleSelectAvatar = async (avatarUrl: string) => {
    if (!userProfile?.firebaseUid || isUpdating || updatingAvatar) return;
    setUpdatingAvatar(avatarUrl);
    try {
      const response = await updateUserProfile(userProfile.firebaseUid, { avatarUrl });
      if (response && onProfileUpdate) {
        onProfileUpdate(response);
      }
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      setUpdatingAvatar(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.firebaseUid || isUpdating) return;
    setIsUpdating(true);
    try {
      const response = await updateUserProfile(userProfile.firebaseUid, {
        displayName: formData.displayName,
        phone: formData.phone,
        birthday: formData.birthday ? new Date(formData.birthday).toISOString() : undefined,
        gender: formData.gender,
      });
      if (response && onProfileUpdate) {
        onProfileUpdate(response);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">Thông tin cá nhân</h3>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full border border-emerald-100"
          >
            <Edit2 className="w-4 h-4" />
            Chỉnh sửa
          </button>
        ) : null}
      </div>

      {/* Avatar selection section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-6 border-b border-border/60">
        <div className="relative shrink-0">
          <img
            src={avatar}
            alt={formData.displayName || 'User avatar'}
            className={`w-20 h-20 rounded-full object-cover shadow-md border-2 border-primary/20 ${
              updatingAvatar ? 'opacity-40' : ''
            }`}
          />
          {updatingAvatar && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-full">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground/70 flex items-center gap-1.5">
            <User className="w-4 h-4 text-primary" />
            Chọn ảnh đại diện mẫu:
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            {sampleAvatars.map((url) => {
              const isActive = avatar === url;
              const isChecking = updatingAvatar === url;
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => handleSelectAvatar(url)}
                  disabled={!!updatingAvatar || isUpdating}
                  className={`w-11 h-11 rounded-full overflow-hidden transition-all duration-300 relative border-2 hover:scale-110 active:scale-95 ${
                    isActive
                      ? 'border-emerald-600 ring-2 ring-emerald-100 scale-105'
                      : 'border-border hover:border-emerald-300'
                  }`}
                >
                  <img src={url} alt="Sample avatar" className="w-full h-full object-cover" />
                  {isChecking && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    </div>
                  )}
                  {isActive && !isChecking && (
                    <div className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-0.5 shadow-md">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Họ tên</label>
            {isEditing ? (
              <input
                type="text"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full rounded-2xl border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white px-4 py-3 text-sm text-foreground focus:outline-none transition-all shadow-sm"
                placeholder="Nhập họ và tên"
              />
            ) : (
              <div className="w-full rounded-2xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-foreground/80 font-medium">
                {resolveField(userProfile?.displayName || userProfile?.name)}
              </div>
            )}
          </div>

          {/* Email (Always Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Email</label>
            <div className="w-full rounded-2xl border border-border/50 bg-muted/30 px-4 py-3 text-sm text-foreground/50 select-none cursor-not-allowed">
              {resolveField(userProfile?.email)}
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Số điện thoại</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-2xl border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white px-4 py-3 text-sm text-foreground focus:outline-none transition-all shadow-sm"
                placeholder="Nhập số điện thoại"
              />
            ) : (
              <div className="w-full rounded-2xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-foreground/80 font-medium">
                {resolveField(userProfile?.phone)}
              </div>
            )}
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Ngày sinh</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full rounded-2xl border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white px-4 py-3 text-sm text-foreground focus:outline-none transition-all shadow-sm"
              />
            ) : (
              <div className="w-full rounded-2xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-foreground/80 font-medium">
                {displayFormatDate(userProfile?.birthday || (userProfile as any).birthDay)}
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Giới tính</label>
            {isEditing ? (
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full rounded-2xl border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white px-4 py-3 text-sm text-foreground focus:outline-none transition-all shadow-sm"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            ) : (
              <div className="w-full rounded-2xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-foreground/80 font-medium">
                {resolveField(userProfile?.gender)}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center gap-3 justify-end pt-4 border-t border-border/60">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => {
                setIsEditing(false);
                if (userProfile) {
                  setFormData({
                    displayName: userProfile.displayName || userProfile.name || '',
                    phone: userProfile.phone || '',
                    birthday: formatDate(userProfile.birthday || (userProfile as any).birthDay),
                    gender: userProfile.gender || '',
                  });
                }
              }}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-75"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Lưu thay đổi
            </button>
          </div>
        )}
      </form>
    </motion.section>
  );
};

export default PersonalInfoForm;
