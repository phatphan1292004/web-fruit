import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../integrations/firebase";
import Layout from "../../../components/layout/layout";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      const msg = "Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.";
      setSuccessMessage(msg);
      toast.success(msg);
      setEmail("");
    } catch (error) {
      let message = "Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu.";
      if (error && typeof error === "object" && "code" in error) {
        const errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
          message = "Email này chưa được đăng ký trong hệ thống.";
        } else if (errorCode === "auth/invalid-email") {
          message = "Địa chỉ email không đúng định dạng.";
        } else {
          message = (error as any).message || message;
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Quên mật khẩu</h1>
          <p className="text-sm text-foreground/70 mb-6">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
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

            {errorMessage ? (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary text-white py-3 font-semibold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>

          <p className="text-sm text-foreground/70 mt-6 text-center">
            Quay lại{" "}
            <Link
              className="text-primary font-semibold hover:underline"
              to="/login"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
