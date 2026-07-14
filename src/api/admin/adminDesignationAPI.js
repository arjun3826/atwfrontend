import axiosInstance from "../axiosInstance";

// Get designations by industry with pagination, search, status filter
export const getDesignationsByIndustryAPI = async (industryId, { page = 1, limit = 10, search = "", status = "" } = {}) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (status) params.status = status;
  const response = await axiosInstance.get(`/admin/designations-by-industry/${industryId}`, { params });
  return response.data;
};

// Get a single designation by ID (for editing)
export const getDesignationByIdAPI = async (designationId) => {
  const response = await axiosInstance.get(`/admin/designations/${designationId}`);
  return response.data;
};

// Add a new designation to an industry
export const addDesignationAPI = async (payload) => {
  // payload: { name, description, status } (status optional, defaults to active)
  const response = await axiosInstance.post(`/admin/designations`, payload);
  return response.data;
};

// Update a designation
export const updateDesignationAPI = async (designationId, payload) => {
  const response = await axiosInstance.put(`/admin/designations/${designationId}`, payload);
  return response.data;
};

// Delete a designation
export const deleteDesignationAPI = async (designationId) => {
  const response = await axiosInstance.delete(`/admin/designations/${designationId}`);
  return response.data;
};

// Toggle designation status (active/inactive)
export const toggleDesignationStatusAPI = async (designationId) => {
  const response = await axiosInstance.post(`/admin/designations-toggle-status/${designationId}`);
  return response.data;
};