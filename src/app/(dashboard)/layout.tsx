import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full">
      {/* Navbar */}
      <div className="fixed inset-y-0 z-50 h-20 w-full">
        <Navbar />
      </div>

      {/* SideBar */}
      <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col  md:flex">
        <Sidebar />
      </div>

      {/* Main Contant */}
      <main className="h-full pt-20 md:pl-56">{children}</main>
    </div>
  );
}
