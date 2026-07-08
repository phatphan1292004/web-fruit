import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../../../integrations/firebase";
import Layout from "../../../components/layout/layout";
import { createUser } from "../servers";
import { toast } from "react-toastify";

const registerSchema = yup.object().shape({
  name: yup.string().required("Họ và tên là bắt buộc"),
  email: yup.string().email("Email không đúng định dạng").required("Email là bắt buộc"),
  password: yup.string().min(6, "Mật khẩu phải chứa ít nhất 6 ký tự").required("Mật khẩu là bắt buộc"),
});

// Type RegisterInput removed

const RegisterPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      if (credential.user) {
        const displayName = data.name.trim();
        if (displayName) {
          await updateProfile(credential.user, { displayName });
        }
        const token = await credential.user.getIdToken();
        await createUser(
          {
            firebaseUid: credential.user.uid,
            displayName: displayName || credential.user.displayName || "",
            email: credential.user.email || data.email,
          },
          token
        );
      }
      toast.success("Đăng ký tài khoản thành công!");
      navigate("/login");
    } catch (error: any) {
      let message = "Đăng ký thất bại. Vui lòng thử lại!";
      if (error && typeof error === "object" && "code" in error) {
        const errCode = error.code;
        if (errCode === "auth/email-already-in-use") {
          message = "Email này đã được sử dụng bởi một tài khoản khác.";
        } else if (errCode === "auth/invalid-email") {
          message = "Địa chỉ email không đúng định dạng.";
        } else if (errCode === "auth/weak-password") {
          message = "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.";
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
        <div className="bg-white shadow-xl rounded-lg border border-border p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Đăng ký
          </h1>
          <p className="text-sm text-foreground/70 mb-6">
            Tạo tài khoản để bắt đầu mua sắm.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="name"
              >
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register("name")}
                className={`w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                  errors.name ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-primary"
                }`}
                placeholder="Tên của bạn"
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium">{errors.name.message as string}</p>
              )}
            </div>

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
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                className={`w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-primary"
                }`}
                placeholder="Tạo mật khẩu"
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
              {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
            </button>
          </form>

          <p className="text-sm text-foreground/70 mt-6 text-center">
            Bạn đã có tài khoản?{" "}
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

export default RegisterPage;
