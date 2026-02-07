import { useEffect, useState } from "react";
import API from "../api/axios";
import { 
  Plus, 
  Trash2, 
  Tag, 
  User, 
  Package, 
  BadgeIndianRupee, 
  ShoppingCart, 
  Receipt,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([
    { product: "", quantity: 1, sellingPrice: 0 },
  ]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    
    // Auto-populate price if product is selected
    if (field === "product") {
      const prod = products.find(p => p._id === value);
      if (prod) updatedItems[index].sellingPrice = prod.price;
    }
    
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { product: "", quantity: 1, sellingPrice: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.sellingPrice,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/sales", {
        customerName, // Added customer name support
        items,
        totalAmount,
      });
      alert("Sale completed successfully");
      setItems([{ product: "", quantity: 1, sellingPrice: 0 }]);
      setCustomerName("");
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Sale failed");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
          <Tag size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">New Sales Order</h2>
          <p className="text-slate-500 text-sm">Generate invoices and update inventory levels.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Workspace */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <User size={18} className="text-emerald-500" />
              <h3>Client Details</h3>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                placeholder="Walk-in Customer / Client Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <ShoppingCart size={18} className="text-emerald-500" />
                <h3>Cart Items</h3>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all"
              >
                <Plus size={14} />
                Add Item
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {items.map((item, index) => {
                  const selectedProduct = products.find(p => p._id === item.product);
                  const isOverStock = selectedProduct && item.quantity > selectedProduct.quantity;

                  return (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="col-span-12 md:col-span-5 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product</label>
                        <select
                          value={item.product}
                          onChange={(e) => handleItemChange(index, "product", e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm font-medium"
                          required
                        >
                          <option value="">Choose product...</option>
                          {products.map((p) => (
                            <option key={p._id} value={p._id} disabled={p.quantity <= 0}>
                              {p.name} ({p.quantity} in stock)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          max={selectedProduct?.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                          className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all text-sm ${
                            isOverStock ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 focus:border-emerald-500'
                          }`}
                          required
                        />
                      </div>

                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                          <input
                            type="number"
                            value={item.sellingPrice}
                            onChange={(e) => handleItemChange(index, "sellingPrice", Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-span-3 md:col-span-2 text-right py-2.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subtotal</p>
                        <p className="font-bold text-slate-700">₹{(item.quantity * item.sellingPrice).toLocaleString()}</p>
                      </div>

                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {isOverStock && (
                        <div className="col-span-12 flex items-center gap-1.5 text-rose-500 text-[11px] font-bold bg-rose-50 p-2 rounded-lg">
                          <AlertCircle size={14} />
                          Not enough stock available (Max: {selectedProduct.quantity})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-3xl p-6 text-white sticky top-24 shadow-2xl shadow-emerald-900/10 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <Receipt size={20} className="text-emerald-400" />
                Checkout Summary
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>Unique Items</span>
                  <span className="text-white">{items.length}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>Tax (Included)</span>
                  <span className="text-white">0%</span>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Payable</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={items.some(item => {
                  const p = products.find(prod => prod._id === item.product);
                  return p && item.quantity > p.quantity;
                })}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <CheckCircle2 size={20} />
                Confirm Order
              </button>

              <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                    <BadgeIndianRupee size={16} />
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    By confirming, inventory will be deducted and a sales record will be generated.
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

export default Sales;