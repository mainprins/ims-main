import { Link, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  BarChart3, 
  LogOut, 
  Bell,
  User,
  ChevronRight
} from "lucide-react";

const AppLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Navigation item component
  const NavItem = ({ to, label, icon: Icon }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
        isActive(to)
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={20} className={isActive(to) ? "text-white" : "group-hover:scale-110 transition-transform"} />
      <span className="text-sm font-medium tracking-wide">{label}</span>
      {isActive(to) && (
        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/40" />
      )}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen z-20">
        {/* Brand */}
        <div className="h-20 flex items-center px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-inner">
              <Package size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight tracking-tight text-slate-800">
                IMS <span className="text-indigo-600">Pro</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inventory</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>

          <NavItem to="/" label="Dashboard" icon={LayoutDashboard} />
          <NavItem to="/products" label="Products" icon={Package} />
          <NavItem to="/purchases" label="Purchases" icon={ShoppingCart} />
          <NavItem to="/sales" label="Sales" icon={TrendingUp} />
          <NavItem to="/suppliers" label="Suppliers" icon={User} />

          {/* Reports Section: Admin / Owner only */}
          {(user?.role === "admin" || user?.role === "ADMIN") && (
            <div className="pt-6 mt-6 border-t border-slate-100">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Intelligence</p>
              <NavItem to="/reports" label="Reports" icon={BarChart3} />
            </div>
          )}
        </nav>

        {/* User Account */}
        <div className="p-4 mt-auto">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                <User size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || "User"}</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full group flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-rose-200 hover:text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 transition-all duration-200"
            >
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Logout System</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Pages</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-semibold text-slate-700 capitalize">
              {location.pathname === "/" ? "Dashboard" : location.pathname.split("/")[1]}
            </span>
          </div>

          <div className="flex items-center gap-6">


            <div className="h-8 w-[1px] bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800">Status</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase">Live Connection</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
