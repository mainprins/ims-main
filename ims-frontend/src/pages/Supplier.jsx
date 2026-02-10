import React, { useEffect, useState } from "react";
// import { getSuppliers, createSupplier } from "../services/supplierService";

const SupplierPage = () => {
  // Store supplier list
  const [suppliers, setSuppliers] = useState([]);

  // Store form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Fetch suppliers when page loads
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error.message);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createSupplier(formData);
      fetchSuppliers(); // refresh list after adding
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      console.error("Error creating supplier:", error.message);
    }
  };

  return (
    <div>
      <h2>Supplier Page</h2>

      {/* Supplier Form */}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <button type="submit">Add Supplier</button>
      </form>

      <hr />

      {/* Supplier List */}
      <ul>
        {suppliers.map((supplier) => (
          <li key={supplier._id}>
            {supplier.name} - {supplier.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierPage;
