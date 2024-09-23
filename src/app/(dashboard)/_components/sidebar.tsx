import Image from "next/image";

import { SidebarRoutes } from "./sidebarRoutes";

export const Sidebar = () => {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r bg-white">
      {/* Logo */}
      <div className="p-6">
        <Image src="/logo.png" alt="Logo" width={60} height={60} />
      </div>

      {/* Sidebar routes */}
      <div className="flex w-full flex-col">
        <SidebarRoutes />
      </div>
    </div>
  );
};
