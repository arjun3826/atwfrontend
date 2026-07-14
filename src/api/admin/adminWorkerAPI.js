import { param } from "framer-motion/client";
import axiosInstance from "../axiosInstance";

// Get Workers List (search + pagination)
export const getWorkersAPI = async (
  {
    page,
    limit,
    worker_name,
    worker_code,
    department,
    designation,
    industry,
    joining_date_from,
    joining_date_to,
    state,
    city,
    worker_type,
    industry_id,
    agent_id,
    staff_code,
  },
  options = {},
) => {
  const response = await axiosInstance.get("/admin/workers", {
    params: {
      page,
      limit,
      worker_name,
      worker_code,
      department,
      designation,
      state,
      city,
      worker_type,
      industry,
      joining_date_from,
      joining_date_to,
      industry_id,
      agent_id,
      staff_code,
    },
    signal: options.signal,
  });

  return response.data;
};

// Add new worker
export const addWorkerAPI = async (workerData) => {
  const response = await axiosInstance.post("/admin/add-workers", workerData);
  return response.data;
};
export const getStaffListAPI = async () => {
  const response = await axiosInstance.get("/admin/staff/all");
  return response.data;
};
// Get single worker details
export const getWorkerByIdAPI = async (id) => {
  const response = await axiosInstance.get(`/admin/get-worker/${id}`);
  return response.data;
};

// Update worker
export const updateWorkerAPI = async (id, workerData) => {
  const response = await axiosInstance.put(
    `/admin/update-worker/${id}`,
    workerData,
  );
  return response.data;
};

// Delete Worker
export const deleteWorkerAPI = async (id) => {
  const response = await axiosInstance.delete(`/admin/delete-worker/${id}`);
  return response.data;
};
export const getAgentsListAPI = async () => {
  const response = await axiosInstance.get("/admin/agents-list");
  return response.data;
};
// Toggle Worker Status
export const toggleWorkerStatusAPI = async (id, isActive) => {
  const response = await axiosInstance.post(
    `/admin/toggle-worker-status/${id}`,
  );
  return response.data;
};

// Export workers
export const exportWorkersAPI = async (filters) => {
  const response = await axiosInstance.get("/admin/export-workers", {
    param: filters,
    responseType: "blob",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

// Bulk upload workers
export const bulkUploadWorkersAPI = async (formData) => {
  const response = await axiosInstance.post(
    "/admin/workers/bulk-upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

// Designation APIs
// export const getDesignationsAPI = async (industryId) => {
//   const response = await axiosInstance.get(`/designations-by-industry/${industryId}`);
//   return response.data;
// };
export const getDesignationsAPI = async (industryId, params = {}) => {
  const response = await axiosInstance.get(
    `/designations-by-industry/${industryId}`,
    { params },
  );

  return response.data;
};
export const addDesignationAPI = async (data) => {
  const response = await axiosInstance.post("/admin/designations", data);
  return response.data;
};

// Department APIs
export const getDepartmentsAPI = async () => {
  const response = await axiosInstance.get("/get-departments");
  return response.data;
};

export const addDepartmentAPI = async (data) => {
  const response = await axiosInstance.post("/add-department", data);
  return response.data;
};

// Industry APIs
export const getIndustriesAPI = async () => {
  const response = await axiosInstance.get("/get-industries");
  return response.data;
};

// State and City APIs
export const getStatesAPI = async () => {
  const response = await axiosInstance.get("/get-states");
  return response.data;
};

export const getCitiesByStateAPI = async (state_id) => {
  const response = await axiosInstance.post("/get-cities", {
    state_id,
  });
  return response.data;
};
export const verifyBankAccountAPI = async (data) => {
  const response = await axiosInstance.post("/admin/verify-bank-account", data);
  return response.data;
};

export const getWorkerWalletSummaryAPI = async (workerId, params) => {
  const response = await axiosInstance.get(
    `/admin/worker/wallet-summary/${workerId}`,
    { params },
  );
  return response.data;
};

export const getWorkerWalletHistoryAPI = async (workerId, params) => {
  const response = await axiosInstance.get(
    `/admin/worker/wallet-history/${workerId}`,
    { params },
  );
  return response.data;
};

export const updateWorkerWalletHoldAPI = async (
  workerId,
  holdAmount,
  reason,
) => {
  const response = await axiosInstance.post(
    `/admin/worker/wallet-hold/${workerId}`,
    { hold_amount: holdAmount, reason },
  );
  return response.data;
};

export const releaseWorkerWalletHoldAPI = async (
  holdId,
  action = "release",
) => {
  const response = await axiosInstance.post(
    `/admin/worker/wallet-hold/release/${holdId}`,
    { action },
  );
  return response.data;
};
export const getSkillsByDesignation = async (designationId) => {
  const response = await axiosInstance.get(
    `/admin/skills-by-designation/${designationId}?status=1`
  );
  return response.data;
};

export const withdrawWorkerWalletAPI = async (workerId, amount) => {
  const response = await axiosInstance.post(
    `/admin/worker/wallet-withdraw/${workerId}`,
    { amount },
  );
  return response.data;
};

export const updateWorkerWalletAutoWithdrawalAPI = async (
  workerId,
  settings,
) => {
  const response = await axiosInstance.post(
    `/admin/worker/wallet-auto-withdrawal/${workerId}`,
    settings,
  );
  return response.data;
};
export const getWorkerCommentsAPI = async (workerId) => {
  const response = await axiosInstance.get(
    `/admin/worker-feedback/${workerId}`,
  );
  return response.data;
};

export const deleteWorkerCommentAPI = async (commentId) => {
  const response = await axiosInstance.delete(
    `/admin/delete-feedback/${commentId}`,
  );
  return response.data;
};
export const bulkUploadWorkers = async (formData) => {
  const response = await axiosInstance.post(
    "/admin/bulk-upload-worker",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
export const getAgentsAPI = async () => {
  const response = await axiosInstance.get("/admin/agents-list");
  return response.data;
};
