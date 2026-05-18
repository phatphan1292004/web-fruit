import { Routes, Route } from "react-router-dom";
import HomePage from "./features/home/components/HomePage";
import LoginPage from "./features/login/components/login-page";
import RegisterPage from "./features/register/components/register-page";
import { CartPage, PaymentPage, ShippingPage } from "./features/cart";
import CategoryPage from "./features/category/components/CategoryPage";
import ProductDetailPage from "./features/product-detail/components/ProductDetailPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/shipping" element={<ShippingPage />} />
        <Route path="/checkout/payment" element={<PaymentPage />} />
      </Routes>
    </div>
  );
}

export default App;
