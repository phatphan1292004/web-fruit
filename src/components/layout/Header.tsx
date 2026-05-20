import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, Menu, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const navLinks = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Trái cây', href: '/category' },
  { name: 'Giới thiệu', href: '/about' },
  { name: 'Liên hệ', href: '/contact' },
];

const fruitCategories = [
  { name: 'Trái cây trong nước', href: '/category#trong-nuoc' },
  { name: 'Trái cây nhập khẩu', href: '/category#nhap-khau' },
  { name: 'Giỏ quà trái cây', href: '/category#gio-qua' },
  { name: 'Trái cây hữu cơ', href: '/category#huu-co' },
  { name: 'Trái cây theo mùa', href: '/category#theo-mua' },
];

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userId, setUserId] = useState<string | null>(() => readCookie('userId'));
  const [fruitMenuOpen, setFruitMenuOpen] = useState(false);
  const fruitMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const nextUserId = readCookie('userId');
    if (nextUserId !== userId) setUserId(nextUserId);
  }, [location.pathname, userId]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (fruitMenuRef.current && !fruitMenuRef.current.contains(event.target as Node)) {
        setFruitMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled ? 'py-3 glass' : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 lg:gap-6 min-w-0 flex-1">
          <a href="/" className="flex items-center gap-2 group shrink-0">
            <motion.div whileHover={{ rotate: 10 }} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
              M
            </motion.div>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Morning Fruit
            </span>
          </a>

          <div className="hidden lg:flex flex-1 max-w-md items-center rounded-full border border-border/60 bg-white/80 backdrop-blur-md px-4 py-2 shadow-sm">
            <Search className="w-5 h-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Tìm kiếm trái cây, combo..."
              className="ml-3 w-full bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.name === 'Trái cây' ? (
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
                      {fruitCategories.map((category) => (
                        <a
                          key={category.name}
                          href={category.href}
                          className="block px-5 py-3 text-sm font-medium text-foreground/80 hover:bg-primary hover:text-white transition-colors"
                          onClick={() => setFruitMenuOpen(false)}
                        >
                          {category.name}
                        </a>
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
            )
          )}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/cart" className="p-2 text-foreground/80 hover:text-primary transition-colors relative group" aria-label="Giỏ hàng">
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">3</span>
          </Link>

          <Link to="/login" className="hidden sm:flex items-center gap-2 bg-foreground text-background hover:bg-primary hover:text-white px-5 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium">
            <User className="w-4 h-4" />
            <span>Tài khoản</span>
          </Link>

          <button className="md:hidden p-2 text-foreground" aria-label="Mở menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
