import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../integrations/firebase';
import Footer from '../../../components/layout/Footer';
import Header from '../../../components/layout/Header';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (credential.user && name.trim()) {
        await updateProfile(credential.user, { displayName: name.trim() });
      }
      navigate('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đăng ký thất bại.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-40 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-md">
          <div className="bg-white shadow-xl rounded-3xl border border-border p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Đăng ký</h1>
            <p className="text-sm text-foreground/70 mb-6">Tạo tài khoản để bắt đầu mua sắm.</p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="name">Họ và tên</label>
                <input id="name" type="text" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nguyễn Văn A" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="ban@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="password">Mật khẩu</label>
                <input id="password" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Tạo mật khẩu" />
              </div>

              {errorMessage ? <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{errorMessage}</div> : null}

              <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-primary text-white py-3 font-semibold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-70">
                {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
              </button>
            </form>

            <p className="text-sm text-foreground/70 mt-6 text-center">
              Bạn đã có tài khoản?{' '}
              <Link className="text-primary font-semibold hover:underline" to="/login">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
