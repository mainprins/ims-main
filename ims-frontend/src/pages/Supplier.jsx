import React, { useEffect, useState } from "react";
import { getSuppliers, createSupplier } from "../services/supplierService";
import "../App.css";
import "./Supplier.css";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSuppliers();
      setSuppliers(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setError(null);
    try {
      await createSupplier(formData);
      fetchSuppliers();
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to create supplier");
    }
  };

  return (
    <div className="supplier-page">
      {error && <div className="alert" style={{ marginBottom: 12, color: "#b91c1c" }}>{error}</div>}
      <header className="supplier-header">
        <h1>Suppliers</h1>
        <div className="supplier-meta">Total: {suppliers.length}</div>
      </header>

      <section className="supplier-panel">
        <form className="supplier-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name</label>
            <input name="name" placeholder="Supplier name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input name="email" placeholder="contact@example.com" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Phone</label>
            <input name="phone" placeholder="012-345-6789" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Address</label>
            <input name="address" placeholder="Street, City, Country" value={formData.address} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={!formData.name.trim()}>
              Add Supplier
            </button>
          </div>
        </form>

        <div className="supplier-list">
          {loading ? (
            <div className="loading">Loading suppliers...</div>
          ) : suppliers.length === 0 ? (
            <div className="empty">No suppliers yet.</div>
          ) : (
            suppliers.map((s) => (
              <div className="supplier-card" key={s._id}>
                <div className="card-row card-title">{s.name}</div>
                <div className="card-row">{s.email}</div>
                <div className="card-row">{s.phone}</div>
                <div className="card-row card-address">{s.address}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default SupplierPage;
