import { useEffect, useState } from "react";
import API from "../api/axios";
import { 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Truck, 
  ClipboardList, 
  Save, 
  BadgeIndianRupee, 
  PackageSearch,
  AlertCircle
} from "lucide-react";

const Purchases = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([
    { product: "", quantity: 1, costPrice: 0 },
  ]);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const fetchSuppliers = async () => {
    const res = await API.get("/suppliers");
    setSuppliers(res.data);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { product: "", quantity: 1, costPrice: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.costPrice,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplier || items.length === 0) {
      alert("Supplier and items are required");
      return;
    }
    try {
      await API.post("/purchases", {
        supplier,
        items,
        totalAmount,
      });
      alert("Purchase created successfully");
      setSupplier("");
      setItems([{ product: "", quantity: 1, costPrice: 0 }]);
    } catch (error) {
      alert(error.response?.data?.message || "Purchase failed");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
          <ShoppingCart size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Create Purchase Order</h2>
          <p className="text-slate-500 text-sm">Stock replenishment and supplier procurement.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Entry Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Supplier Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
              <Truck size={18} className="text-indigo-500" />
              <h3>Supplier Information</h3>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Supplier</label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                required
              >
                <option value="">Choose a registered supplier...</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <ClipboardList size={18} className="text-indigo-500" />
                <h3>Order Items</h3>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all"
              >
                <Plus size={14} />
                Add Row
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end group">
                    <div className="col-span-12 md:col-span-5 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">Product</label>
                      <div className="relative">
                        <PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <select
                          value={item.product}
                          onChange={(e) => handleItemChange(index, "product", e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm"
                          required
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-span-4 md:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">Qty</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm"
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-span-5 md:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">Cost Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={item.costPrice}
                          onChange={(e) => handleItemChange(index, "costPrice", Number(e.target.value))}
                          className="w-full pl-7 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-span-3 md:col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className={`p-3 rounded-xl transition-all ${
                          items.length > 1 
                          ? "text-rose-400 hover:text-rose-600 hover:bg-rose-50" 
                          : "text-slate-200 cursor-not-allowed"
                        }`}
                        disabled={items.length === 1}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-2xl p-6 text-white sticky top-24 shadow-xl shadow-indigo-100">
            <h3 className="text-lg font-bold mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
              <BadgeIndianRupee size={20} className="text-indigo-400" />
              Order Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-slate-400 text-sm font-medium">
                <span>Subtotal Items</span>
                <span className="text-white">{items.length}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm font-medium">
                <span>Tax Estimate</span>
                <span className="text-white">Included</span>
              </div>
              
              <div className="pt-4 border-t border-slate-800">
                <div className="flex justify-between items-end">
                  <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Total Amount</span>
                  <span className="text-3xl font-black">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                  <Save size={18} />
                  Complete Purchase
                </button>
                <div className="mt-4 flex items-start gap-2 p-3 bg-slate-800/50 rounded-lg">
                  <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Once saved, inventory quantities for selected products will be automatically increased.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default Purchases;