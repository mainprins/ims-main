import { useEffect, useState } from "react";
import API from "../api/axios";
import { 
  BarChart3, 
  TrendingDown, 
  ShoppingCart, 
  TrendingUp, 
  Download, 
  Calendar,
  User,
  Package,
  ArrowRight
} from "lucide-react";

const Reports = () => {
  const [lowStock, setLowStock] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("low-stock");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [lowStockRes, purchasesRes, salesRes] = await Promise.all([
        API.get("/reports/low-stock"),
        API.get("/reports/purchases"),
        API.get("/reports/sales"),
      ]);
      setLowStock(lowStockRes.data);
      setPurchases(purchasesRes.data);
      setSales(salesRes.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPurchaseValue = purchases.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalSalesValue = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium tracking-wide">Generating Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <BarChart3 className="text-indigo-600" />
            Analytics & Reports
          </h2>
          <p className="text-slate-500 text-sm">Review your business performance and inventory health.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
          <Download size={16} />
          Export PDF
        </button>
      </header>

      {/* Summary Mini-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard label="Low Stock Items" value={lowStock.length} icon={TrendingDown} color="rose" />
        <SummaryCard label="Total Procurement" value={`$${totalPurchaseValue.toLocaleString()}`} icon={ShoppingCart} color="indigo" />
        <SummaryCard label="Total Revenue" value={`$${totalSalesValue.toLocaleString()}`} icon={TrendingUp} color="emerald" />
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 p-2 bg-slate-50/50">
          <TabButton 
            active={activeTab === "low-stock"} 
            onClick={() => setActiveTab("low-stock")} 
            label="Inventory Alerts" 
            count={lowStock.length}
          />
          <TabButton 
            active={activeTab === "purchases"} 
            onClick={() => setActiveTab("purchases")} 
            label="Purchase History" 
          />
          <TabButton 
            active={activeTab === "sales"} 
            onClick={() => setActiveTab("sales")} 
            label="Sales Records" 
          />
        </div>

        <div className="p-0">
          {activeTab === "low-stock" && (
            <ReportTable 
              headers={["Product", "SKU", "In Stock", "Threshold"]}
              data={lowStock}
              renderRow={(p) => (
                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{p.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-6 py-4"><span className="text-rose-600 font-bold">{p.quantity}</span></td>
                  <td className="px-6 py-4 text-slate-400">{p.minStockLevel} units</td>
                </tr>
              )}
              emptyMessage="No low stock alerts. Your inventory is healthy!"
            />
          )}

          {activeTab === "purchases" && (
            <ReportTable 
              headers={["Supplier", "Items", "Amount", "Date"]}
              data={purchases}
              renderRow={(p) => (
                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><User size={14}/></div>
                      <span className="font-semibold text-slate-700">{p.supplier?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{p.items.length} types</td>
                  <td className="px-6 py-4 font-bold text-slate-800">${p.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(p.createdAt).toLocaleDateString()}</div>
                  </td>
                </tr>
              )}
            />
          )}

          {activeTab === "sales" && (
            <ReportTable 
              headers={["Customer", "Items", "Revenue", "Date"]}
              data={sales}
              renderRow={(s) => (
                <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">{s.customerName}</td>
                  <td className="px-6 py-4 text-slate-500">{s.items.length} items</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">${s.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(s.createdAt).toLocaleDateString()}</div>
                  </td>
                </tr>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components for Cleanliness --- */

const SummaryCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label, count }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold transition-all rounded-xl ${
      active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`text-[10px] px-2 py-0.5 rounded-full ${active ? "bg-indigo-100" : "bg-slate-200"}`}>
        {count}
      </span>
    )}
  </button>
);

const ReportTable = ({ headers, data, renderRow, emptyMessage }) => (
  <div className="overflow-x-auto">
    {data.length === 0 ? (
      <div className="p-20 text-center">
        <Package className="mx-auto text-slate-200 mb-4" size={48} />
        <p className="text-slate-500 font-medium">{emptyMessage || "No data records found."}</p>
      </div>
    ) : (
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
            {headers.map(h => <th key={h} className="px-6 py-4">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map(renderRow)}
        </tbody>
      </table>
    )}
  </div>
);

export default Reports;