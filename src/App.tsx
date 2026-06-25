import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./features/home/components/HomePage";
import LoginPage from "./features/login/components/login-page";
import RegisterPage from "./features/register/components/register-page";
import { CartPage, PaymentPage, ShippingPage } from "./features/cart";
import CategoryPage from "./features/category/components/CategoryPage";
import ProductDetailPage from "./features/product-detail/components/ProductDetailPage";
import ProfilePage from "./features/profile/components/ProfilePage";
import AboutPage from "./features/about/components/AboutPage";
import ContactPage from "./features/contact/components/ContactPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import ChatButtons from "./components/layout/ChatButtons";

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

const AdminRoute = () => {
  const role = localStorage.getItem("role");
  return role === "admin" ? <AdminLayout /> : <Navigate to="/" replace />;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

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

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="orders" element={<OrderManagementPage />} />
          <Route path="reviews" element={<ReviewManagementPage />} />
          <Route path="chat" element={<ChatManagementPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      {!isAdminRoute && <ChatButtons />}
    </div>
  );
}

export default App;

