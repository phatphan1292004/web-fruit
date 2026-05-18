import { useEffect, useState } from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const navLinks = [
  { name: 'Trang chủ', to: '/' },
  { name: 'Trái cây', to: '/#fruits' },
  { name: 'Combo', to: '/#combo' },
  { name: 'Giới thiệu', to: '/#about' },
  { name: 'Liên hệ', to: '/#contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'py-3 glass' : 'py-5 bg-transparent')}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-6 min-w-0 flex-1">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <motion.div whileHover={{ rotate: 10 }} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
              M
            </motion.div>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Morning Fruit
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2 border border-white/30 min-w-0 max-w-[420px] w-full">
            <Search className="w-4 h-4 text-foreground/60 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm trái cây..."
              className="bg-transparent outline-none text-sm text-foreground placeholder:text-foreground/50 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.to} className="text-foreground/80 hover:text-primary font-medium transition-colors relative group text-sm uppercase tracking-wider">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </nav>

          <Link to="/login" className="p-2 text-foreground/80 hover:text-primary transition-colors" aria-label="Tài khoản">
            <User className="w-5 h-5" />
          </Link>

          <button className="p-2 text-foreground/80 hover:text-primary transition-colors relative group" aria-label="Giỏ hàng">
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">3</span>
          </button>

          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(true)} aria-label="Mở menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed top-0 right-0 bottom-0 w-3/4 sm:w-1/2 bg-background z-50 p-6 flex flex-col shadow-2xl md:hidden">
              <div className="flex justify-end mb-8">
                <button onClick={() => setMobileMenuOpen(false)} className="p-2" aria-label="Đóng menu">
                  <X className="w-6 h-6 text-foreground/70 hover:text-primary" />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link key={link.name} onClick={() => setMobileMenuOpen(false)} to={link.to} className="text-xl font-medium text-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-4">
                <button className="w-full py-3 flex items-center justify-center gap-2 border border-border rounded-full hover:bg-muted transition-colors">
                  <Search className="w-5 h-5" />
                  <span>Tìm kiếm</span>
                </button>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 flex items-center justify-center gap-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-md">
                  <User className="w-5 h-5" />
                  <span>Tài khoản</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
