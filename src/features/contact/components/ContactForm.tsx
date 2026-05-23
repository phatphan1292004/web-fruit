import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCheckCircle } from 'react-icons/fi';

const initialState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const ContactForm = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Vui lòng nhập họ và tên.';
    if (!form.email.trim()) next.email = 'Vui lòng nhập email.';
    if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Email chưa đúng định dạng.';
    if (!form.phone.trim()) next.phone = 'Vui lòng nhập số điện thoại.';
    if (!form.subject.trim()) next.subject = 'Vui lòng chọn chủ đề.';
    if (!form.message.trim()) next.message = 'Vui lòng nhập nội dung tin nhắn.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    setLoading(false);
    setSubmitted(true);
    setForm(initialState);
    window.setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <motion.section
      id="contact-form"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className="rounded-[2.5rem] bg-white p-6 md:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)] border border-border/60"
    >
      <h2 className="text-3xl font-bold text-foreground">Gửi lời nhắn cho chúng tôi</h2>
      <p className="mt-2 text-foreground/65 leading-relaxed">
        Hãy cho chúng tôi biết bạn đang quan tâm điều gì. Đội ngũ Fresh Fruit sẽ phản hồi nhanh nhất có thể với sự tận tâm và chu đáo.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {[
          ['name', 'Họ và tên', 'Nhập họ và tên của bạn'],
          ['email', 'Email', 'name@example.com'],
          ['phone', 'Số điện thoại', '0909 123 456'],
          ['subject', 'Chủ đề', 'Bạn cần hỗ trợ về...'],
        ].map(([key, label, placeholder]) => (
          <div key={key}>
            <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
            <input
              value={(form as Record<string, string>)[key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-foreground placeholder:text-foreground/35 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 ${errors[key] ? 'border-rose-300' : 'border-border/60 focus:border-primary'}`}
            />
            {errors[key] && <p className="mt-2 text-sm text-rose-500">{errors[key]}</p>}
          </div>
        ))}

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Nội dung tin nhắn</label>
          <textarea
            rows={5}
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Hãy cho chúng tôi biết nhu cầu của bạn, chúng tôi sẽ tư vấn chi tiết và tận tâm."
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-foreground placeholder:text-foreground/35 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 ${errors.message ? 'border-rose-300' : 'border-border/60 focus:border-primary'}`}
          />
          {errors.message && <p className="mt-2 text-sm text-rose-500">{errors.message}</p>}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white shadow-md hover:shadow-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
          {!loading && <FiSend />}
        </motion.button>

        {submitted && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700 font-medium">
            <FiCheckCircle />
            Cảm ơn bạn! Chúng tôi đã nhận được liên hệ và sẽ phản hồi sớm nhất.
          </motion.div>
        )}
      </form>
    </motion.section>
  );
};

export default ContactForm;
