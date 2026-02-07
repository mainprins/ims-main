import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Package, 
  ShieldCheck, 
  Loader2,
  ChevronRight
} from "lucide-react";

const Auth = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for toggling between Login and Register
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    
    try {
      const res = await API.post(endpoint, formData);
      
      if (isLogin) {
        // Handle Login Success
        login(res.data.user, res.data.token);
        navigate("/");
      } else {
        // Handle Register Success - Switch to login mode
        setIsLogin(true);
        alert("Account created! Please log in.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Branding/Visual (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-indigo-600 p-12 flex-col justify-between text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Package size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Package size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">IMS Pro</span>
            </div>
            
            <h2 className="text-4xl font-black leading-tight mb-6">
              Precision <br /> 
              Inventory <br /> 
              Management.
            </h2>
            <p className="text-indigo-100 text-lg">
              Streamline your warehouse operations with real-time analytics and automated procurement.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-sm text-indigo-200 font-medium">
            <div className="flex items-center gap-1">
              <ShieldCheck size={16} /> 
              Enterprise Secure
            </div>
            <div className="w-1 h-1 bg-indigo-400 rounded-full" />
            <span>v2.0.4</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin 
                ? "Enter your credentials to access your dashboard" 
                : "Join ImsPro to start managing your warehouse"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 bg-rose-600 rounded-full" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                {isLogin && <button type="button" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Register"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-600 font-bold hover:underline inline-flex items-center gap-1 group"
              >
                {isLogin ? "Create one" : "Sign in instead"}
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;