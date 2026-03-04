import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
