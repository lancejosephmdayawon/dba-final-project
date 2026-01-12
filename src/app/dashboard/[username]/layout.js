import HeaderBar from "@/components/HeaderBar";
import SidebarWrapper from "@/components/SidebarWrapper";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar stays in place */}
      <aside className="sticky top-0 h-screen">
        <SidebarWrapper />
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header sticks, still takes space */}
        <header className="sticky top-0 z-20 bg-white">
          <HeaderBar />
        </header>

        {/* Main content scrolls */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-blue-300 to-blue-500">
          {children}
        </main>
      </div>
    </div>
  );
}
