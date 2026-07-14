import { useEffect, useState } from "react";
import {
  getWorkerProfileAPI,
  updateWorkerProfileAPI,
  changeWorkerPasswordAPI,
  getDepartmentsAPI,
  getDesignationsAPI,
  getIndustriesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
  getWorkerDocumentsAPI,
  verifyBankAccountAPI,
} from "../../../api/worker/workerAPI";
import Swal from "sweetalert2";

export const useWorkerProfile = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    work_email: "",
    mobile_number: "",
    gender: "",
    work_location: "",
    industry: "",
    industry_id: "",
    designation: "",
    designation_id: "",
    department: "",
    department_id: "",
    work_experience: "",
    dress_size: "",
    bonus_frequency: "",
    epf_enabled: true,
    uan_number: "",
    esi_enabled: true,
    esic_number: "",
    date_of_birth: "",
    father_name: "",
    pan_number: "",
    aadhaar_number: "",
    residential_address: "",
    state: "",
    state_id: "",
    city: "",
    city_id: "",
    zip: "",
    current_state: "",
    current_state_id: "",
    current_city: "",
    current_city_id: "",
    current_address: "",
    payment_method: "",
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    confirm_account_number: "",
    ifsc_code: "",
    account_type: "",
    photo: "",
    worker_id: "",
    working_address: "",
    working_zip: "",
    bank_accounts: [],
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [documentData, setDocumentData] = useState({
    document_type: "",
    document_number: "",
    document_file: null,
    issue_date: "",
    expiry_date: "",
  });

  const [industries, setIndustries] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [documentErrors, setDocumentErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");
  const [currentCities, setCurrentCities] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);
  const [isBankVerified, setIsBankVerified] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [initialBankDetails, setInitialBankDetails] = useState({
    account_number: "",
    ifsc_code: "",
  });

  // Update account_holder_name when name fields change
  useEffect(() => {
    const fullName = [
      formData.first_name,
      formData.middle_name,
      formData.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    setFormData((prev) => ({
      ...prev,
      account_holder_name: fullName,
    }));
  }, [formData.first_name, formData.middle_name, formData.last_name]);

  // ===================== PHOTO HANDLER =====================
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photo: "Only JPG, PNG, and GIF files are allowed",
        }));
        return;
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: "File size must be less than 2MB",
        }));
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ===================== UPDATE PROFILE =====================
  const updateProfile = async () => {
    setLoading(true);
    try {
      // Validation
      const newErrors = {};
      // if (!formData.uan_number) {
      //   newErrors.uan_number = "UAN Number is required";
      // } else if (formData.uan_number.length !== 12) {
      //   newErrors.uan_number = "UAN Number must be 12 digits";
      // }

      // if (!formData.esic_number) {
      //   newErrors.esic_number = "ESIC Number is required";
      // }

      // if (formData.payment_method === 'bank' && !isBankVerified) {
      //   newErrors.bank_verification = "Please verify your bank account first.";
      //   Swal.fire({
      //     icon: "error",
      //     title: "Verification Required",
      //     text: "Please verify your bank account details before updating your profile.",
      //   });
      //   setErrors(newErrors);
      //   return false;
      // }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }

      const data = new FormData();

      // Prepare a copy of formData for conversion
      const payload = { ...formData };

      // Convert boolean fields to integers (0/1)
      const booleanFields = ["epf_enabled", "esi_enabled"];
      booleanFields.forEach((field) => {
        if (payload[field] !== undefined && payload[field] !== null) {
          payload[field] = payload[field] ? 1 : 0;
        }
      });

      // Convert numeric fields to numbers
      const numericFields = ["work_experience", "number_of_workers"]; // add more if needed
      numericFields.forEach((field) => {
        if (payload[field] && !isNaN(payload[field])) {
          payload[field] = Number(payload[field]);
        }
      });

      // Append all fields except 'photo'
      Object.keys(payload).forEach((key) => {
        if (
          key !== "photo" &&
          payload[key] !== undefined &&
          payload[key] !== null &&
          payload[key] !== ""
        ) {
          data.append(key, payload[key]);
        }
      });

      data.append("is_bank_verified", isBankVerified ? 1 : 0);

      // If a new photo file was selected, append it
      if (photoFile) {
        data.append("photo", photoFile);
      }

      const response = await updateWorkerProfileAPI(data);
      if (response.status === 200) {
        setSuccessMsg("Profile updated successfully");
        await fetchWorkerProfile();
        return true;
      } else {
        // setErrors(response.data?.errors || { general: "Update failed" });
        // return false;
        const apiErrors = response.data?.errors || {};

        // convert array → string
        const formattedErrors = {};
        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = Array.isArray(apiErrors[key])
            ? apiErrors[key][0]
            : apiErrors[key];
        });

        setErrors(formattedErrors);

        // optional fallback message
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          html:
            response.data?.message ||
            Object.values(formattedErrors).join("<br/>") ||
            "Validation failed",
        });

        return false;
      }
    } catch (error) {
      console.error("Update profile error:", error);

      const apiErrors = error?.response?.data?.errors || {};

      const formattedErrors = {};
      Object.keys(apiErrors).forEach((key) => {
        formattedErrors[key] = Array.isArray(apiErrors[key])
          ? apiErrors[key][0]
          : apiErrors[key];
      });

      setErrors(formattedErrors);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        html:
          Object.values(formattedErrors).join("<br/>") ||
          error?.response?.data?.message ||
          "An error occurred while updating profile",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };
  const changePassword = async () => {
    setLoading(true);
    try {
      const { current_password, new_password, confirm_password } = passwordData;
      // Basic validation
      if (!current_password || !new_password || !confirm_password) {
        setPasswordErrors({ general: "All password fields are required" });
        return false;
      }
      if (new_password !== confirm_password) {
        setPasswordErrors({ confirm_password: "Passwords do not match" });
        return false;
      }
      const response = await changeWorkerPasswordAPI({
        current_password,
        new_password,
      });
      if (response.status === 200) {
        setPasswordSuccessMsg("Password changed successfully");
        // Clear password fields
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        return true;
      } else {
        setPasswordErrors(
          response.data?.errors || { general: "Password change failed" },
        );
        return false;
      }
    } catch (error) {
      console.error("Change password error:", error);
      setPasswordErrors({
        general: "An error occurred while changing password",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyBankAccount = async () => {
    if (!formData.account_number || !formData.ifsc_code) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please enter Account Number and IFSC code first.",
      });
      return;
    }

    setVerifyingBank(true);
    try {
      const response = await verifyBankAccountAPI({
        account_number: formData.account_number,
        ifsc_code: formData.ifsc_code,
        account_holder_name: formData.account_holder_name,
      });

      if (response.success) {
        setIsBankVerified(true);
        setErrors((prev) => ({ ...prev, bank_verification: "" }));
        Swal.fire({
          icon: "success",
          title: "Verified",
          text:
            (response.message || "Account verified successfully!") +
            " Please click 'Update Profile' to save the verification.",
        });
      } else {
        setIsBankVerified(false);
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text:
            response.message ||
            "The name provided does not match the bank record.",
        });
      }
    } catch (error) {
      console.error("Bank Verification Error:", error);
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text:
          error.response?.data?.message ||
          "Could not verify account. Please check details.",
      });
    } finally {
      setVerifyingBank(false);
    }
  };

  useEffect(() => {
    if (
      initialBankDetails.account_number &&
      (formData.account_number !== initialBankDetails.account_number ||
        formData.ifsc_code !== initialBankDetails.ifsc_code)
    ) {
      setIsBankVerified(false);
    }
  }, [formData.account_number, formData.ifsc_code]);

  // ===================== EXISTING FUNCTIONS (unchanged) =====================
  const fetchWorkerProfile = async () => {
    try {
      const response = await getWorkerProfileAPI();
      if (response.status === 200 && response.data) {
        const data = response.data;
        const processedData = {
          ...data,
          confirm_account_number: data.account_number || "",
          industry:
            data.industry?.name || data.industry_name || data.industry || "",
          industry_id: data.industry_id || data.industry?.id || "",
          designation:
            data.designation?.name ||
            data.designation_name ||
            data.designation ||
            "",
          designation_id: data.designation_id || data.designation?.id || "",
          department:
            data.department?.name ||
            data.department_name ||
            data.department ||
            "",
          department_id: data.department_id || data.department?.id || "",
        };
        setFormData(processedData);
        setPhotoPreview(data.photo || "");
        setInitialBankDetails({
          account_number: data.account_number || "",
          ifsc_code: data.ifsc_code || "",
        });
        setIsBankVerified(!!data.is_bank_verified);
        if (processedData.state_id) {
          await fetchCitiesByState(processedData.state_id);
        }
        if (processedData.current_state_id) {
          await fetchCurrentCitiesByState(processedData.current_state_id);
        }
      }
    } catch (error) {
      console.error("Error fetching worker profile:", error);
    }
  };

  const fetchIndustries = async () => {
    try {
      const res = await getIndustriesAPI();
      setIndustries(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await getDepartmentsAPI();
      setDepartments(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await getStatesAPI();
      setStates(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCitiesByState = async (stateId) => {
    setLoadingCities(true);
    try {
      const res = await getCitiesByStateAPI(stateId);
      setCities(res.data || []);
    } catch (error) {
      console.error(error);
    }
    setLoadingCities(false);
  };
  const fetchCurrentCitiesByState = async (stateId) => {
    try {
      const res = await getCitiesByStateAPI(stateId);
      setCurrentCities(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDocuments = async () => {
    try {
      const res = await getWorkerDocumentsAPI();
      if (res.status === 200) {
        setDocuments(res.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStateChange = async (stateId, stateName) => {
    setFormData((prev) => ({
      ...prev,
      state_id: stateId,
      state: stateName,
      city_id: "",
      city: "",
    }));
    await fetchCitiesByState(stateId);
  };

  const handleCityChange = (cityId, cityName) => {
    setFormData((prev) => ({
      ...prev,
      city_id: cityId,
      city: cityName,
    }));
  };
  const handleCurrentStateChange = async (stateId, stateName) => {
    setFormData((prev) => ({
      ...prev,
      current_state_id: stateId,
      current_state: stateName,
      current_city_id: "",
      current_city: "",
    }));

    await fetchCurrentCitiesByState(stateId);
  };

  const handleCurrentCityChange = (cityId, cityName) => {
    setFormData((prev) => ({
      ...prev,
      current_city_id: cityId,
      current_city: cityName,
    }));
  };
  // ===================== MAP STRING NAMES TO IDs =====================
  useEffect(() => {
    if (formData.industry && industries.length > 0 && !formData.industry_id) {
      const found = industries.find((i) => i.name === formData.industry);
      if (found) {
        setFormData((prev) => ({ ...prev, industry_id: found.id }));
      }
    }
  }, [formData.industry, industries]);

  useEffect(() => {
    if (
      formData.designation &&
      designations.length > 0 &&
      !formData.designation_id
    ) {
      const found = designations.find((d) => d.name === formData.designation);
      if (found) {
        setFormData((prev) => ({ ...prev, designation_id: found.id }));
      }
    }
  }, [formData.designation, designations]);

  useEffect(() => {
    if (
      formData.department &&
      departments.length > 0 &&
      !formData.department_id
    ) {
      const found = departments.find((d) => d.name === formData.department);
      if (found) {
        setFormData((prev) => ({ ...prev, department_id: found.id }));
      }
    }
  }, [formData.department, departments]);

  useEffect(() => {
    const initialize = async () => {
      setFormLoading(true);
      try {
        await Promise.all([
          fetchWorkerProfile(),
          fetchIndustries(),
          fetchDepartments(),
          fetchStates(),
          fetchDocuments(),
        ]);
      } catch (error) {
        console.error("Error initializing:", error);
      }
      setFormLoading(false);
    };
    initialize();
  }, []);

  // Fetch designations when industry changes
  useEffect(() => {
    const fetchDesignationsByIndustry = async () => {
      if (!formData.industry_id) {
        setDesignations([]);
        return;
      }
      try {
        const response = await getDesignationsAPI(formData.industry_id);
        const list = response?.data?.data?.data || response?.data?.data || [];
        setDesignations(list);
      } catch (error) {
        console.error("Error fetching designations:", error);
        setDesignations([]);
      }
    };
    fetchDesignationsByIndustry();
  }, [formData.industry_id]);

  return {
    formData,
    setFormData,
    passwordData,
    setPasswordData,
    documentData,
    setDocumentData,
    errors,
    passwordErrors,
    documentErrors,
    loading,
    formLoading,
    successMsg,
    passwordSuccessMsg,
    industries,
    designations,
    departments,
    states,
    cities,
    currentCities,
    handleCurrentStateChange,
    handleCurrentCityChange,
    fetchCurrentCitiesByState,
    documents,
    photoPreview,
    photoFile,
    loadingCities,
    handleStateChange,
    handleCityChange,
    setErrors,
    setPasswordErrors,
    setDocumentErrors,
    setSuccessMsg,
    setPasswordSuccessMsg,
    fetchCitiesByState,
    handlePhotoChange, // ✅ NEW
    updateProfile, // ✅ NEW
    changePassword, // ✅ NEW
    verifyBankAccount,
    isBankVerified,
    verifyingBank,
  };
};
