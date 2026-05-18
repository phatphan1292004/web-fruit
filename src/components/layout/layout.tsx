import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '../../lib/utils';

type LayoutProps = {
  children: ReactNode;
  mainClassName?: string;
};

const Layout = ({ children, mainClassName }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={cn('flex-1 w-full', mainClassName)}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
