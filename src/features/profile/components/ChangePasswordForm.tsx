import { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { auth } from '../../../integrations/firebase';

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải chứa ít nhất 6 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu mới không khớp!');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('Mật khẩu mới không được trùng mật khẩu cũ!');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        toast.error('Không tìm thấy thông tin phiên đăng nhập. Vui lòng đăng nhập lại!');
        setIsSubmitting(false);
        return;
      }

      // Re-authenticate user before updating password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      toast.success('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        toast.error('Mật khẩu hiện tại không chính xác!');
      } else {
        toast.error('Đổi mật khẩu thất bại. Vui lòng thử lại!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60 max-w-xl">
      <h3 className="text-2xl font-bold text-foreground mb-2">Đổi mật khẩu</h3>
      <p className="text-sm text-foreground/50 mb-6">Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Mật khẩu hiện tại</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Nhập mật khẩu hiện tại"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-border bg-white pl-11 pr-11 py-3.5 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
              <FiLock className="w-5 h-5" />
            </div>
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              disabled={isSubmitting}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground transition-colors"
            >
              {showCurrent ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Mật khẩu mới</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-border bg-white pl-11 pr-11 py-3.5 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
              <FiLock className="w-5 h-5" />
            </div>
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              disabled={isSubmitting}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground transition-colors"
            >
              {showNew ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Xác nhận mật khẩu mới</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-border bg-white pl-11 pr-11 py-3.5 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
              <FiLock className="w-5 h-5" />
            </div>
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              disabled={isSubmitting}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground transition-colors"
            >
              {showConfirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 font-bold hover:bg-primary/95 transition-all shadow-md hover:shadow-lg disabled:opacity-75"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Cập nhật mật khẩu
          </button>
        </div>
      </form>
    </section>
  );
};

export default ChangePasswordForm;
