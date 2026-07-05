import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./features/home/components/HomePage";
import LoginPage from "./features/login/components/login-page";
import RegisterPage from "./features/register/components/register-page";
import { CartPage, PaymentPage, ShippingPage, VNPayReturnPage } from "./features/cart";
import CategoryPage from "./features/category/components/CategoryPage";
import ProductDetailPage from "./features/product-detail/components/ProductDetailPage";
import ProfilePage from "./features/profile/components/ProfilePage";
import AboutPage from "./features/about/components/AboutPage";
import ContactPage from "./features/contact/components/ContactPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import ChatButtons from "./components/layout/ChatButtons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin imports
import AdminLayout from "./features/admin/layouts/AdminLayout";
import DashboardPage from "./features/admin/pages/DashboardPage";
import UserManagementPage from "./features/admin/pages/UserManagementPage";
import ProductManagementPage from "./features/admin/pages/ProductManagementPage";
import OrderManagementPage from "./features/admin/pages/OrderManagementPage";
import ReviewManagementPage from "./features/admin/pages/ReviewManagementPage";
import AnalyticsPage from "./features/admin/pages/AnalyticsPage";
import SettingsPage from "./features/admin/pages/SettingsPage";
import ChatManagementPage from "./features/admin/pages/ChatManagementPage";
import PromotionManagementPage from "./features/admin/pages/PromotionManagementPage";

const AdminRoute = () => {
  const role = localStorage.getItem("role");
  return role === "admin" ? <AdminLayout /> : <Navigate to="/" replace />;
};

function hexToHslString(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  const hDeg = Math.round(h * 360 * 10) / 10;
  const sPct = Math.round(s * 100 * 10) / 10;
  const lPct = Math.round(l * 100 * 10) / 10;
  return `${hDeg} ${sPct}% ${lPct}%`;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const applyTheme = () => {
      const themeColor = localStorage.getItem('theme_color');
      if (themeColor) {
        const hslVal = hexToHslString(themeColor);
        document.documentElement.style.setProperty('--primary', hslVal);
        document.documentElement.style.setProperty('--ring', hslVal);
      } else {
        document.documentElement.style.setProperty('--primary', '142.1 76.2% 36.3%');
        document.documentElement.style.setProperty('--ring', '142.1 76.2% 36.3%');
      }
    };
    applyTheme();
    window.addEventListener('storage', applyTheme);
    window.addEventListener('theme-changed', applyTheme);
    return () => {
      window.removeEventListener('storage', applyTheme);
      window.removeEventListener('theme-changed', applyTheme);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/shipping" element={<ShippingPage />} />
        <Route path="/checkout/payment" element={<PaymentPage />} />
        <Route path="/checkout/vnpay-return" element={<VNPayReturnPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="orders" element={<OrderManagementPage />} />
          <Route path="reviews" element={<ReviewManagementPage />} />
          <Route path="promotions" element={<PromotionManagementPage />} />
          <Route path="chat" element={<ChatManagementPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      {!isAdminRoute && <ChatButtons />}
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default App;

