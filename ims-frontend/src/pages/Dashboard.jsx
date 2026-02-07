import { useEffect, useState } from "react";
import API from "../api/axios";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight,
  Search,
  ArrowRight
} from "lucide-react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data separately
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    const fetchPurchases = async () => {
      try {
        const res = await API.get("/purchases");
        setPurchases(res.data);
      } catch (err) {
        console.warn("Purchases route may not be ready", err);
      }
    };

    const fetchSales = async () => {
      try {
        const res = await API.get("/sales");
        setSales(res.data);
      } catch (err) {
        console.warn("Sales route may not be ready", err);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchPurchases(), fetchSales()]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const lowStockProducts = products.filter(p => p.quantity <= p.minStockLevel);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Syncing Inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back! Here's your inventory status.</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={products.length} icon={Package} color="indigo" />
        <StatCard title="Purchases" value={purchases.length} icon={ShoppingCart} color="slate" />
        <StatCard title="Sales Volume" value={sales.length} icon={TrendingUp} color="emerald" />
        <StatCard 
          title="Low Stock" 
          value={lowStockProducts.length} 
          icon={AlertCircle} 
          color={lowStockProducts.length > 0 ? "rose" : "emerald"} 
          alert={lowStockProducts.length > 0} 
        />
      </div>

      {/* Low Stock Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${lowStockProducts.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {lowStockProducts.length > 0 ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <h2 className="text-lg font-bold text-slate-800">Critical Stock Alerts</h2>
          </div>
          
          
        </div>

        <div className="overflow-x-auto">
          {lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Perfectly Stocked</h3>
              <p className="text-slate-500 text-sm max-w-xs text-center mt-1">
                All items are above minimum threshold.
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                  <th className="px-8 py-4">Product Details</th>
                  <th className="px-8 py-4">SKU Code</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4 text-center">Current</th>
                  <th className="px-8 py-4 text-right">Min Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lowStockProducts.map((p) => (
                  <tr key={p._id} className="group hover:bg-slate-50/80 transition-all cursor-default">
                    <td className="px-8 py-4 font-semibold text-slate-700">{p.name}</td>
                    <td className="px-8 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono">{p.sku}</span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                        Critically Low
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">{p.quantity}</td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400 font-medium">
                        <span>Threshold: {p.minStockLevel}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

/* ---------- Stat Card ---------- */
const StatCard = ({ title, value, icon: Icon, color, alert, trend }) => {
  const colorMap = {
    indigo: "bg-indigo-600 text-white shadow-indigo-100",
    emerald: "bg-emerald-600 text-white shadow-emerald-100",
    rose: "bg-rose-600 text-white shadow-rose-100 animate-pulse",
    slate: "bg-slate-800 text-white shadow-slate-100",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <Icon className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 group-hover:text-slate-100 transition-colors" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
            <Icon size={20} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight size={12} />
              {trend}
            </div>
          )}
        </div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
        {alert && (
          <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-full rounded-full bg-rose-500 transition-all duration-1000 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
