import { Link } from "react-router-dom";
import { MoveLeft, Home, Search, PackageOpen, HelpCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Visual Metaphor */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-xl border border-slate-100 text-indigo-600 mb-4">
            <PackageOpen size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-8xl font-black text-slate-200 tracking-tighter leading-none">
            404
          </h1>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Oops! Inventory Lost
          </h2>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            The page you are looking for seems to have been misplaced or removed from our warehouse records.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <Home size={18} />
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
          >
            <MoveLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Quick Links / Help */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-200 max-w-xl mx-auto">
          <Link to="/products" className="flex flex-col items-center gap-1 group">
            <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Search size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 uppercase tracking-widest">Products</span>
          </Link>
          
          <Link to="/reports" className="flex flex-col items-center gap-1 group">
            <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <HelpCircle size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 uppercase tracking-widest">Support</span>
          </Link>

          <div className="flex flex-col items-center gap-1">
             <div className="p-3 bg-slate-100 rounded-lg text-slate-400">
              <div className="w-5 h-5 flex items-center justify-center font-bold">!</div>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status: 404</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;