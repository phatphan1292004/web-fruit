import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const contactSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập họ và tên.'),
  email: yup.string().email('Email chưa đúng định dạng.').required('Vui lòng nhập email.'),
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại.')
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không đúng định dạng.'),
  subject: yup.string().required('Vui lòng nhập chủ đề.'),
  message: yup.string().required('Vui lòng nhập nội dung tin nhắn.'),
});

// Type ContactInput removed

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    setLoading(false);
    toast.success('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.');
    setSubmitted(true);
    reset();
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Họ và tên</label>
          <input
            placeholder="Nhập họ và tên của bạn"
            disabled={loading}
            {...register('name')}
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-foreground placeholder:text-foreground/35 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 ${
              errors.name ? 'border-rose-300' : 'border-border/60 focus:border-primary'
            }`}
          />
          {errors.name && <p className="mt-2 text-sm text-rose-500">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Email</label>
          <input
            placeholder="name@example.com"
            disabled={loading}
            {...register('email')}
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-foreground placeholder:text-foreground/35 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 ${
              errors.email ? 'border-rose-300' : 'border-border/60 focus:border-primary'
            }`}
          />
          {errors.email && <p className="mt-2 text-sm text-rose-500">{errors.email.message as string}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Số điện thoại</label>
          <input
            placeholder="0909 123 456"
            disabled={loading}
            {...register('phone')}
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-foreground placeholder:text-foreground/35 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 ${
              errors.phone ? 'border-rose-300' : 'border-border/60 focus:border-primary'
            }`}
          />
          {errors.phone && <p className="mt-2 text-sm text-rose-500">{errors.phone.message as string}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Chủ đề</label>
          <input
            placeholder="Bạn cần hỗ trợ về..."
            disabled={loading}
            {...register('subject')}
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-foreground placeholder:text-foreground/35 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 ${
              errors.subject ? 'border-rose-300' : 'border-border/60 focus:border-primary'
            }`}
          />
          {errors.subject && <p className="mt-2 text-sm text-rose-500">{errors.subject.message as string}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Nội dung tin nhắn</label>
          <textarea
            rows={5}
            placeholder="Hãy cho chúng tôi biết nhu cầu của bạn, chúng tôi sẽ tư vấn chi tiết và tận tâm."
            disabled={loading}
            {...register('message')}
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-foreground placeholder:text-foreground/35 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 ${
              errors.message ? 'border-rose-300' : 'border-border/60 focus:border-primary'
            }`}
          />
          {errors.message && <p className="mt-2 text-sm text-rose-500">{errors.message.message as string}</p>}
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
