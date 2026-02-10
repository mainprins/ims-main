import React, { useEffect, useState } from "react";
import axios from "axios";
import { getSuppliers, createSupplier } from "../services/supplierService";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSupplier(formData);
    console.log(formData);
    fetchSuppliers();
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  return (
    <div>
      <h2>Supplier Page</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
        <button type="submit">Add Supplier</button>
      </form>

      <hr />

      <ul>
        {suppliers.map((s) => (
          <li key={s._id}>{s.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierPage;
