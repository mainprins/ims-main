import API from "../api/axios";

// Get all suppliers
export const getSuppliers = async () => {
  try {
    const response = await API.get("/suppliers");
    return response.data;
  } catch (err) {
    console.error("getSuppliers error", err?.response || err.message || err);
    throw err;
  }
};

// Create a supplier
export const createSupplier = async (supplierData) => {
  try {
    const response = await API.post("/suppliers", supplierData);
    return response.data;
  } catch (err) {
    console.error("createSupplier error", err?.response || err.message || err);
    throw err;
  }
};

// Update a supplier
export const updateSupplier = async (id, supplierData) => {
  try {
    const response = await API.put(`/suppliers/${id}`, supplierData);
    return response.data;
  } catch (err) {
    console.error("updateSupplier error", err?.response || err.message || err);
    throw err;
  }
};

// Delete a supplier
export const deleteSupplier = async (id) => {
  try {
    const response = await API.delete(`/suppliers/${id}`);
    return response.data;
  } catch (err) {
    console.error("deleteSupplier error", err?.response || err.message || err);
    throw err;
  }
};
