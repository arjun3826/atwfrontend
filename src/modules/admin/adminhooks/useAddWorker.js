import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  addWorkerAPI,
  getDesignationsAPI,
  addDesignationAPI,
  getIndustriesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
  getStaffListAPI,
  getAgentsAPI,
  verifyBankAccountAPI,
  getSkillsByDesignation,
} from "../../../api/admin/adminWorkerAPI";
import { getSalaryInitAPI } from "../../../api/admin/adminSalaryStructureAPI";
import { calculateSalaryResults } from "../utils/salaryCalculationUtils";

// Validation patterns
const phonePattern = /^[6-9]\d{9}$/;

export const useAddWorker = () => {
  const navigate = useNavigate();

  // Initial form state
  const initialFormData = {
    // Basic Details
    first_name: "",
    middle_name: "",
    last_name: "",
    work_email: "",
    mobile_number: "",
    gender: "",
    work_location: "",

    // Industry & Designation
    industry: "",
    industry_id: "",
    designation: "",
    designation_id: "",
    skills: [],
    new_designation: "",
    dress_size: "",
    staff_code: "",
    agent_code: "",
    // EPF/ESI/Bonus
    work_experience: "",
    uan_number: "",
    esic_number: "",
    is_pf_applicable: true,
    is_esi_applicable: true,
    pf_upper_cap: "15000",
    esi_upper_cap: "21000",
    bonus_frequency: "",

    // Personal Details
    date_of_birth: "",
    father_name: "",
    pan_number: "",
    aadhar_number: "",
    residential_address: "",
    state_id: "",
    city_id: "",
    zip: "",

    // Working Address
    current_state: "",
    current_state_id: "",
    current_city: "",
    current_city_id: "",
    working_address: "",
    working_zip: "",

    // Payment Information
    payment_method: "bank",
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    account_type: "",

    // Salary Structure - Specific for worker
    define_salary_structure: false,
    salary_earnings: [],
  };

  // State management
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isBankVerified, setIsBankVerified] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);

  // Dropdown data
  const [industries, setIndustries] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);

  // Working address dropdown data
  const [workingCities, setWorkingCities] = useState([]);
  const [filteredWorkingCities, setFilteredWorkingCities] = useState([]);
  const [loadingWorkingCities, setLoadingWorkingCities] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Filtered dropdown data
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Loading states
  const [loadingCities, setLoadingCities] = useState(false);
  const [designationsLoading, setDesignationsLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  // Salary Structure States
  const [workingDays, setWorkingDays] = useState(26);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [earningComponents, setEarningComponents] = useState([]);
  const [deductionComponents, setDeductionComponents] = useState([]);
  const [complianceRules, setComplianceRules] = useState([]);
  const [earningValues, setEarningValues] = useState({});
  const [calculationResults, setCalculationResults] = useState(null);
  const [initialSalaryLoading, setInitialSalaryLoading] = useState(true);

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

  // Fetch all dropdown data on mount (departments removed)
  useEffect(() => {
    const fetchAllData = async () => {
      setFormLoading(true);
      try {
        const [indRes, stateRes, staffRes, agentRes, salaryRes] =
          await Promise.all([
            getIndustriesAPI(),
            getStatesAPI(),
            getStaffListAPI(),
            getAgentsAPI(),
            getSalaryInitAPI(),
          ]);
        let indData = [];
        if (indRes?.data?.data && Array.isArray(indRes.data.data))
          indData = indRes.data.data;
        else if (indRes?.data && Array.isArray(indRes.data))
          indData = indRes.data;
        else if (Array.isArray(indRes)) indData = indRes;
        setIndustries(indData);
        setFilteredIndustries(indData);

        let stateData = [];
        if (stateRes?.data?.data && Array.isArray(stateRes.data.data))
          stateData = stateRes.data.data;
        else if (stateRes?.data && Array.isArray(stateRes.data))
          stateData = stateRes.data;
        else if (Array.isArray(stateRes)) stateData = stateRes;
        setStates(stateData);
        setFilteredStates(stateData);

        // Process staff list
        let staffData = [];
        if (staffRes?.data?.data && Array.isArray(staffRes.data.data))
          staffData = staffRes.data.data;
        else if (staffRes?.data && Array.isArray(staffRes.data))
          staffData = staffRes.data;
        else if (Array.isArray(staffRes)) staffData = staffRes;
        setStaffList(staffData);
        setFilteredStaffList(staffData);
        let agentData = [];

        if (agentRes?.data && Array.isArray(agentRes.data))
          agentData = agentRes.data;
        else if (Array.isArray(agentRes)) agentData = agentRes;

        setAgents(agentData);
        setFilteredAgents(agentData);
        const salaryData = salaryRes?.data || {};
        const baselineDays = parseInt(salaryData.baseline_working_days) || 26;
        const stdHours = parseInt(salaryData.standard_hours_per_day) || 8;
        setWorkingDays(baselineDays);
        setHoursPerDay(stdHours);

        setEarningComponents(salaryData.earning_components || []);
        setComplianceRules(salaryData.compliance_rules || []);

        // Load default deduction components as fallback
        if (salaryData.deduction_components) {
          const mappedDefaults = salaryData.deduction_components.map(
            (comp) => ({
              deduction_component: comp,
              value: parseFloat(comp.value) || 0,
            }),
          );
          setDeductionComponents(mappedDefaults);
        }

        const initialValues = {};
        (salaryData.earning_components || []).forEach((comp) => {
          initialValues[comp.id] = "";
        });
        setEarningValues(initialValues);
        setInitialSalaryLoading(false);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
      } finally {
        setFormLoading(false);
      }
    };
    const fetchSkillsByDesignation = async () => {
      if (!formData.designation_id) {
        setSkills([]);
        setFilteredSkills([]);
        return;
      }
      setLoadingSkills(true);
      try {
        const response = await getSkillsByDesignation(formData.designation_id);
        let skillsData = [];
        if (response?.data?.data && Array.isArray(response.data.data))
          skillsData = response.data.data;
        else if (response?.data && Array.isArray(response.data))
          skillsData = response.data;
        else if (Array.isArray(response)) skillsData = response;
        setSkills(skillsData);
        setFilteredSkills(skillsData);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        setSkills([]);
        setFilteredSkills([]);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkillsByDesignation();
    fetchAllData();
  }, [formData.designation_id]);

  const fetchStaffList = async () => {
    setLoadingStaff(true);
    try {
      const response = await getStaffListAPI();
      let staffData = [];
      if (response?.data?.data && Array.isArray(response.data.data))
        staffData = response.data.data;
      else if (response?.data && Array.isArray(response.data))
        staffData = response.data;
      else if (Array.isArray(response)) staffData = response;
      setStaffList(staffData);
      setFilteredStaffList(staffData);
    } catch (error) {
      console.error("Failed to fetch staff list:", error);
    } finally {
      setLoadingStaff(false);
    }
  };

  const filterStaffList = (searchTerm) => {
    const filtered = staffList.filter((staff) =>
      staff.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredStaffList(filtered);
  };
  const filterAgents = (searchTerm) => {
    const filtered = agents.filter((agent) =>
      agent.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredAgents(filtered);
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
            " Please click 'Save Worker' to save the verification.",
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

  // Reset verification if details change
  useEffect(() => {
    setIsBankVerified(false);
  }, [formData.account_number, formData.ifsc_code]);

  useEffect(() => {
    const fetchDesignationsByIndustry = async () => {
      if (!formData.industry_id) {
        setDesignations([]);
        setFilteredDesignations([]);
        return;
      }
      setDesignationsLoading(true);
      try {
        const response = await getDesignationsAPI(formData.industry_id, {
          per_page: 1000,
        });
        const designationsArray =
          response.data?.data?.data || response.data?.data || [];
        setDesignations(designationsArray);
        setFilteredDesignations(designationsArray);
      } catch (error) {
        console.error("Failed to fetch designations:", error);
        setDesignations([]);
        setFilteredDesignations([]);
      } finally {
        setDesignationsLoading(false);
      }
    };
    fetchDesignationsByIndustry();
  }, [formData.industry_id]);

  useEffect(() => {
    if (!initialSalaryLoading && formData.define_salary_structure) {
      const results = calculateSalaryResults({
        earningComponents,
        earningValues,
        deductionComponents,
        complianceRules,
        isPfApplicable: formData.is_pf_applicable,
        isEsiApplicable: formData.is_esi_applicable,
        pfUpperCap: parseFloat(formData.pf_upper_cap) || 0,
        esiUpperCap: parseFloat(formData.esi_upper_cap) || 0,
        workingDays,
        hoursPerDay,
      });
      setCalculationResults(results);
    }
  }, [
    earningValues,
    deductionComponents,
    initialSalaryLoading,
    formData.define_salary_structure,
    earningComponents,
    complianceRules,
    formData.is_pf_applicable,
    formData.is_esi_applicable,
    formData.pf_upper_cap,
    formData.esi_upper_cap,
    workingDays,
    hoursPerDay,
  ]);

  const handleEarningValueChange = (componentId, value, factor = 1) => {
    setEarningValues((prev) => ({
      ...prev,
      [componentId]: { value, factor },
    }));
  };

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const clearError = (fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const filterIndustries = (searchTerm) => {
    setFilteredIndustries(
      industries.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  };

  const filterDesignations = (searchTerm) => {
    if (!Array.isArray(designations)) return;
    setFilteredDesignations(
      designations.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  };

  const filterStates = (searchTerm) => {
    setFilteredStates(
      states.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  };

  const filterCities = (searchTerm) => {
    setFilteredCities(
      cities.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  };

  const filterWorkingCities = (searchTerm) => {
    setFilteredWorkingCities(
      workingCities.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  };

  const fetchCitiesByState = useCallback(async (stateId) => {
    if (!stateId) {
      setCities([]);
      setFilteredCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      const response = await getCitiesByStateAPI(stateId);
      let citiesData = [];
      if (response?.data?.data && Array.isArray(response.data.data))
        citiesData = response.data.data;
      else if (response?.data && Array.isArray(response.data))
        citiesData = response.data;
      else if (Array.isArray(response)) citiesData = response;
      setCities(citiesData);
      setFilteredCities(citiesData);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const fetchWorkingCitiesByState = useCallback(async (stateId) => {
    if (!stateId) {
      setWorkingCities([]);
      setFilteredWorkingCities([]);
      return;
    }
    setLoadingWorkingCities(true);
    try {
      const response = await getCitiesByStateAPI(stateId);
      let citiesData = [];
      if (response?.data?.data && Array.isArray(response.data.data))
        citiesData = response.data.data;
      else if (response?.data && Array.isArray(response.data))
        citiesData = response.data;
      else if (Array.isArray(response)) citiesData = response;
      setWorkingCities(citiesData);
      setFilteredWorkingCities(citiesData);
    } catch (error) {
      console.error("Failed to fetch working cities:", error);
    } finally {
      setLoadingWorkingCities(false);
    }
  }, []);

  const addNewDesignation = async (designationName, industryId) => {
    const response = await addDesignationAPI({
      name: designationName,
      industry_id: industryId,
    });
    if (response.data) {
      const newDesignation = response.data;
      setDesignations((prev) => [...prev, newDesignation]);
      setFilteredDesignations((prev) => [...prev, newDesignation]);
      return newDesignation;
    }
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.first_name) newErrors.first_name = "First name is required";
    if (data.date_of_birth) {
      const today = new Date();
      const dob = new Date(data.date_of_birth);

      let age = today.getFullYear() - dob.getFullYear();

      const monthDiff = today.getMonth() - dob.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        newErrors.date_of_birth = "Worker must be at least 18 years old";
      }
    }
    if (!data.last_name) newErrors.last_name = "Last name is required";
    // if (!data.work_email) newErrors.work_email = "Personal email is required";
    if (!data.mobile_number)
      newErrors.mobile_number = "Mobile number is required";
    if (!data.gender) newErrors.gender = "Gender is required";
    if (!data.industry_id) newErrors.industry = "Industry is required";
    if (!data.designation_id && !data.new_designation)
      newErrors.designation = "Designation is required";
    if (!data.state_id) newErrors.state_id = "State is required";

    if (!data.city_id) newErrors.city_id = "City is required";
    if (
      data.mobile_number &&
      !phonePattern.test(data.mobile_number.replace(/\D/g, ""))
    ) {
      newErrors.mobile_number =
        "Mobile number must be 10 digits starting with 6-9";
    }

    return newErrors;
  };

  const prepareFormDataForAPI = (data) => {
    const apiData = {
      ...data,
      is_bank_verified: isBankVerified,
      mobile_number: data.mobile_number?.replace(/\D/g, ""),
      epf_enabled: !!data.uan_number,
      esi_enabled: !!data.esic_number,
      salary_details: data.define_salary_structure
        ? {
            earnings: earningComponents
              .filter((comp) => !comp.is_derived)
              .map((comp) => {
                const input = earningValues[comp.id];
                let value = 0;
                if (typeof input === "object" && input !== null) {
                  const val = parseFloat(input.value) || 0;
                  const factor = Number(input.factor) || 1;
                  if (factor === 1) {
                    value = val;
                  } else if (factor === 1 / 26) {
                    value = val / workingDays;
                  } else if (factor === 1 / 8) {
                    value = val * hoursPerDay;
                  } else {
                    value = val * factor;
                  }
                } else {
                  value = parseFloat(input) || 0;
                }

                return {
                  component_id: comp.id,
                  value: value,
                  priority_order: comp.priority_order,
                };
              }),
            gross_amount: calculationResults?.grossPerDay || 0,
            is_pf_applicable: data.is_pf_applicable,
            is_esi_applicable: data.is_esi_applicable,
            pf_upper_cap: data.pf_upper_cap,
            esi_upper_cap: data.esi_upper_cap,
          }
        : null,
    };
    return apiData;
  };

  const submitForm = async (formDataToSubmit) => {
    const validationErrors = validateForm(formDataToSubmit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: Object.values(validationErrors)
          .map((msg) => `• ${msg}`)
          .join("<br>"),
      });

      throw new Error("Validation failed");
    }

    setLoading(true);
    try {
      const apiData = prepareFormDataForAPI(formDataToSubmit);
      const response = await addWorkerAPI(apiData);
      if (response?.status === 500) {
        const backendErrors = response?.data || {};

        const formattedErrors = {};

        Object.keys(backendErrors).forEach((key) => {
          if (key === "status" || key === "message") return;

          formattedErrors[key] = Array.isArray(backendErrors[key])
            ? backendErrors[key][0]
            : backendErrors[key];
        });

        setErrors(formattedErrors);

        Swal.fire({
          icon: "error",
          title: response?.message,
          html: Object.values(formattedErrors)
            .map((msg) => `• ${msg}`)
            .join("<br>"),
        });

        return {
          success: false,
        };
      }
      if (response.status === 200 || response.status === 201) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to add worker");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = Array.isArray(backendErrors[key])
            ? backendErrors[key][0]
            : backendErrors[key];
        });
        setErrors(formattedErrors);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    errors,
    loading,
    formLoading,
    industries: filteredIndustries,
    designations: filteredDesignations,
    skills: filteredSkills,
    loadingSkills,
    designationsLoading,
    states: filteredStates,
    cities: filteredCities,
    loadingCities,
    workingCities: filteredWorkingCities,
    loadingWorkingCities,
    staffList: filteredStaffList,
    loadingStaff,
    earningComponents,
    earningValues,
    calculationResults,
    initialSalaryLoading,
    updateFormData,
    clearError,
    filterIndustries,
    filterDesignations,
    filterStates,
    filterCities,
    filterWorkingCities,
    filterStaffList,
    fetchCitiesByState,
    fetchWorkingCitiesByState,
    addNewDesignation,
    handleEarningValueChange,
    submitForm,
    resetForm,
    navigate,
    verifyBankAccount,
    isBankVerified,
    verifyingBank,
    agents: filteredAgents,
    filterAgents,
  };
};
