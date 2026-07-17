import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  registerWorker,
  updateWorkerProfile,
  getDesignationsAPI,
  getIndustriesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
  sendAadhaarOtpAPI,
  resendAadhaarOtpAPI,
  verifyAadhaarOtpAPI,
  getSkillsByDesignationAPI,
} from "../../../api/worker/workerAuthAPI";
import Cookies from "js-cookie";
import { useAuthContext } from "../../../common/context/AuthContext";

// Helper to parse user cookie
const getUserFromCookie = () => {
  try {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null;
    return JSON.parse(userCookie);
  } catch (e) {
    console.error("Failed to parse user cookie", e);
    return null;
  }
};

export const useWorkerSignup = ({ onSuccess } = {}) => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuthContext(); // get refreshAuth at top level

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [profileCompleted, setProfileCompleted] = useState(false);

  const [formData, setFormData] = useState({
    mobile_number: "",
    first_name: "",
    last_name: "",
    work_email: "",

    industry_id: "",
    designation_id: "",
    skills: [],

    date_of_birth: "",
    father_name: "",
    aadhar_number: "",

    address_line: "",
    state_id: "",
    city_id: "",
    working_zip: "",

    account_holder_name: "",
    bank_name: "",
    account_number: "",
    referral_code: "",
    referral_verified: false,
    ifsc_code: "",
    account_type: "savings",
    accepted_terms: false,
    accepted_privacy: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => Cookies.get("token") || null);

  // Dropdown data
  const [industries, setIndustries] = useState([]);
  const [industriesLoading, setIndustriesLoading] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [designationsLoading, setDesignationsLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesMap, setCitiesMap] = useState({});
  const [citiesLoading, setCitiesLoading] = useState({});
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  //Adhar verification state
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarReferenceId, setAadhaarReferenceId] = useState("");
  const [aadhaarLoading, setAadhaarLoading] = useState(false);

  // Cookie configuration
  const cookieOptions = {
    expires: 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Helper to ensure array data from API responses
  const ensureArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.data?.data && Array.isArray(data.data.data))
      return data.data.data;
    return [];
  };

  const updateFormData = (newData) =>
    setFormData((prev) => ({ ...prev, ...newData }));
  const clearFieldError = (fieldName) =>
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
    clearFieldError(field);
  };

  // Fetch industries
  const fetchIndustries = async () => {
    setIndustriesLoading(true);
    try {
      const res = await getIndustriesAPI();
      setIndustries(ensureArray(res));
    } catch (err) {
      console.error("Failed to fetch industries", err);
    } finally {
      setIndustriesLoading(false);
    }
  };

  // Fetch designations (based on industry)
  const fetchDesignations = async (industryId) => {
    setDesignationsLoading(true);
    try {
      const res = await getDesignationsAPI(industryId);

      setDesignations(ensureArray(res.data.data.data));
    } catch (err) {
    } finally {
      setDesignationsLoading(false);
    }
  };

  //Fetch Skills by Designation
  const fetchSkillsByDesignation = async (designationId) => {
    updateFormData({ skills: [] });
    if (!designationId) {
      setSkills([]);
      return;
    }
    setSkillsLoading(true);
    try {
      const res = await getSkillsByDesignationAPI(designationId);
      setSkills(ensureArray(res));
    } catch (err) {
      setSkills([]);
    } finally {
      setSkillsLoading(false);
    }
  };

  // Fetch states
  const fetchStates = async () => {
    setStatesLoading(true);
    try {
      const res = await getStatesAPI();
      setStates(ensureArray(res));
    } catch (err) {
      console.error("Failed to fetch states", err);
    } finally {
      setStatesLoading(false);
    }
  };

  // Fetch cities for a state
  const fetchCities = async (stateId) => {
    if (!stateId || citiesMap[stateId]) return;
    setCitiesLoading((prev) => ({ ...prev, [stateId]: true }));
    try {
      const res = await getCitiesByStateAPI(stateId);
      const cities = ensureArray(res);
      setCitiesMap((prev) => ({ ...prev, [stateId]: cities }));
    } catch (err) {
      console.error("Failed to fetch cities", err);
    } finally {
      setCitiesLoading((prev) => ({ ...prev, [stateId]: false }));
    }
  };

  // Initial data load for dropdowns
  useEffect(() => {
    fetchIndustries();
    fetchStates();
  }, []);
  
useEffect(() => {
  const verifiedMobile = Cookies.get("verified_mobile");
  if (verifiedMobile && !formData.mobile_number) {
    updateFormData({ mobile_number: verifiedMobile });
  }
}, []);
  // When industry changes, reload designations
  useEffect(() => {
    if (formData.industry_id) {
      fetchDesignations(formData.industry_id);
    }
  }, [formData.industry_id]);

  // When designation changes, reload skills
  useEffect(() => {
    if (formData.designation_id) {
      fetchSkillsByDesignation(formData.designation_id);
    }
  }, [formData.designation_id]);

  // Load saved data from "user" cookie on mount
  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (cookieToken) {
      setToken(cookieToken);
    }
    loadDataFromCookie();
  }, []);
  useEffect(() => {
    if (formData.state_id) {
      fetchCities(formData.state_id);
    }
  }, [formData.state_id]);
  const verifyReferralCode = async () => {
    if (!formData.referral_code) return { success: false };

    try {
      const res = await fetch("/api/verify-referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: formData.referral_code }),
      });

      const data = await res.json();

      if (data.valid) {
        updateFormData({ referral_verified: true });
        return { success: true };
      } else {
        updateFormData({ referral_verified: false });
        return { success: false, message: "Invalid referral code" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Verification failed" };
    }
  };

  // Load worker data from "user" cookie and determine step
  const loadDataFromCookie = () => {
    const user = getUserFromCookie();
    if (!user) return;

    const mappedData = {
      mobile_number: user.mobile_number || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      work_email: user.work_email || "",
      industry_id: user.industry_id || "",
      designation_id: user.designation_id || "",
      skills: Array.isArray(user.skills) ? user.skills : [],
      date_of_birth: user.date_of_birth || "",
      father_name: user.father_name || "",
      aadhar_number: user.aadhaar_number || "",
      address_line: user.working_address || "",
      state_id: user.current_state_id || "",
      city_id: user.current_city_id || "",
      working_zip: user.working_zip || "",
      account_holder_name: user.account_holder_name || "",
      bank_name: user.bank_name || "",
      account_number: user.account_number || "",
      ifsc_code: user.ifsc_code || "",
      account_type: user.account_type || "savings",
      accepted_terms: user.accepted_terms || false,
      accepted_privacy: user.accepted_privacy || false,
    };

    updateFormData(mappedData);
    if (mappedData.state_id) {
      fetchCities(mappedData.state_id);
    }

    let step = 1;
    if (
      mappedData.mobile_number &&
      mappedData.first_name &&
      mappedData.last_name &&
      mappedData.work_email
    )
      step = 2;
    if (mappedData.industry_id && mappedData.designation_id) step = 3;
    if (
      mappedData.date_of_birth &&
      mappedData.father_name &&
      mappedData.aadhar_number
    )
      step = 4;
    if (mappedData.address_line && mappedData.state_id && mappedData.city_id && mappedData.working_zip)
      step = 5;
    if (
      mappedData.account_holder_name &&
      mappedData.bank_name &&
      mappedData.account_number &&
      mappedData.ifsc_code
    )
      step = 5;

    setCurrentStep(step);
  };

  // Aadhaar verification
      const sendAadhaarOtp = async (aadharNumber) => {
        setAadhaarLoading(true);
        try {
            const res = await sendAadhaarOtpAPI(
                aadharNumber
            );
            if (res.success) {
                setAadhaarReferenceId(String(res.reference_id));
                Swal.fire({
                    icon: "success",
                    text: "OTP sent successfully."
                });
                return res;
            }

        } finally {
            setAadhaarLoading(false);
        }
      };

      const normalizeDobToISO = (dob) => {
        if (!dob) return "";
        const s = String(dob).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
        const m = s.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
        if (m) return `${m[3]}-${m[2]}-${m[1]}`;
        return "";
      };

      const verifyAadhaarOtp = async (otp, aadhaarNumber) => {
        const res = await verifyAadhaarOtpAPI(
            otp,
            aadhaarReferenceId
        );
        if (!res.success) return false;
        const aadhaar = res.data;
        const names = String(aadhaar?.name || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        const aadharDigits =
          String(aadhaarNumber || "").replace(/\D/g, "") ||
          String(aadhaar?.aadhaar_number || aadhaar?.aadhar_number || "").replace(/\D/g, "");
        updateFormData({
            first_name: names[0] || "",
            last_name: names.slice(1).join(" "),
            date_of_birth: normalizeDobToISO(aadhaar?.dob),
            father_name: aadhaar?.father_name || "",
            address_line: aadhaar?.address || "",
            aadhar_number: aadharDigits,
        });

        setAadhaarVerified(true);
        return res;
    };

    const resendAadhaarOtp = async (aadhaarNumber) => {
    setAadhaarLoading(true);

    try {

        const res = await resendAadhaarOtpAPI(aadhaarNumber);

        if(res.success){

            setAadhaarReferenceId(res.reference_id);

            Swal.fire({
                icon:"success",
                text:"OTP resent successfully."
            });

        }

        return res;

    } finally {
        setAadhaarLoading(false);
    }
};

  const validateStep1 = () => {
    const errs = {};
    const mobileDigits = formData.mobile_number?.replace(/\D/g, "");
    if (!formData.mobile_number)
      errs.mobile_number = "Mobile number is required";
    else if (mobileDigits.length !== 10 || !/^[6-9]/.test(mobileDigits))
      errs.mobile_number = "Must be 10 digits starting with 6-9";
    if (!formData.first_name?.trim())
      errs.first_name = "First name is required";
    if (!formData.last_name?.trim()) errs.last_name = "Last name is required";
    // if (!formData.work_email?.trim()) errs.work_email = 'Work email is required';
    // else if (!/\S+@\S+\.\S+/.test(formData.work_email))
    //   errs.work_email = "Email is invalid";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.industry_id) errs.industry_id = "Please select an industry";
    if (!formData.designation_id)
      errs.designation_id = "Please select a designation";
    if (skills.length > 0 && formData.skills.length === 0)
      errs.skills = "Please select at least one skill";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // const validateStep3 = () => {
  //   const errs = {};
  //   if (!formData.date_of_birth)
  //     errs.date_of_birth = "Date of birth is required";
  //   if (!formData.father_name?.trim())
  //     errs.father_name = "Father's name is required";
  //   const aadharDigits = formData.aadhar_number?.replace(/\D/g, "");
  //   if (!formData.aadhar_number)
  //     errs.aadhar_number = "Aadhar number is required";
  //   else if (aadharDigits.length !== 12)
  //     errs.aadhar_number = "Aadhar must be 12 digits";
  //   setErrors(errs);
  //   return Object.keys(errs).length === 0;
  // };
const validateStep3 = () => {
    const errs = {};
    if (!aadhaarVerified) {
        errs.aadhar = "Please verify your Aadhaar first.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
};
  const validateStep4 = () => {
    const errs = {};
    if (!formData.address_line?.trim())
      errs.address_line = "Address is required";
    if (!formData.state_id) errs.state_id = "Please select a state";
    if (!formData.city_id) errs.city_id = "Please select a city";
     if (!formData.working_zip?.trim()) errs.working_zip = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.working_zip))
      errs.working_zip = "Pincode must be 6 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep5 = () => {
    const errs = {};
    const accDigits = formData.account_number?.replace(/\D/g, "");
    if (!formData.account_number)
      errs.account_number = "Account number is required";
    else if (accDigits.length < 9 || accDigits.length > 18)
      errs.account_number = "Account number must be 9-18 digits";
    if (!formData.ifsc_code?.trim()) errs.ifsc_code = "IFSC code is required";
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code.toUpperCase()))
      errs.ifsc_code = "Invalid IFSC code (e.g. SBIN0123456)";
    if (!formData.account_type) errs.account_type = "Account type is required";
    if (!formData.accepted_terms)
      errs.accepted_terms = "You must accept the terms";
    if (!formData.accepted_privacy)
      errs.accepted_privacy = "You must accept the privacy policy";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      case 5:
        return validateStep5();
      default:
        return true;
    }
  };

  // ---------- API submissions ----------
  const submitStep1 = async () => {
    if (!validateStep1()) return false;
    setLoading(true);
    try {
      // const payload = {
      //   mobile_number: formData.mobile_number.replace(/\D/g, ''),
      //   first_name: formData.first_name,
      //   last_name: formData.last_name,
      //   work_email: formData.work_email,
      // };
      // const response = await registerWorker(payload);
      const payload = {
        mobile_number: formData.mobile_number.replace(/\D/g, ""),
        first_name: formData.first_name,
        last_name: formData.last_name,
        // work_email: formData.work_email,
      };

      const currentToken = Cookies.get("token") || token;

      let response;

      if (currentToken) {
        // User already registered -> update Step 1 details
        response = await updateWorkerProfile(payload);
      } else {
        // First time registration
        response = await registerWorker(payload);
      }
      const data = response.data || response;
      if (data.status && data.status !== 200) {
        setErrors((prev) => ({
          ...prev,
          mobile_number: data.message,
        }));

        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.message || "Something went wrong",
        });

        return false;
      }

      // const authToken = data.token;
      // const worker = data.worker || data;

      // if (!authToken) throw new Error('No token received');

      // Cookies.set('token', authToken, cookieOptions);
      // Cookies.set('role', 'worker', cookieOptions);

      // setToken(authToken);
      const worker = data.worker || data;

      if (!currentToken) {
        const authToken = data.token;

        if (!authToken) {
          throw new Error("No token received");
        }

        Cookies.set("token", authToken, cookieOptions);
        Cookies.set("role", "worker", cookieOptions);
        Cookies.remove("verified_mobile");

        setToken(authToken);
      }
      // if (worker) {
      //   Cookies.set('user', JSON.stringify(worker), cookieOptions);
      //   updateFormData({
      //     mobile_number: worker.mobile_number || formData.mobile_number,
      //     first_name: worker.first_name || formData.first_name,
      //     last_name: worker.last_name || formData.last_name,
      //     work_email: worker.work_email || formData.work_email,
      //   });
      // }
      if (worker) {
        const existingUser = getUserFromCookie() || {};

        Cookies.set(
          "user",
          JSON.stringify({
            ...existingUser,
            ...worker,
            mobile_number: formData.mobile_number,
            first_name: formData.first_name,
            last_name: formData.last_name,
            work_email: formData.work_email,
          }),
          cookieOptions,
        );
      }
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Account Created',
      //   text: 'Please continue with the next steps.',
      //   timer: 1500,
      //   showConfirmButton: false,
      // });
      if (!currentToken) {
        Swal.fire({
          icon: "success",
          title: "Account Created",
          text: "Please continue with the next steps.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Basic information updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitCurrentStep = async () => {
    if (!validateCurrentStep()) return false;

    const currentToken = Cookies.get("token") || token;
    if (!currentToken) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please start over.",
      });
      navigate("/worker/register");
      return false;
    }

    setLoading(true);
    try {
      let payload = {};
      if (currentStep === 2) {
        payload = {
          industry_id: parseInt(formData.industry_id),
          designation_id: parseInt(formData.designation_id),
          ...(formData.skills.length > 0 && {
            skills: formData.skills.map((s) => s.id),
          }),
        };
      } else if (currentStep === 3) {
        payload = {
          date_of_birth: formData.date_of_birth,
          father_name: formData.father_name,
          aadhar_number: formData.aadhar_number.replace(/\D/g, ""),
        };
      } else if (currentStep === 4) {
        payload = {
          working_address: formData.address_line,
          current_state_id: formData.state_id
            ? parseInt(formData.state_id)
            : null,
          current_city_id: formData.city_id ? parseInt(formData.city_id) : null,
          working_zip: formData.working_zip,
        };
      } else if (currentStep === 5) {
        payload = {
          account_holder_name: formData.account_holder_name,
          bank_name: formData.bank_name,
          account_number: formData.account_number.replace(/\D/g, ""),
          ifsc_code: formData.ifsc_code.toUpperCase(),
          account_type: formData.account_type,
          accepted_terms: formData.accepted_terms,
          accepted_privacy: formData.accepted_privacy,
          ...(formData.referral_code && {
            agent_code: formData.referral_code,
          }),
        };
      }

      const response = await updateWorkerProfile(payload);

      // If profile completed, update cookies and refresh auth context
      if (response.data?.profile_status === "completed") {
        // Update user cookie with completed profile data
        const currentUser = getUserFromCookie() || {};
        const updatedUser = {
          ...currentUser,
          ...response.data.worker,
          profile_status: "completed",
        };
        Cookies.set("user", JSON.stringify(updatedUser), cookieOptions);
        Cookies.set("profile_status", "completed", cookieOptions);

        // Refresh auth context to pick up new profile_status
        refreshAuth();
        setProfileCompleted(true);
        if (typeof onSuccess === "function") onSuccess();
        return true;
        // Navigate to dashboard (user stays logged in)
        // navigate("/worker/dashboard");
        // return true;
      }

      if (currentStep < totalSteps) {
        Swal.fire({
          icon: "success",
          title: "Progress Saved",
          text: `Step ${currentStep} completed.`,
          timer: 1000,
          showConfirmButton: false,
        });
      }
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Step ${currentStep} Failed`,
        text: error.response?.data?.message || error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const success = await submitStep1();
      if (success) setCurrentStep(2);
      return;
    }
    if (currentStep < totalSteps) {
      const success = await submitCurrentStep();
      if (success) setCurrentStep((prev) => prev + 1);
    } else if (currentStep === totalSteps) {
      // const success = await submitCurrentStep();
      await submitCurrentStep();

      // if (success) {
      //   Swal.fire({
      //     icon: "success",
      //     title: "Registration Complete!",
      //     text: "Redirecting to your dashboard...",
      //     timer: 1500,
      //     showConfirmButton: false,
      //   }).then(() => {
      //     if (Cookies.get("profile_status") === "completed") {
      //       navigate("/worker/dashboard");
      //     }
      //   });
      // }
    }
  };

  //   const prevStep = () => {
  //   const user = getUserFromCookie();
  //   if (user?.worker_id && currentStep <= 2) {
  //     return;
  //   }
  //   setCurrentStep((prev) => Math.max(prev - 1, 1));
  // };
  const prevStep = () => {
    if (loading) return;

    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps && step < currentStep) {
      setCurrentStep(step);
      setErrors({});
    }
  };

  return {
    currentStep,
    totalSteps,
    formData,
    errors,
    loading,
    token,
    industries,
    verifyReferralCode,
    industriesLoading,
    designations,
    designationsLoading,
    sendAadhaarOtp,
    resendAadhaarOtp,
    verifyAadhaarOtp,
    states,
    statesLoading,
    citiesMap,
    citiesLoading,
    profileCompleted,
    skills,
    skillsLoading,
    handleChange,
    fetchCities,
    nextStep,
    prevStep,
    goToStep,
  };
};
