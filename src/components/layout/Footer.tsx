import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background pt-20 pb-10 rounded-t-[3rem] mt-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">M</div>
              <span className="text-2xl font-bold tracking-tight text-white">Morning Fruit</span>
            </a>
            <p className="text-background/70 leading-relaxed text-sm">
              Giao những loại trái cây hữu cơ cao cấp, tươi ngon nhất từ các nông trại bền vững đến tận cửa nhà bạn.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"><FaFacebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"><FaInstagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"><FaTwitter className="w-5 h-5" /></a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white">Liên kết nhanh</h4>
            <ul className="flex flex-col gap-3">
              {['Về chúng tôi', 'Mua trái cây', 'Nông trại của chúng tôi', 'Chính sách giao hàng', 'Liên hệ'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-background/70 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white">Thông tin liên hệ</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-background/70 text-sm">123 Đường Hữu Cơ, Nông Trại Xanh, CA 90210</span></li>
              <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary shrink-0" /><span className="text-background/70 text-sm">+1 (555) 123-4567</span></li>
              <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary shrink-0" /><span className="text-background/70 text-sm">hello@morningfruit.com</span></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white">Bản tin</h4>
            <p className="text-background/70 text-sm">Đăng ký để nhận ưu đãi đặc biệt, quà tặng miễn phí và các khuyến mãi mới nhất.</p>
            <div className="relative mt-2">
              <input type="email" placeholder="Nhập email của bạn" className="w-full bg-white/10 border border-white/20 rounded-full py-3.5 pl-5 pr-14 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors" />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">© {new Date().getFullYear()} Morning Fruit. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-6 text-sm text-background/50">
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
