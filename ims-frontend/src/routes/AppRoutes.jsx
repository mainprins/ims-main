import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Purchases from "../pages/Purchases";
import Sales from "../pages/Sales";
import Reports from "../pages/Reports";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../layouts/AppLayout";
import Supplier from "../pages/Supplier";

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/suppliers" element={<Supplier />} />

        <Route
          path="/purchases"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Purchases />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Sales />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default AppRoutes;