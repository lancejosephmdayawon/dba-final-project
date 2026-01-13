import AdminHeaderBar from "@/components/admin/AdminHeaderBar";
import AdminSidebarWrapper from "@/components/admin/AdminSidebarWrapper";

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar stays in place */}
      <aside className="sticky top-0 h-screen">
        <AdminSidebarWrapper />
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header sticks, still takes space */}
        <header className="sticky top-0 z-20 bg-white">
          <AdminHeaderBar />
        </header>

        {/* Main content scrolls */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-300 to-gray-400">
          {children}
        </main>
      </div>
    </div>
  );
}
