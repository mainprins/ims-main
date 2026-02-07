import { useState, useEffect } from "react";
import API from "../api/axios";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Tag, 
  DollarSign, 
  Layers, 
  AlertCircle,
  X
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    quantity: "",
    minStockLevel: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", form);
      setForm({ name: "", sku: "", category: "", price: "", quantity: "", minStockLevel: "" });
      setIsModalOpen(false); // Close modal on success
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Product Inventory</h2>
          <p className="text-slate-500 text-sm">Manage your stock items and warehouse levels.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-400 animate-pulse">Loading items...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4 text-center">Stock Status</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase">{p.category || 'General'}</span>
                            <span className="text-[11px] text-slate-400 font-mono font-medium">{p.sku}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                           <div 
                            className={`h-full rounded-full ${p.quantity <= p.minStockLevel ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min((p.quantity / (p.minStockLevel * 2)) * 100, 100)}%` }}
                           />
                        </div>
                        <span className={`text-xs font-bold ${p.quantity <= p.minStockLevel ? 'text-rose-600' : 'text-slate-600'}`}>
                          {p.quantity} in stock
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700">${Number(p.price).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800">New Product Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Product Name</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input name="name" placeholder="E.g. Wireless Mouse" value={form.name} onChange={handleChange} required
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">SKU</label>
                  <input name="sku" placeholder="SKU-001" value={form.sku} onChange={handleChange} required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input name="category" placeholder="Electronics" value={form.category} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="number" name="price" placeholder="0.00" value={form.price} onChange={handleChange} required
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Initial Qty</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="number" name="quantity" placeholder="0" value={form.quantity} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm" />
                  </div>
                </div>

                <div className="col-span-2 space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
                    <AlertCircle size={12} className="text-amber-500" />
                    Minimum Stock Alert Level
                   </label>
                   <input type="number" name="minStockLevel" placeholder="Alert when stock hits this number" value={form.minStockLevel} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm bg-amber-50/30 border-dashed" />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all">
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;