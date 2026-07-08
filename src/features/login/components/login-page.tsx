import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../../../integrations/firebase";
import Layout from "../../../components/layout/layout";
import { getProfile } from "../../../lib/api/users";
import { toast } from "react-toastify";

const loginSchema = yup.object().shape({
  email: yup.string().email("Email không đúng định dạng").required("Email là bắt buộc"),
  password: yup.string().required("Mật khẩu là bắt buộc"),
});

// Type LoginInput removed

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
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
    } catch (error: any) {
      let message = "Đăng nhập thất bại. Vui lòng thử lại!";
      if (error && typeof error === "object" && "code" in error) {
        const errCode = error.code;
        if (errCode === "auth/invalid-credential" || errCode === "auth/wrong-password" || errCode === "auth/user-not-found") {
          message = "Tài khoản hoặc mật khẩu không chính xác.";
        } else if (errCode === "auth/too-many-requests") {
          message = "Tài khoản tạm thời bị khóa do thử quá nhiều lần. Vui lòng thử lại sau.";
        } else {
          message = error.message || message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
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

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                {...register("email")}
                className={`w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-primary"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className={`w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-primary"
                }`}
                placeholder="Nhập mật khẩu của bạn"
              />
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password.message as string}</p>
              )}
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
