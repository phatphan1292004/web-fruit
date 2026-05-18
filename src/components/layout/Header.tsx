import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Fruits', href: '#fruits' },
  { name: 'Combo', href: '#combo' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(() => readCookie('userId'));
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; Max-Age=0; SameSite=Lax';
    setUserId(null);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const nextUserId = readCookie('userId');
    if (nextUserId !== userId) {
      setUserId(nextUserId);
    }
  }, [location.pathname, userId]);

  useEffect(() => {
    if (!userMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) {
        return;
      }
      if (!userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled ? 'py-3 glass' : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg"
          >
            M
          </motion.div>
          <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Morning Fruit
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-foreground/80 hover:text-primary font-medium transition-colors relative group text-sm uppercase tracking-wider"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-foreground/80 hover:text-primary transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          
          <Link
            to="/cart"
            className="p-2 text-foreground/80 hover:text-primary transition-colors relative group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
              3
            </span>
          </Link>

          {userId ? (
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-foreground text-background hover:bg-primary hover:text-white px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                <User className="w-4 h-4" />
                <span>Tài khoản</span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-3 w-72 rounded-3xl border border-border/60 bg-white shadow-2xl z-50 overflow-hidden"
                    role="menu"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3 border border-primary/40 bg-primary/5 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                            M
                          </div>
                          <span className="text-sm font-semibold text-foreground">Tài khoản</span>
                        </div>
                        <span className="text-primary text-lg">›</span>
                      </div>

                      <div className="mt-4 border-b border-border/60 pb-3">
                        <h4 className="text-sm font-semibold text-foreground">Menu</h4>
                      </div>

                      <div className="mt-3 flex flex-col gap-1">
                        <Link
                          to="/profile"
                          className="flex font-semibold items-center justify-between px-4 py-2 rounded-xl text-sm text-foreground/80 hover:bg-muted transition-colors"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>Thông tin cá nhân</span>
                          <span className="text-foreground/40">›</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex font-semibold items-center justify-between px-4 py-2 rounded-xl text-sm text-foreground/80 hover:bg-muted transition-colors"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>Lịch sử đơn hàng</span>
                          <span className="text-foreground/40">›</span>
                        </Link>
                        <button
                          type="button"
                          className="w-full text-left flex font-semibold items-center justify-between px-4 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          role="menuitem"
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                        >
                          <span>Đăng xuất</span>
                          <span className="text-destructive/70">›</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setUserMenuOpen(false)}
                        className="mt-4 w-full py-2 text-sm font-semibold text-primary border-t border-border/60"
                      >
                        Đóng
                      </button>
                    </div>
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
              <span>Login</span>
            </Link>
          )}

          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 sm:w-1/2 bg-background z-50 p-6 flex flex-col shadow-2xl md:hidden"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                  <X className="w-6 h-6 text-foreground/70 hover:text-primary" />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-4">
                <button className="w-full py-3 flex items-center justify-center gap-2 border border-border rounded-full hover:bg-muted transition-colors">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
                {userId ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/profile"
                      className="w-full py-3 flex items-center justify-center gap-2 border border-border rounded-full hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Thong tin ca nhan</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="w-full py-3 flex items-center justify-center gap-2 border border-border rounded-full hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Don hang da dat</span>
                    </Link>
                    <button
                      type="button"
                      className="w-full py-3 flex items-center justify-center gap-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-md"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <span>Dang xuat</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="w-full py-3 flex items-center justify-center gap-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
