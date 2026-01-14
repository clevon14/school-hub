import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, GraduationCap, School, IndianRupee, CalendarCheck, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/students", icon: Users, label: "Students" },
  { to: "/teachers", icon: GraduationCap, label: "Teachers" },
  { to: "/classes", icon: School, label: "Classes" },
  { to: "/fees", icon: IndianRupee, label: "Fees" },
  { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
  { to: "/marks", icon: FileText, label: "Marks" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r bg-sidebar">
        <div className="p-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">School SMS</h1>
        </div>
        <nav className="px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors mb-1",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
