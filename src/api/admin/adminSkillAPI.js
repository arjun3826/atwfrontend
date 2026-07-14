import axiosInstance from "../axiosInstance";

// Get skills by designation ID with pagination, search, status filter
export const getSkillsByDesignationAPI = async (designationId, { page = 1, limit = 10, search = "", status = "" } = {}) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (status) params.status = status;
  const response = await axiosInstance.get(`/admin/skills-by-designation/${designationId}`, { params });
  return response.data;
};

// Get a single skill by ID
export const getSkillByIdAPI = async (skillId) => {
  const response = await axiosInstance.get(`/admin/skills/${skillId}`);
  return response.data;
};

// Add a new skill
export const addSkillAPI = async (payload) => {
  // payload: { name, designation_id, status (optional) }
  const response = await axiosInstance.post(`/admin/skills`, payload);
  return response.data;
};

// Update a skill
export const updateSkillAPI = async (skillId, payload) => {
  const response = await axiosInstance.put(`/admin/skills/${skillId}`, payload);
  return response.data;
};

// Delete a skill
export const deleteSkillAPI = async (skillId) => {
  const response = await axiosInstance.delete(`/admin/skills/${skillId}`);
  return response.data;
};

// Toggle skill status
export const toggleSkillStatusAPI = async (skillId) => {
  const response = await axiosInstance.post(`/admin/skills-toggle-status/${skillId}`);
  return response.data;
};