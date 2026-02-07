import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Loading spinner while auth state is being checked
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role.toLowerCase())) {
    // Role is not authorized
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-600 font-bold text-lg">Access Denied</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
