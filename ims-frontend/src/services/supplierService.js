import axios from "axios";

// Backend API URL
const API_URL = "http://localhost:5000/api/suppliers";

// Get all suppliers
export const getSuppliers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create a supplier
export const createSupplier = async (supplierData) => {
  const response = await axios.post(API_URL, supplierData);
  return response.data;
};
