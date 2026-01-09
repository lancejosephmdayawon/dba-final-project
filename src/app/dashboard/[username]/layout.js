import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <HeaderBar />
        
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
