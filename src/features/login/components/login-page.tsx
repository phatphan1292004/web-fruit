import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../integrations/firebase";
import Layout from "../../../components/layout/layout";
import { getProfile } from "../../../lib/api/users";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUid = userCredential.user.uid;
      document.cookie = `userId=${firebaseUid}; path=/; SameSite=Lax`;

      const profile = await getProfile(firebaseUid);
      if (!profile?.role) {
        throw new Error("Không lấy được quyền tài khoản. Vui lòng thử lại.");
      }

      localStorage.setItem("role", profile.role);
      if (profile.displayName) {
        localStorage.setItem("displayName", profile.displayName);
      }

      toast.success("Đăng nhập thành công!");
      navigate(profile.role === "admin" ? "/admin" : "/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đăng nhập thất bại.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout mainClassName="bg-background pt-40 pb-16">
      <div className="container mx-auto px-4 md:px-8 max-w-md">
        <div className="bg-white shadow-xl rounded-3xl border border-border p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Đăng nhập</h1>
          <p className="text-sm text-foreground/70 mb-6">
            Chào mừng bạn quay lại. Vui lòng đăng nhập để tiếp tục.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>

            {errorMessage ? (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary text-white py-3 font-semibold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-sm text-foreground/70 mt-6 text-center">
            Bạn chưa có tài khoản?{" "}
            <Link
              className="text-primary font-semibold hover:underline"
              to="/register"
            >
              Tạo tài khoản
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
