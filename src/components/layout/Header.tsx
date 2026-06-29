import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { fetchCategories } from "../../features/category/servers/categories";
import { fruitCategoryMenu } from "../../features/category/components/constants";
import { useCartStore } from "../../features/cart/store/cart-store";
import { fetchUserByFirebaseUid } from "../../features/profile/servers";

type CategoryItem = { slug: string; name: string };

const navLinks = [
  { name: "Trang chủ", href: "/" },
  { name: "Trái cây", href: "/category" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Liên hệ", href: "/contact" },
];

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const readStoredName = () =>
  localStorage.getItem("displayName") ||
  localStorage.getItem("userName") ||
  localStorage.getItem("name");

const Header = () => {
  const items = useCartStore((state) => state.items);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userId, setUserId] = useState<string | null>(() =>
    readCookie("userId"),
  );
  const [userName, setUserName] = useState<string | null>(() =>
    readStoredName(),
  );
  const [fruitMenuOpen, setFruitMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [fruitCategories, setFruitCategories] = useState<CategoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeLogo, setStoreLogo] = useState<string | null>(() => localStorage.getItem('store_logo'));
  
  useEffect(() => {
    const handleLogoUpdate = () => {
      setStoreLogo(localStorage.getItem('store_logo'));
    };
    window.addEventListener('theme-changed', handleLogoUpdate);
    return () => window.removeEventListener('theme-changed', handleLogoUpdate);
  }, []);
  const fruitMenuRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const nextUserId = readCookie("userId");
    if (nextUserId !== userId) setUserId(nextUserId);
    if (!nextUserId) {
      const nextName = readStoredName();
      if (nextName !== userName) setUserName(nextName);
    }
  }, [location.pathname, userId, userName]);

  useEffect(() => {
    let isActive = true;

    const loadUser = async () => {
      if (!userId) {
        setUserName(null);
        return;
      }
      const data = await fetchUserByFirebaseUid(userId);
      if (!isActive) return;
      const resolvedName =
        data?.displayName || data?.name || data?.email || readStoredName();
      setUserName(resolvedName || null);
      if (resolvedName) {
        localStorage.setItem("displayName", resolvedName);
      }
      if (data?.role) {
        localStorage.setItem("role", data.role);
      }
    };

    loadUser();
    return () => {
      isActive = false;
    };
  }, [userId]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setFruitCategories(data);
      } catch {
        setFruitCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        fruitMenuRef.current &&
        !fruitMenuRef.current.contains(event.target as Node)
      ) {
        setFruitMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie =
      "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("displayName");
    localStorage.removeItem("userName");
    localStorage.removeItem("name");
    setUserId(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  const handleSearch = () => {
    const keyword = searchTerm.trim();
    if (!keyword) {
      navigate("/category");
      return;
    }

    navigate(`/category?search=${encodeURIComponent(keyword)}`);
    setSearchTerm("");
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled ? "py-3 glass" : "py-5 bg-transparent",
        )}
      >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 lg:gap-6 min-w-0 flex-1">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            {storeLogo ? (
              <img src={storeLogo} alt="Logo" className="w-10 h-10 rounded-full object-cover shadow-lg border border-slate-100" />
            ) : (
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg"
              >
                M
              </motion.div>
            )}
            <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Morning Fruit
            </span>
          </Link>

          <div className="hidden lg:flex flex-1 max-w-md items-center rounded-full border border-border/60 bg-white/80 backdrop-blur-md px-4 py-2 shadow-sm">
            <Search className="w-5 h-5 text-foreground/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Tìm kiếm trái cây, combo..."
              className="ml-3 w-full bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.name === "Trái cây" ? (
              <div
                key={link.name}
                className="relative"
                ref={fruitMenuRef}
                onMouseEnter={() => setFruitMenuOpen(true)}
                onMouseLeave={() => setFruitMenuOpen(false)}
              >
                <Link
                  to={link.href}
                  className="flex items-center gap-1 text-foreground/80 hover:text-primary font-medium transition-colors relative group text-sm uppercase tracking-wider"
                  onClick={() => setFruitMenuOpen(false)}
                >
                  {link.name}
                  <ChevronDown className="w-4 h-4" />
                </Link>

                <AnimatePresence>
                  {fruitMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-3 w-72 rounded-3xl border border-border/60 bg-white shadow-2xl overflow-hidden"
                    >
                      {(fruitCategories.length
                        ? fruitCategories
                        : fruitCategoryMenu
                      ).map((category) => (
                        <Link
                          key={category.slug}
                          to={`/category/${category.slug}`}
                          className="block px-5 py-3 text-sm font-medium text-foreground/80 hover:bg-primary hover:text-white transition-colors"
                          onClick={() => setFruitMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-primary font-medium transition-colors relative group text-sm uppercase tracking-wider"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/cart"
            className="p-2 text-foreground/80 hover:text-primary transition-colors relative group"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {totalQuantity}
            </span>
          </Link>

          {userId ? (
            <div className="relative hidden sm:flex" ref={userMenuRef}>
              <button
                type="button"
                className="flex items-center gap-2 bg-foreground text-background hover:bg-primary hover:text-white px-5 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                <User className="w-4 h-4" />
                <span className="max-w-35 truncate">{userName}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-border/60 bg-white shadow-2xl overflow-hidden"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-primary hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Thông tin cá nhân
                    </Link>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-destructive hover:text-white transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 bg-foreground text-background hover:bg-primary hover:text-white px-5 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
            >
              <User className="w-4 h-4" />
              <span>Tài khoản</span>
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors shrink-0"
            aria-label="Mở menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-[990] md:hidden"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[999] shadow-2xl p-6 flex flex-col md:hidden text-slate-700"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <span className="text-lg font-bold text-slate-800">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Search Bar */}
              <div className="mt-6">
                <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSearch();
                        setMobileMenuOpen(false);
                      }
                    }}
                    placeholder="Tìm kiếm trái cây..."
                    className="ml-2.5 w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold text-slate-700 hover:text-primary transition-colors py-2"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Account Section at the bottom */}
              <div className="border-t border-slate-100 pt-6 mt-6">
                {userId ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {userName ? userName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                        <p className="text-xs text-slate-400 truncate">Thành viên</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        Tài khoản
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-full font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-300 w-full"
                  >
                    <User className="w-4 h-4" />
                    <span>Đăng nhập / Đăng ký</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
