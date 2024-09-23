import { MobileNavbar } from "./mobileNavbar";
import { NavbarRoutes } from "./navbarRoutes";

export const Navbar = () => {
  return (
    <div className="flex items-center border-b bg-white p-4 shadow-sm">
      {/* Mobile Nav */}
      <MobileNavbar />

      {/* Navbar Router */}
      <NavbarRoutes />
    </div>
  );
};
