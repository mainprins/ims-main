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
