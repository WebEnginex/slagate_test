import * as React from "react";
import SideNav from "./SideNav";
import { Menu } from "lucide-react";
import Footer from "./Footer";

type LayoutProps = {
  children: React.ReactNode;
  hideFooter?: boolean;
};

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <SideNav isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Structure verticale pour main + footer */}
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex-1 overflow-auto relative lg:ml-64">
          <button
            className="fixed top-4 left-4 z-30 rounded-md bg-sidebar p-2 text-white lg:hidden"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu size={24} />
          </button>          <div className="container mx-auto py-8 px-4 lg:px-8">
            {children}
          </div>
          
          
        </main>

        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
