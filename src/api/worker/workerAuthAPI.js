import axiosInstance from "../axiosInstance";

export const workerLoginAPI = async (mobile_number) => {
  const response = await axiosInstance.post("/worker/login", {
    mobile_number,
  });

  return response.data;
};

export const verifyWorkerOtpAPI = async (mobile_number, otp) => {
  const response = await axiosInstance.post("/worker/verifyOtp", {
    mobile_number,
    otp,
  });
  return response.data;
};

export const sendAadhaarOtpAPI = async (aadhaar_number) => {
  const response = await axiosInstance.post(
    "/worker/sendAadhaarOtp",
    {
      aadhaar_number,
    }
  );
  return response.data;
};

export const verifyAadhaarOtpAPI = async (
  otp,
  reference_id
) => {
  try {
    const response = await axiosInstance.post(
    "/worker/verifyAadhaarOtp",
    {
      otp,
      reference_id,
    }
  );
  return response.data;
  } catch (error) {
    return (
            error.response?.data || {
                success: false,
                message: "Verification failed",
            }
        );
  }
};

export const resendAadhaarOtpAPI = async (aadhaarNumber) => {
  const response = await axiosInstance.post(
    "/worker/aadhaar/resend-otp",
    {
      aadhaar_number: aadhaarNumber,
    }
  );
  return response.data;
};

export const registerWorker = async (data) => {
  const response = await axiosInstance.post("/worker/register", data);
  return response.data;
};

// export const getWorkerProfileData = async () => {
//   const response = await axiosInstance.get("/worker/worker-profile");
//   return response.data;
// };

export const updateWorkerProfile = async (data) => {
  const response = await axiosInstance.post("/worker/worker-Profile", data);
  return response.data;
};

export const getDepartmentsAPI = async () => {
  const response = await axiosInstance.get("/get-departments");
  return response.data;
};

export const getDesignationsAPI = (industryId) => {
  return axiosInstance.get(`/designations-by-industry/${industryId}`);
};
// Get industries
export const getIndustriesAPI = async () => {
  const response = await axiosInstance.get("/get-industries");
  return response.data;
};

// Get states
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

//Get Skills
export const getSkillsByDesignationAPI = async (designationId) => {
  const response = await axiosInstance.get(
    `/skills-by-designation/${designationId}`,
    {
      params: { status: 1 },
    },
  );
  return response.data;
};
export const workerLogoutAPI = () => {
  return axiosInstance.get("/worker/logout");
};
