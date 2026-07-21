// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import {
//   registerCompany,
//   updateCompanyData,
//   getIndustriesAPI,
//   getStatesAPI,
//   getCitiesByStateAPI,
//   verifyGstNumberAPI
// } from "../../../api/company/companyAuthAPI";
// import Cookies from "js-cookie";
// import { useAuthContext } from "../../../common/context/AuthContext";

// // Helper to parse company cookie
// const getCompanyFromCookie = () => {
//   try {
//     // const companyCookie = Cookies.get('company');
//     const companyCookie = Cookies.get("company") || Cookies.get("user");
//     if (!companyCookie) return null;
//     return JSON.parse(companyCookie);
//   } catch (e) {
//     console.error("Failed to parse company cookie", e);
//     return null;
//   }
// };

// export const useCompanyRegister = ({ onSuccess } = {}) => {
//   const navigate = useNavigate();
//   const { refreshAuth } = useAuthContext();

//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 5;

//   const [formData, setFormData] = useState({
//     company_name: "",
//     email: "",
//     company_phone: "",
//     industry_id: "",
//     owner_name: "",
//     owner_email: "",
//     owner_phone: "",
//     gst_number: "",
//     pan_number: "",
//     tin_number: "",
//     agent_code: "",
//     addresses: [],
//     accepted_terms: false,
//     accepted_privacy: false,
//   });

//   const [selectedIndustryId, setSelectedIndustryId] = useState("");

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [isFetchingProfile, setIsFetchingProfile] = useState(false);
//   const [token, setToken] = useState(() => Cookies.get("token") || null);

//   const [industries, setIndustries] = useState([]);
//   const [industriesLoading, setIndustriesLoading] = useState(false);
//   const [states, setStates] = useState([]);
//   const [statesLoading, setStatesLoading] = useState(false);
//   const [citiesMap, setCitiesMap] = useState({});
//   const [citiesLoading, setCitiesLoading] = useState({});

//   const cookieOptions = {
//     expires: 7,
//     path: "/",
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   };

//   // ---------- Helpers ----------
//   const ensureArray = (data) => {
//     if (Array.isArray(data)) return data;
//     if (data?.data && Array.isArray(data.data)) return data.data;
//     if (data?.data?.data && Array.isArray(data.data.data))
//       return data.data.data;
//     return [];
//   };

//   const updateFormData = (newData) =>
//     setFormData((prev) => ({ ...prev, ...newData }));
//   const clearFieldError = (fieldName) =>
//     setErrors((prev) => ({ ...prev, [fieldName]: "" }));

//   const handleChange = (field, value) => {
//     updateFormData({ [field]: value });
//     clearFieldError(field);
//   };

//   // Address management
//   const addAddress = () => {
//     const newAddress = { address: "", city_id: "", state_id: "", zip: "" };
//     setFormData((prev) => ({
//       ...prev,
//       addresses: [...prev.addresses, newAddress],
//     }));
//   };

//   const updateAddress = (index, field, value) => {
//     const updated = [...formData.addresses];
//     updated[index] = { ...updated[index], [field]: value };
//     setFormData((prev) => ({ ...prev, addresses: updated }));
//     clearFieldError(`address_${index}_${field}`);
//   };

//   const removeAddress = (index) => {
//     const updated = formData.addresses.filter((_, i) => i !== index);
//     setFormData((prev) => ({ ...prev, addresses: updated }));
//   };

//   const handleIndustryChange = (industryId) => {
//     setSelectedIndustryId(industryId);
//     updateFormData({ industry_id: industryId ? parseInt(industryId) : "" });
//     clearFieldError("industry_id");
//   };

//   // ---------- GST Verification ----------
//   // Calls CompanyController@verifyGstin via POST /company/gst-verify
//   // NOTE: Sandbox's verify_gstin endpoint only returns legalName/pan/state/status —
//   // no phone or email — so those two fields stay blank and must still be filled in manually.
//   const verifyGstNumber = async (gstin) => {
//     try {
//       const res = await verifyGstNumberAPI(gstin);
//       if (res?.success) {
//         updateFormData({
//           company_name: res.data.company_name || "",
//           gst_number: res.data.gst_number || gstin,
//           pan_number: res.data.pan_number || "",
//         });
//       }
//       return res;
//     } catch (error) {
//       return {
//         success: false,
//         message:
//           error.response?.data?.message || "Could not verify this GST number",
//       };
//     }
//   };
//   // ---------- API Fetchers ----------
//   const fetchIndustries = async () => {
//     setIndustriesLoading(true);
//     try {
//       const res = await getIndustriesAPI();
//       setIndustries(ensureArray(res));
//     } catch (err) {
//       console.error("Failed to fetch industries", err);
//     } finally {
//       setIndustriesLoading(false);
//     }
//   };

//   const fetchStates = async () => {
//     setStatesLoading(true);
//     try {
//       const res = await getStatesAPI();
//       setStates(ensureArray(res));
//     } catch (err) {
//       console.error("Failed to fetch states", err);
//     } finally {
//       setStatesLoading(false);
//     }
//   };

//   const fetchCities = async (stateId) => {
//     if (!stateId || citiesMap[stateId]) return;
//     setCitiesLoading((prev) => ({ ...prev, [stateId]: true }));
//     try {
//       const res = await getCitiesByStateAPI(stateId);
//       const cities = ensureArray(res);
//       setCitiesMap((prev) => ({ ...prev, [stateId]: cities }));
//     } catch (err) {
//       console.error("Failed to fetch cities", err);
//     } finally {
//       setCitiesLoading((prev) => ({ ...prev, [stateId]: false }));
//     }
//   };

//   // ---------- Load saved data on mount ----------
//   useEffect(() => {
//     const cookieToken = Cookies.get("token");
//     if (cookieToken) {
//       setToken(cookieToken);
//     }
//     loadDataFromCookie();
//     // Only fetch dropdown data once
//     fetchIndustries();
//     fetchStates();
//   }, []);

//   // No need for a separate fetchSavedData effect — we handle via cookie

//   const loadDataFromCookie = () => {
//     const company = getCompanyFromCookie();
//     if (!company) return;

//     // Map API response fields (as seen in your example) to form fields
//     const mappedData = {
//       company_name: company.name || company.company_name || "",
//       email: company.email || "",
//       company_phone: company.phone || company.company_phone || "",
//       owner_name: company.owner_name || "",
//       owner_email: company.owner_email || "",
//       owner_phone: company.owner_phone || "",
//       gst_number: company.gst_number || "",
//       pan_number: company.pan_number || "",
//       tin_number: company.tin_number || "",

//       // Addresses from API might have different structure — keep as is or map IDs
//       addresses: (company.addresses || []).map((addr) => ({
//         id: addr.id,
//         address: addr.address || "",
//         city_id: addr.city_id || "",
//         state_id: addr.state_id || "",
//         zip: addr.zip || "",
//       })),
//       agent_code: company.agent_code || "",
//       accepted_terms: company.accepted_terms || false,
//     };

//     updateFormData(mappedData);

//     if (company.industry_id) {
//       setSelectedIndustryId(company.industry_id.toString());
//       updateFormData({ industry_id: company.industry_id });
//     }

//     // Determine current step based on filled data
//     let step = 1;
//     if (mappedData.company_name && mappedData.email && mappedData.company_phone)
//       step = 2;
//     if (
//       mappedData.owner_name &&
//       mappedData.owner_email &&
//       mappedData.owner_phone
//     )
//       step = 3;
//     if (mappedData.gst_number) step = 4;
//     if (mappedData.addresses.length > 0) step = 5;
//     if (mappedData.accepted_terms) step = 5;

//     setCurrentStep(step);
//   };

//   // ---------- Validation (unchanged) ----------
//   const validateStep1 = () => {
//     const errs = {};
//     if (!formData.company_name?.trim())
//       errs.company_name = "Company name is required";
//     if (!formData.gst_number?.trim()) errs.gst_number = "GST number is required";
//     if (!formData.email?.trim()) errs.email = "Company email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       errs.email = "Email is invalid";
//     const phoneDigits = formData.company_phone?.replace(/\D/g, "");
//     if (!formData.company_phone) errs.company_phone = "Phone is required";
//     else if (phoneDigits.length !== 10 || !/^[6-9]/.test(phoneDigits))
//       errs.company_phone = "Must be 10 digits starting with 6-9";
//     if (!formData.industry_id) errs.industry_id = "Please select an industry";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const validateStep2 = () => {
//     const errs = {};
//     if (!formData.owner_name?.trim())
//       errs.owner_name = "Owner name is required";
//     if (!formData.owner_email?.trim())
//       errs.owner_email = "Owner email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.owner_email))
//       errs.owner_email = "Email is invalid";
//     const phoneDigits = formData.owner_phone?.replace(/\D/g, "");
//     if (!formData.owner_phone) errs.owner_phone = "Owner phone is required";
//     else if (phoneDigits.length !== 10 || !/^[6-9]/.test(phoneDigits))
//       errs.owner_phone = "Must be 10 digits starting with 6-9";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   // const validateStep3 = () => {
//   //   const errs = {};
//   //   if (!formData.gst_number?.trim()) errs.gst_number = 'GST number is required';
//   //   setErrors(errs);
//   //   return Object.keys(errs).length === 0;
//   // };
//   const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

//   const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;

//   const cinRegex = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

//   const validateStep3 = () => {
//     const errs = {};

//     const gst = formData.gst_number?.trim();
//     const tan = formData.pan_number?.trim(); // ✅ keep as backend
//     const cin = formData.tin_number?.trim(); // ✅ keep as backend

//     // GST
//     if (!gst) {
//       errs.gst_number = "GST number is required (22AAAAA0000A1Z5)";
//     } else if (!gstRegex.test(gst)) {
//       errs.gst_number = "Invalid GST format (22AAAAA0000A1Z5)";
//     }

//     // TAN (pan_number)
//     if (tan && !tanRegex.test(tan)) {
//       errs.tan_number = "Invalid TAN format (ABCD12345E)";
//     }

//     // CIN (tin_number)
//     if (cin && !cinRegex.test(cin)) {
//       errs.cin_number = "Invalid CIN format (L12345MH2020PLC123456)";
//     }

//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };
//   const validateStep4 = () => {
//     const errs = {};
//     if (formData.addresses.length === 0) {
//       errs.addresses = "At least one address is required";
//     } else {
//       formData.addresses.forEach((addr, idx) => {
//         if (!addr.address?.trim())
//           errs[`address_${idx}_address`] = "Address is required";
//         if (!addr.state_id)
//           errs[`address_${idx}_state_id`] = "State is required";
//         if (!addr.city_id) errs[`address_${idx}_city_id`] = "City is required";
//         const zip = addr.zip?.trim();
//         if (!zip) errs[`address_${idx}_zip`] = "ZIP code is required";
//         else if (!/^\d{6}$/.test(zip))
//           errs[`address_${idx}_zip`] = "ZIP must be 6 digits";
//       });
//     }
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const validateStep5 = () => {
//     const errs = {};

//     if (!formData.accepted_terms) {
//       errs.accepted_terms = "You must accept the terms";
//     }

//     if (!formData.accepted_privacy) {
//       errs.accepted_privacy = "You must accept the privacy policy";
//     }

//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const validateCurrentStep = () => {
//     switch (currentStep) {
//       case 1:
//         return validateStep1();
//       case 2:
//         return validateStep2();
//       case 3:
//         return validateStep3();
//       case 4:
//         return validateStep4();
//       case 5:
//         return validateStep5();
//       default:
//         return true;
//     }
//   };

//   const submitStep1 = async () => {
//     if (!validateStep1()) return false;

//     setLoading(true);

//     try {
//       const payload = {
//         company_name: formData.company_name,
//         gst_number: formData.gst_number,
//         email: formData.email,
//         company_phone: formData.company_phone.replace(/\D/g, ""),
//         industry_id: formData.industry_id,
//       };

//       // const response = await registerCompany(payload);
//       if (Cookies.get("token")) {
//         const response = await updateCompanyData(payload);

//         if (response?.status === 200 || response?.data?.status === 200) {
//           setErrors({});

//           Swal.fire({
//             icon: "success",
//             title: "Progress Saved",
//             timer: 1000,
//             showConfirmButton: false,
//           });

//           return true;
//         }

//         return false;
//       }

//       const response = await registerCompany(payload);

//       const data = response.data || response;

//       // =========================
//       // HANDLE BACKEND VALIDATION ERROR
//       // =========================
//       if (response?.status === 500) {
//         const fieldErrors = {};

//         Object.keys(response.data || {}).forEach((key) => {
//           fieldErrors[key] = Array.isArray(response.data[key])
//             ? response.data[key][0]
//             : response.data[key];
//         });

//         // Show under input fields
//         setErrors(fieldErrors);

//         // Show all errors in swal
//         Swal.fire({
//           icon: "error",
//           title: "Registration Failed",
//           html: Object.values(fieldErrors)
//             .map((msg) => `• ${msg}`)
//             .join("<br>"),
//         });

//         return false;
//       }

//       // =========================
//       // SUCCESS
//       // =========================
//       const authToken = data.token;
//       const company = data.company || data;

//       if (!authToken) {
//         throw new Error("No token received");
//       }

//       Cookies.set("token", authToken, cookieOptions);
//       Cookies.set("role", "company", cookieOptions);
//       setToken(authToken);

//       if (company) {
//         Cookies.set("user", JSON.stringify(company), cookieOptions);

//         updateFormData({
//           company_name:
//             company.name || company.company_name || formData.company_name,

//           email: company.email || formData.email,

//           company_phone:
//             company.phone || company.company_phone || formData.company_phone,
//         });

//         if (company.industry_id) {
//           setSelectedIndustryId(company.industry_id.toString());

//           updateFormData({
//             industry_id: company.industry_id,
//           });
//         }
//       }

//       setErrors({});

//       Swal.fire({
//         icon: "success",
//         title: "Company Created",
//         text: "Please continue with the next steps.",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       return true;
//     } catch (error) {
//       console.error("STEP 1 ERROR:", error);

//       Swal.fire({
//         icon: "error",
//         title: "Registration Failed",
//         text:
//           error?.response?.data?.message ||
//           error.message ||
//           "Something went wrong",
//       });

//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const submitCurrentStep = async () => {
//     // frontend validation
//     if (!validateCurrentStep()) return false;

//     const currentToken = Cookies.get("token") || token;

//     // token check
//     if (!currentToken) {
//       Swal.fire({
//         icon: "error",
//         title: "Session Expired",
//         text: "Please start over.",
//       });

//       navigate("/company/register");
//       return false;
//     }

//     setLoading(true);

//     try {
//       let payload = {};

//       // =========================
//       // STEP 2
//       // =========================
//       if (currentStep === 2) {
//         payload = {
//           owner_name: formData.owner_name,
//           owner_email: formData.owner_email,
//           owner_phone: formData.owner_phone.replace(/\D/g, ""),
//         };
//       }

//       // =========================
//       // STEP 3
//       // =========================
//       else if (currentStep === 3) {
//         payload = {
//           gst_number: formData.gst_number,
//           pan_number: formData.pan_number || "",
//           tin_number: formData.tin_number || "",
//         };
//       }

//       // =========================
//       // STEP 4
//       // =========================
//       else if (currentStep === 4) {
//         payload = {
//           addresses: formData.addresses.map((addr) => ({
//             address: addr.address,
//             city_id: parseInt(addr.city_id),
//             state_id: parseInt(addr.state_id),
//             zip: addr.zip,
//             ...(addr.id ? { id: addr.id } : {}),
//           })),
//         };
//       }

//       // =========================
//       // STEP 5
//       // =========================
//       else if (currentStep === 5) {
//         payload = {
//           t_and_c_accepted: formData.accepted_terms ? 1 : 0,
//           privacy_policy_accepted: formData.accepted_privacy ? 1 : 0,
//           agent_code: formData.agent_code || null,
//         };
//       }

//       // =========================
//       // API CALL
//       // =========================
//       const response = await updateCompanyData(payload);

//       if (response?.status === 500 || response?.data?.status === 500) {
//         const backendData = response?.data || response;

//         const formattedErrors = {};

//         // handle message
//         if (backendData?.message) {
//           formattedErrors.owner_email = backendData.message;
//         }

//         // handle validation object
//         if (backendData?.errors) {
//           Object.keys(backendData.errors).forEach((key) => {
//             formattedErrors[key] = Array.isArray(backendData.errors[key])
//               ? backendData.errors[key][0]
//               : backendData.errors[key];
//           });
//         }

//         // set field errors
//         setErrors(formattedErrors);

//         // show popup
//         Swal.fire({
//           icon: "error",
//           title: `Step ${currentStep} Failed`,
//           html:
//             Object.values(formattedErrors).length > 0
//               ? Object.values(formattedErrors)
//                   .map((msg) => `• ${msg}`)
//                   .join("<br>")
//               : backendData?.message || "Something went wrong",
//         });

//         // IMPORTANT
//         return false;
//       }

//       // =========================
//       // SUCCESS RESPONSE
//       // =========================
//       if (
//         response?.status === 200 ||
//         response?.status === 201 ||
//         response?.data?.status === 200
//       ) {
//         const apiData = response?.data || {};

//         // clear old errors
//         setErrors({});

//         // update cookie
//         if (apiData?.company) {
//           const currentCompany = getCompanyFromCookie() || {};

//           const updatedCompany = {
//             ...currentCompany,
//             ...apiData.company,
//           };

//           Cookies.set("company", JSON.stringify(updatedCompany), cookieOptions);
//         }

//         // profile completed
//         if (
//           apiData?.profile_status === "completed" &&
//           currentStep === totalSteps
//         ) {
//           Cookies.set("profile_status", "completed", cookieOptions);

//           refreshAuth();

//           await Swal.fire({
//             icon: "success",
//             title: "Registration Complete!",
//             text: "Redirecting to your dashboard...",
//             timer: 1500,
//             showConfirmButton: false,
//           });

//           navigate("/company/dashboard");

//           return true;
//         }

//         // step success
//         Swal.fire({
//           icon: "success",
//           title: "Progress Saved",
//           text: `Step ${currentStep} completed.`,
//           timer: 1000,
//           showConfirmButton: false,
//         });

//         return true;
//       }

//       // fallback
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Unexpected response from server",
//       });

//       return false;
//     } catch (error) {
//       const backendData = error?.response?.data || {};

//       const formattedErrors = {};

//       // validation errors
//       if (backendData?.errors) {
//         Object.keys(backendData.errors).forEach((key) => {
//           formattedErrors[key] = Array.isArray(backendData.errors[key])
//             ? backendData.errors[key][0]
//             : backendData.errors[key];
//         });
//       }

//       // message error
//       if (backendData?.message && Object.keys(formattedErrors).length === 0) {
//         formattedErrors.owner_email = backendData.message;
//       }

//       // set errors under inputs
//       setErrors(formattedErrors);

//       // swal popup
//       Swal.fire({
//         icon: "error",
//         title: `Step ${currentStep} Failed`,
//         html:
//           Object.values(formattedErrors).length > 0
//             ? Object.values(formattedErrors)
//                 .map((msg) => `• ${msg}`)
//                 .join("<br>")
//             : backendData?.message || "Something went wrong",
//       });

//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextStep = async () => {
//     if (currentStep === 1) {
//       const success = await submitStep1();
//       if (success) setCurrentStep(2);
//       return;
//     }
//     if (currentStep < totalSteps) {
//       const success = await submitCurrentStep();
//       if (success) setCurrentStep((prev) => prev + 1);
//     } else if (currentStep === totalSteps) {
//       // Final submission already handles redirect; do not call submitCurrentStep again
//       await submitCurrentStep();
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//       setErrors({});
//     }
//   };

//   const goToStep = (step) => {
//     if (step >= 1 && step <= totalSteps && step < currentStep) {
//       setCurrentStep(step);
//       setErrors({});
//     }
//   };

//   return {
//     currentStep,
//     totalSteps,
//     formData,
//     errors,
//     loading: loading || isFetchingProfile,
//     token,
//     selectedIndustryId,
//     industries,
//     industriesLoading,
//     states,
//     statesLoading,
//     citiesMap,
//     citiesLoading,
//     handleChange,
//     handleIndustryChange,
//     addAddress,
//     updateAddress,
//     removeAddress,
//     nextStep,
//     prevStep,
//     goToStep,
//     fetchCities,
//     verifyGstNumber
//   };
// };
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  registerCompany,
  updateCompanyData,
  getIndustriesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
  verifyGstNumberAPI
} from "../../../api/company/companyAuthAPI";
import Cookies from "js-cookie";
import { useAuthContext } from "../../../common/context/AuthContext";

// Helper to parse company cookie
const getCompanyFromCookie = () => {
  try {
    const companyCookie = Cookies.get("company") || Cookies.get("user");
    if (!companyCookie) return null;
    return JSON.parse(companyCookie);
  } catch (e) {
    console.error("Failed to parse company cookie", e);
    return null;
  }
};

export const useCompanyRegister = ({ onSuccess } = {}) => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuthContext();

  const [currentStep, setCurrentStep] = useState(1);

  // FIX: UI only has 4 steps (Review -> Owner -> Address -> Tax+Terms)
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    company_phone: "",
    industry_id: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    owner_role: "",
    gst_number: "",
    pan_number: "",
    tin_number: "",
    agent_code: "",
    addresses: [],
    accepted_terms: false,
    accepted_privacy: false,
  });

  const [selectedIndustryId, setSelectedIndustryId] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [token, setToken] = useState(() => Cookies.get("token") || null);

  const [industries, setIndustries] = useState([]);
  const [industriesLoading, setIndustriesLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesMap, setCitiesMap] = useState({});
  const [citiesLoading, setCitiesLoading] = useState({});
  const [profileCompleted, setProfileCompleted] = useState(false);

  const cookieOptions = {
    expires: 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // ---------- Helpers ----------
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

  // Address management
  const addAddress = () => {
    const newAddress = { address: "", city_id: "", state_id: "", zip: "" };
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddress],
    }));
  };

  const updateAddress = (index, field, value) => {
    const updated = [...formData.addresses];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, addresses: updated }));
    clearFieldError(`address_${index}_${field}`);
  };

  const removeAddress = (index) => {
    const updated = formData.addresses.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, addresses: updated }));
  };

  const handleIndustryChange = (industryId) => {
    setSelectedIndustryId(industryId);
    updateFormData({ industry_id: industryId ? parseInt(industryId) : "" });
    clearFieldError("industry_id");
  };

  // ---------- GST Verification ----------
  const verifyGstNumber = async (gstin) => {
    try {
      const res = await verifyGstNumberAPI(gstin);
      if (res?.success) {
        updateFormData({
          company_name: res.data.company_name || "",
          gst_number: res.data.gst_number || gstin,
          pan_number: res.data.pan_number || "",
        });
      }
      return res;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Could not verify this GST number",
      };
    }
  };

  // ---------- API Fetchers ----------
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

  const fetchCities = async (stateId) => {
    if (!stateId || citiesMap[stateId]) return citiesMap[stateId] || [];
    setCitiesLoading((prev) => ({ ...prev, [stateId]: true }));
    try {
      const res = await getCitiesByStateAPI(stateId);
      const cities = ensureArray(res);
      setCitiesMap((prev) => ({ ...prev, [stateId]: cities }));
      return cities;
    } catch (err) {
      console.error("Failed to fetch cities", err);
      return [];
    } finally {
      setCitiesLoading((prev) => ({ ...prev, [stateId]: false }));
    }
  };

  // ---------- Load saved data on mount ----------
  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (cookieToken) {
      setToken(cookieToken);
    }
    loadDataFromCookie();
    fetchIndustries();
    fetchStates();
  }, []);

  const loadDataFromCookie = () => {
    const company = getCompanyFromCookie();
    if (!company) return;

    const mappedData = {
      company_name: company.name || company.company_name || "",
      email: company.email || "",
      company_phone: company.phone || company.company_phone || "",
      owner_name: company.owner_name || "",
      owner_email: company.owner_email || "",
      owner_phone: company.owner_phone || "",
      owner_role: company.owner_role || "",
      gst_number: company.gst_number || "",
      pan_number: company.pan_number || "",
      tin_number: company.tin_number || "",

      addresses: (company.addresses || []).map((addr) => ({
        id: addr.id,
        address: addr.address || "",
        city_id: addr.city_id || "",
        state_id: addr.state_id || "",
        zip: addr.zip || "",
      })),
      agent_code: company.agent_code || "",
      accepted_terms: company.accepted_terms || false,
      accepted_privacy: company.accepted_privacy || false,
    };

    updateFormData(mappedData);

    if (company.industry_id) {
      setSelectedIndustryId(company.industry_id.toString());
      updateFormData({ industry_id: company.industry_id });
    }

    // FIX: step detection now matches the 4-step UI
    // Step 1: company basics -> Step 2: owner -> Step 3: address -> Step 4: tax+terms
    let step = 1;
    if (mappedData.company_name && mappedData.email && mappedData.company_phone) {
      step = 2;
    }
    if (mappedData.owner_name && mappedData.owner_email && mappedData.owner_phone) {
      step = 3;
    }
    if (mappedData.addresses.length > 0) {
      step = 4;
    }
    if (company.profile_status === "completed") {
      setProfileCompleted(true);
    }

    setCurrentStep(step);
  };

  // ---------- Validation ----------
  const validateStep1 = () => {
    const errs = {};
    if (!formData.company_name?.trim())
      errs.company_name = "Company name is required";
    if (!formData.gst_number?.trim()) errs.gst_number = "GST number is required";
    if (!formData.email?.trim()) errs.email = "Company email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Email is invalid";
    const phoneDigits = formData.company_phone?.replace(/\D/g, "");
    if (!formData.company_phone) errs.company_phone = "Phone is required";
    else if (phoneDigits.length !== 10 || !/^[6-9]/.test(phoneDigits))
      errs.company_phone = "Must be 10 digits starting with 6-9";
    if (!formData.industry_id) errs.industry_id = "Please select an industry";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.owner_name?.trim())
      errs.owner_name = "Owner name is required";
    if (!formData.owner_email?.trim())
      errs.owner_email = "Owner email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.owner_email))
      errs.owner_email = "Email is invalid";
    const phoneDigits = formData.owner_phone?.replace(/\D/g, "");
    if (!formData.owner_phone) errs.owner_phone = "Owner phone is required";
    else if (phoneDigits.length !== 10 || !/^[6-9]/.test(phoneDigits))
      errs.owner_phone = "Must be 10 digits starting with 6-9";
    if (!formData.owner_role) errs.owner_role = "Please select a role";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
  const cinRegex = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

  // FIX: Step 3 is now the WORKING ADDRESS step (was tax details)
  const validateStep3 = () => {
    const errs = {};
    if (!formData.addresses || formData.addresses.length === 0) {
      errs.addresses = "At least one address is required";
    } else {
      formData.addresses.forEach((addr, idx) => {
        if (!addr.address?.trim())
          errs[`address_${idx}_address`] = "Address is required";
        if (!addr.state_id)
          errs[`address_${idx}_state_id`] = "State is required";
        if (!addr.city_id) errs[`address_${idx}_city_id`] = "District is required";
        const zip = addr.zip?.trim();
        if (!zip) errs[`address_${idx}_zip`] = "PIN code is required";
        else if (!/^\d{6}$/.test(zip))
          errs[`address_${idx}_zip`] = "PIN code must be 6 digits";
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // FIX: Step 4 is now TAX DETAILS + TERMS + PRIVACY (final step, was split into 4/5)
  const validateStep4 = () => {
    const errs = {};

    const tan = formData.pan_number?.trim();
    const cin = formData.tin_number?.trim();

    // TAN (pan_number) - optional
    if (tan && !tanRegex.test(tan)) {
      errs.pan_number = "Invalid TAN format (ABCD12345E)";
    }

    // CIN (tin_number) - optional
    if (cin && !cinRegex.test(cin)) {
      errs.tin_number = "Invalid CIN format (L12345MH2020PLC123456)";
    }

    if (!formData.accepted_terms) {
      errs.accepted_terms = "You must accept the terms";
    }

    if (!formData.accepted_privacy) {
      errs.accepted_privacy = "You must accept the privacy policy";
    }

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
      default:
        return true;
    }
  };

  const submitStep1 = async () => {
    if (!validateStep1()) return false;

    setLoading(true);

    try {
      const payload = {
        company_name: formData.company_name,
        gst_number: formData.gst_number,
        email: formData.email,
        company_phone: formData.company_phone.replace(/\D/g, ""),
        industry_id: formData.industry_id,
      };

      if (Cookies.get("token")) {
        const response = await updateCompanyData(payload);

        if (response?.status === 200 || response?.data?.status === 200) {
          setErrors({});

          Swal.fire({
            icon: "success",
            title: "Progress Saved",
            timer: 1000,
            showConfirmButton: false,
          });

          return true;
        }

        return false;
      }

      const response = await registerCompany(payload);
      const data = response.data || response;

      if (response?.status === 500) {
        const fieldErrors = {};

        Object.keys(response.data || {}).forEach((key) => {
          fieldErrors[key] = Array.isArray(response.data[key])
            ? response.data[key][0]
            : response.data[key];
        });

        setErrors(fieldErrors);

        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          html: Object.values(fieldErrors)
            .map((msg) => `• ${msg}`)
            .join("<br>"),
        });

        return false;
      }

      const authToken = data.token;
      const company = data.company || data;

      if (!authToken) {
        throw new Error("No token received");
      }

      Cookies.set("token", authToken, cookieOptions);
      Cookies.set("role", "company", cookieOptions);
      setToken(authToken);

      if (company) {
        Cookies.set("user", JSON.stringify(company), cookieOptions);

        updateFormData({
          company_name:
            company.name || company.company_name || formData.company_name,
          email: company.email || formData.email,
          company_phone:
            company.phone || company.company_phone || formData.company_phone,
        });

        if (company.industry_id) {
          setSelectedIndustryId(company.industry_id.toString());
          updateFormData({ industry_id: company.industry_id });
        }
      }

      setErrors({});

      Swal.fire({
        icon: "success",
        title: "Company Created",
        text: "Please continue with the next steps.",
        timer: 1500,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      console.error("STEP 1 ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitCurrentStep = async () => {
    // frontend validation
    if (!validateCurrentStep()) return false;

    const currentToken = Cookies.get("token") || token;

    if (!currentToken) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please start over.",
      });

      navigate("/company/register");
      return false;
    }

    setLoading(true);

    try {
      let payload = {};

      // =========================
      // STEP 2 - Owner details
      // =========================
      if (currentStep === 2) {
        payload = {
          owner_name: formData.owner_name,
          owner_email: formData.owner_email,
          owner_phone: formData.owner_phone.replace(/\D/g, ""),
          owner_role: formData.owner_role,
        };
      }

      // =========================
      // STEP 3 - Working address (FIXED: was tax details before)
      // =========================
      else if (currentStep === 3) {
        payload = {
          addresses: formData.addresses.map((addr) => ({
            address: addr.address,
            city_id: parseInt(addr.city_id),
            state_id: parseInt(addr.state_id),
            zip: addr.zip,
            ...(addr.id ? { id: addr.id } : {}),
          })),
        };
      }

      // =========================
      // STEP 4 - Tax details + Terms + Privacy (FIXED: merged, final step)
      // =========================
      else if (currentStep === 4) {
        payload = {
          pan_number: formData.pan_number || "",
          tin_number: formData.tin_number || "",
          agent_code: formData.agent_code || null,
          t_and_c_accepted: formData.accepted_terms ? 1 : 0,
          privacy_policy_accepted: formData.accepted_privacy ? 1 : 0,
        };
      }

      // =========================
      // API CALL
      // =========================
      const response = await updateCompanyData(payload);

      if (response?.status === 500 || response?.data?.status === 500) {
        const backendData = response?.data || response;
        const formattedErrors = {};

        if (backendData?.message) {
          formattedErrors._general = backendData.message;
        }

        if (backendData?.errors) {
          Object.keys(backendData.errors).forEach((key) => {
            formattedErrors[key] = Array.isArray(backendData.errors[key])
              ? backendData.errors[key][0]
              : backendData.errors[key];
          });
        }

        setErrors(formattedErrors);

        Swal.fire({
          icon: "error",
          title: `Step ${currentStep} Failed`,
          html:
            Object.values(formattedErrors).length > 0
              ? Object.values(formattedErrors)
                  .map((msg) => `• ${msg}`)
                  .join("<br>")
              : backendData?.message || "Something went wrong",
        });

        return false;
      }

      // =========================
      // SUCCESS RESPONSE
      // =========================
      if (
        response?.status === 200 ||
        response?.status === 201 ||
        response?.data?.status === 200
      ) {
        const apiData = response?.data || {};

        setErrors({});

        if (apiData?.company) {
          const currentCompany = getCompanyFromCookie() || {};
          const updatedCompany = {
            ...currentCompany,
            ...apiData.company,
          };
          Cookies.set("company", JSON.stringify(updatedCompany), cookieOptions);
        }

        // FIX: completion check now fires on the real last step (4),
        // and falls back to a 200/201 status if the backend doesn't
        // send profile_status explicitly on the final step.
        const isLastStep = currentStep === totalSteps;
        const backendSaysComplete =
          apiData?.profile_status === "completed" ||
          response?.status === 200 ||
          response?.status === 201;

        if (isLastStep && backendSaysComplete) {
          Cookies.set("profile_status", "completed", cookieOptions);

          if (typeof refreshAuth === "function") {
            refreshAuth();
          }

          await Swal.fire({
            icon: "success",
            title: "Registration Complete!",
            text: "Redirecting to your dashboard...",
            timer: 1500,
            showConfirmButton: false,
          });

          setProfileCompleted(true);

          if (typeof onSuccess === "function") {
            onSuccess();
          }

          return true;
        }

        // step success (not final step)
        Swal.fire({
          icon: "success",
          title: "Progress Saved",
          text: `Step ${currentStep} completed.`,
          timer: 1000,
          showConfirmButton: false,
        });

        return true;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unexpected response from server",
      });

      return false;
    } catch (error) {
      const backendData = error?.response?.data || {};
      const formattedErrors = {};

      if (backendData?.errors) {
        Object.keys(backendData.errors).forEach((key) => {
          formattedErrors[key] = Array.isArray(backendData.errors[key])
            ? backendData.errors[key][0]
            : backendData.errors[key];
        });
      }

      if (backendData?.message && Object.keys(formattedErrors).length === 0) {
        formattedErrors._general = backendData.message;
      }

      setErrors(formattedErrors);

      Swal.fire({
        icon: "error",
        title: `Step ${currentStep} Failed`,
        html:
          Object.values(formattedErrors).length > 0
            ? Object.values(formattedErrors)
                .map((msg) => `• ${msg}`)
                .join("<br>")
            : backendData?.message || "Something went wrong",
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
      return;
    }

    if (currentStep === totalSteps) {
      // Final step: submitCurrentStep sets profileCompleted internally
      await submitCurrentStep();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
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
    loading: loading || isFetchingProfile,
    token,
    selectedIndustryId,
    industries,
    industriesLoading,
    states,
    statesLoading,
    citiesMap,
    citiesLoading,
    profileCompleted,
    handleChange,
    handleIndustryChange,
    addAddress,
    updateAddress,
    removeAddress,
    nextStep,
    prevStep,
    goToStep,
    fetchCities,
    verifyGstNumber,
  };
};