import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { useAddWorker } from "../../adminhooks/useAddWorker";
import Loader from "../../../../common/components/Loader";
import {
  AlertCircle,
  Search,
  CheckCircle,
  Plus,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Home,
  MapPin,
  Building2,
  Hash,
  ShieldCheck,
  CreditCard,
  FileText,
  Award,
  Fingerprint,
  Wallet,
  MapPinned,
} from "lucide-react";
import EditableSalaryTable from "../salary/EditableSalaryTable";
import useUnsavedChangesWarning from "../../../../common/hooks/useUnsavedChangesWarning";

const SingleAddWorkerForm = () => {
  const {
    formData,
    errors,
    loading,
    formLoading,
    industries,
    designations,
    skills,
    loadingSkills,
    states,
    cities,
    loadingCities,
    agents,
    filterAgents,
    updateFormData,
    designationsLoading,
    clearError,
    filterIndustries,
    filterDesignations,
    filterStates,
    filterCities,
    fetchCitiesByState,
    addNewDesignation,
    workingCities,
    loadingWorkingCities,
    fetchWorkingCitiesByState,
    filterWorkingCities,
    staffList,
    loadingStaff,
    filterStaffList,
    earningComponents,
    earningValues,
    calculationResults,
    initialSalaryLoading,
    handleEarningValueChange,
    submitForm,
    resetForm,
    verifyBankAccount,
    isBankVerified,
    verifyingBank,
    navigate,
  } = useAddWorker();

  // UI states
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillRef = useRef(null);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCurrentStateDropdown, setShowCurrentStateDropdown] =
    useState(false);
  const [showCurrentCityDropdown, setShowCurrentCityDropdown] = useState(false);
  const [showRMDropdown, setShowRMDropdown] = useState(false);
  const [shouldWarn, setShouldWarn] = useState(true);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [rmSearch, setRmSearch] = useState("");
  const [agentSearch, setAgentSearch] = useState("");
  // Refs
  const designationRef = useRef(null);
  const industryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const currentStateRef = useRef(null);
  const currentCityRef = useRef(null);
  const rmRef = useRef(null);
  const agentRef = useRef(null);
  const initialEmptyState = useMemo(
    () => ({
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
      skills: [],
      work_experience: "",
      dress_size: "",
      bonus_frequency: "",
      uan_number: "",
      esic_number: "",
      date_of_birth: "",
      father_name: "",
      pan_number: "",
      aadhar_number: "",
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
      working_address: "",
      working_zip: "",
      payment_method: "bank",
      account_holder_name: "",
      bank_name: "",
      account_number: "",
      ifsc_code: "",
      account_type: "",
      staff_code: "",
    }),
    [],
  );

  const isFormDirty = useMemo(() => {
    if (loading) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialEmptyState);
  }, [formData, initialEmptyState, loading]);

  useUnsavedChangesWarning(
    isFormDirty && shouldWarn && !loading,
    "You have unsaved changes. Are you sure you want to leave? All changes will be lost.",
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        designationRef.current &&
        !designationRef.current.contains(event.target)
      )
        setShowDesignationDropdown(false);
      if (industryRef.current && !industryRef.current.contains(event.target))
        setShowIndustryDropdown(false);
      if (stateRef.current && !stateRef.current.contains(event.target))
        setShowStateDropdown(false);
      if (cityRef.current && !cityRef.current.contains(event.target))
        setShowCityDropdown(false);
      if (
        currentStateRef.current &&
        !currentStateRef.current.contains(event.target)
      )
        setShowCurrentStateDropdown(false);
      if (agentRef.current && !agentRef.current.contains(event.target))
        setShowAgentDropdown(false);
      if (
        currentCityRef.current &&
        !currentCityRef.current.contains(event.target)
      )
        setShowCurrentCityDropdown(false);
      if (rmRef.current && !rmRef.current.contains(event.target))
        setShowRMDropdown(false);
      if (skillRef.current && !skillRef.current.contains(event.target))
        setShowSkillDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fullName = [
      formData.first_name,
      formData.middle_name,
      formData.last_name,
    ]
      .filter(Boolean)
      .join(" ");
    updateFormData({ account_holder_name: fullName });
  }, [formData.first_name, formData.middle_name, formData.last_name]);
  useEffect(() => {
    const selectedRM = staffList.find(
      (s) => s.staff_code === formData.staff_code,
    );

    if (selectedRM) {
      setRmSearch(selectedRM.name);
    }
  }, [formData.staff_code, staffList]);

  useEffect(() => {
    const selectedAgent = agents.find(
      (a) => a.agent_code === formData.agent_code,
    );

    if (selectedAgent) {
      setAgentSearch(selectedAgent.name);
    }
  }, [formData.agent_code, agents]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData({ [name]: type === "checkbox" ? checked : value });
    clearError(name);
  };

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);

    const part1 = value.slice(0, 3);
    const part2 = value.slice(3, 7);
    const part3 = value.slice(7, 10);

    let formatted = part1;
    if (part2) formatted += "-" + part2;
    if (part3) formatted += "-" + part3;

    updateFormData({ mobile_number: formatted });

    const mobile = value;

    if (mobile.length > 0 && !/^[6-9]/.test(mobile)) {
      errors.mobile_number = "Mobile number must start with 6-9";
    } else if (mobile.length > 0 && mobile.length < 10) {
      errors.mobile_number = "Mobile number must be 10 digits";
    } else {
      clearError("mobile_number");
    }
  };

  const handleUANChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    updateFormData({ uan_number: value });
    clearError("uan_number");
  };

  const handlePANChange = (e) => {
    let value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]*$/.test(value)) {
      updateFormData({ pan_number: value.slice(0, 10) });
      clearError("pan_number");
    }
  };

  const handleAadhaarChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    let formatted = value.slice(0, 12);
    updateFormData({ aadhar_number: formatted });
    clearError("aadhar_number");
  };

  // const handleAccountNumberChange = (e) => {
  //   updateFormData({ account_number: e.target.value });
  //   clearError("account_number");
  // };
  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 18);

    updateFormData({ account_number: value });
    clearError("account_number");
  };
  const handleIFSCChange = (e) => {
    updateFormData({ ifsc_code: e.target.value });
    clearError("ifsc_code");
  };

  const handleIndustrySearch = (value) => {
    updateFormData({ industry: value, industry_id: "" });
    filterIndustries(value);
    setShowIndustryDropdown(true);
  };
  const handleIndustrySelect = (industry) => {
    updateFormData({ industry: industry.name, industry_id: industry.id });
    clearError("industry");
    setShowIndustryDropdown(false);
  };

  const handleDesignationSearch = (value) => {
    updateFormData({ designation: value, designation_id: "", skills: [] });
    filterDesignations(value);
    setShowDesignationDropdown(true);
  };

  const toggleSkill = (skill) => {
    const selected = formData.skills || [];

    const exists = selected.some((s) => s.id === skill.id);

    if (exists) {
      updateFormData({
        skills: selected.filter((s) => s.id !== skill.id),
      });
    } else {
      updateFormData({
        skills: [...selected, skill],
      });
    }
  };
  const removeSkill = (id) => {
    updateFormData({
      skills: formData.skills.filter((s) => s.id !== id),
    });
  };

  const handleDesignationSelect = (designation) => {
    updateFormData({
      designation: designation.name,
      designation_id: designation.id,
      new_designation: "",
    });
    clearError("designation");
    setShowDesignationDropdown(false);
  };
  const handleAddNewDesignation = async () => {
    if (!formData.designation.trim()) return;
    if (!formData.industry_id) {
      Swal.fire({
        icon: "error",
        title: "Industry Required",
        text: "Please select an industry first",
      });
      return;
    }
    try {
      const newDesignation = await addNewDesignation(
        formData.designation.trim(),
        formData.industry_id,
      );
      updateFormData({
        designation: newDesignation.name,
        designation_id: newDesignation.id,
        new_designation: "",
      });
      setShowDesignationDropdown(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Designation added",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add designation",
      });
    }
  };
  const handleRMSearch = (value) => {
    setRmSearch(value);

    updateFormData({
      staff_code: "",
    });

    filterStaffList(value);
    setShowRMDropdown(true);
  };

  const handleRMSelect = (staff) => {
    setRmSearch(staff.name);

    updateFormData({
      staff_code: staff.staff_code,
    });

    clearError("staff_code");
    setShowRMDropdown(false);
  };
  // const handleRMSearch = (value) => {
  //   updateFormData({ staff_code: "" });
  //   filterStaffList(value);
  //   setShowRMDropdown(true);
  // };

  // const handleRMSelect = (staff) => {
  //   updateFormData({ staff_code: staff.staff_code });
  //   clearError("staff_code");
  //   setShowRMDropdown(false);
  // };
  // const handleAgentSearch = (value) => {
  //   updateFormData({ agent_code: "" });
  //   filterAgents(value);
  //   setShowAgentDropdown(true);
  // };

  // const handleAgentSelect = (agent) => {
  //   updateFormData({
  //     agent_code: agent.agent_code,
  //   });

  //   clearError("agent_code");
  //   setShowAgentDropdown(false);
  // };
  const handleAgentSearch = (value) => {
    setAgentSearch(value);

    updateFormData({
      agent_code: "",
    });

    filterAgents(value);
    setShowAgentDropdown(true);
  };

  const handleAgentSelect = (agent) => {
    setAgentSearch(agent.name);

    updateFormData({
      agent_code: agent.agent_code,
    });

    clearError("agent_code");
    setShowAgentDropdown(false);
  };
  const handleStateSearch = (value) => {
    updateFormData({ state: value, state_id: "", city: "", city_id: "" });
    filterStates(value);
    setShowStateDropdown(true);
  };
  const handleStateSelect = async (state) => {
    updateFormData({
      state: state.name,
      state_id: state.id,
      city: "",
      city_id: "",
    });
    clearError("state_id");
    await fetchCitiesByState(state.id);
    setShowStateDropdown(false);
  };
  const handleCitySearch = (value) => {
    updateFormData({ city: value, city_id: "" });
    filterCities(value);
    setShowCityDropdown(true);
  };
  const handleCitySelect = (city) => {
    updateFormData({ city: city.name, city_id: city.id });
    clearError("city_id");
    setShowCityDropdown(false);
  };

  const handleCurrentStateSearch = (value) => {
    updateFormData({
      current_state: value,
      current_state_id: "",
      current_city: "",
      current_city_id: "",
    });
    filterStates(value);
    setShowCurrentStateDropdown(true);
  };
  const handleCurrentStateSelect = async (state) => {
    updateFormData({
      current_state: state.name,
      current_state_id: state.id,
      current_city: "",
      current_city_id: "",
    });
    clearError("current_state_id");
    await fetchWorkingCitiesByState(state.id);
    setShowCurrentStateDropdown(false);
  };
  const handleCurrentCitySearch = (value) => {
    updateFormData({ current_city: value, current_city_id: "" });
    filterWorkingCities(value);
    setShowCurrentCityDropdown(true);
  };
  const handleCurrentCitySelect = (city) => {
    updateFormData({ current_city: city.name, current_city_id: city.id });
    clearError("current_city_id");
    setShowCurrentCityDropdown(false);
  };

  const handleResetForm = () => {
    Swal.fire({
      title: "Reset Form?",
      text: "This will clear all entered data. Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm();
        setShouldWarn(true);
      }
    });
  };

  const handleCancel = () => {
    setShouldWarn(true);
    navigate("/admin/worker/listing");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShouldWarn(false);
    try {
      const response = await submitForm(formData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Worker Added",
          text: "New worker has been added successfully.",
          timer: 1800,
          showConfirmButton: false,
        }).then(() => {
          setShouldWarn(true);
          navigate("/admin/worker/listing");
        });
      }
    } catch (error) {
      setShouldWarn(true);
      if (error.message !== "Validation failed") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to add worker",
        });
      }
    }
  };

  if (formLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {isFormDirty && shouldWarn && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              You have unsaved changes
            </span>
          </div>
        </motion.div>
      )}

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 space-y-8"
        onSubmit={handleSubmit}
      >
        {/* Basic Details Card */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b border-[#DDDDDD] px-6 py-4 font-semibold text-slate-700">
            Basic Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {/* First Name */}
            <div>
              <label className="text-sm text-slate-600">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  maxLength={35}
                  name="first_name"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.first_name ? "border-red-500" : "border"}`}
                  placeholder="Enter First Name"
                />
              </div>
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.first_name}
                </p>
              )}
            </div>
            {/* Middle Name */}
            <div>
              <label className="text-sm text-slate-600">Middle Name</label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  maxLength={35}
                  value={formData.middle_name}
                  onChange={handleChange}
                  name="middle_name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="Enter Middle Name"
                />
              </div>
            </div>
            {/* Last Name */}
            <div>
              <label className="text-sm text-slate-600">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  maxLength={35}
                  value={formData.last_name}
                  onChange={handleChange}
                  name="last_name"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.last_name ? "border-red-500" : "border"}`}
                  placeholder="Enter Last Name"
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.last_name}
                </p>
              )}
            </div>
            {/* Work Email */}
            <div>
              <label className="text-sm text-slate-600">Personal Email </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.work_email}
                  onChange={handleChange}
                  name="work_email"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.work_email || errors.email ? "border-red-500" : "border"}`}
                  placeholder="Enter Personal Email"
                />
              </div>
              {(errors.work_email || errors.email) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.work_email || errors.email}
                </p>
              )}
            </div>
            {/* Mobile Number */}
            <div>
              <label className="text-sm text-slate-600">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.mobile_number}
                  onChange={handleMobileChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.mobile_number ? "border-red-500" : "border"}`}
                  placeholder="xxx-xxxx-xxx"
                  maxLength={12}
                />
              </div>
              {errors.mobile_number && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.mobile_number}
                </p>
              )}
            </div>
            {/* Gender */}
            <div>
              <label className="text-sm text-slate-600">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={formData.gender}
                  onChange={handleChange}
                  name="gender"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.gender ? "border-red-500" : "border"}`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.gender}
                </p>
              )}
            </div>
            {/* Dress Size */}
            <div>
              <label className="text-sm text-slate-600">Dress Size</label>
              <div className="grid grid-cols-5 gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      updateFormData({
                        dress_size: formData.dress_size === size ? "" : size,
                      })
                    }
                    className={`py-3 rounded-lg border text-center transition ${formData.dress_size === size ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold" : "border-gray-300 hover:bg-gray-50"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Reporting Manager (RM) */}
            <div ref={rmRef} className="relative">
              <label className="text-sm text-slate-600">
                Relationship Manager
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  // value={
                  //   staffList.find((s) => s.staff_code === formData.staff_code)
                  //     ?.name || ""
                  // }
                  value={rmSearch}
                  onChange={(e) => handleRMSearch(e.target.value)}
                  onFocus={() => setShowRMDropdown(true)}
                  className="w-full pl-10 pr-10 py-2 rounded-lg border"
                  placeholder="Search reporting manager"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {showRMDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {loadingStaff ? (
                    <div className="px-4 py-3 text-gray-500 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading staff...
                    </div>
                  ) : staffList.length > 0 ? (
                    staffList.map((staff) => (
                      <div
                        key={staff.id}
                        className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleRMSelect(staff)}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            {staff.name}{" "}
                            {staff.staff_code ? `(${staff.staff_code})` : ""}
                          </span>
                          {formData.staff_code === staff.id && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No staff members found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div ref={agentRef} className="relative">
              <label className="text-sm text-slate-600">Agent</label>

              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  // value={
                  //   agents.find((a) => a.agent_code === formData.agent_code)
                  //     ?.name || ""
                  // }
                  value={agentSearch}
                  onChange={(e) => handleAgentSearch(e.target.value)}
                  onFocus={() => setShowAgentDropdown(true)}
                  className="w-full pl-10 pr-10 py-2 rounded-lg border"
                  placeholder="Search agent"
                />

                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>

              {showAgentDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {agents.length > 0 ? (
                    agents.map((agent) => (
                      <div
                        key={agent.id}
                        className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        onClick={() => handleAgentSelect(agent)}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            {agent.name} ({agent.agent_code})
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No agents found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Statutory Details Section */}
          <div className="border-t p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-700">
              <ShieldCheck className="text-orange-500" size={20} />
              Statutory Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>UAN Number</label>
                <div className="relative">
                  <Hash
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.uan_number}
                    onChange={handleUANChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    placeholder="12-digit UAN"
                    maxLength="12"
                  />
                </div>
                {errors.uan_number && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    {errors.uan_number}
                  </p>
                )}
              </div>
              <div>
                <label>ESIC Number</label>
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    maxLength={20}
                    value={formData.esic_number}
                    onChange={handleChange}
                    name="esic_number"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    placeholder="Enter ESIC Number"
                  />
                </div>
                {errors.esic_number && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    {errors.esic_number}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Professional Details Card (Industry, Designation, Experience) */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b px-6 py-4 font-semibold text-slate-700">
            Professional Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {/* Industry */}
            <div ref={industryRef} className="relative">
              <label className="text-sm text-slate-600">
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleIndustrySearch(e.target.value)}
                  onFocus={() => setShowIndustryDropdown(true)}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.industry ? "border-red-500" : ""}`}
                  placeholder="Search industry"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.industry && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.industry}
                </p>
              )}
              {showIndustryDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {industries && industries.length > 0 ? (
                    industries.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                        onClick={() => handleIndustrySelect(item)}
                      >
                        <div className="flex justify-between">
                          <span>{item.name}</span>
                          {formData.industry_id === item.id && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No industries found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Designation */}
            <div ref={designationRef} className="relative">
              <label className="text-sm text-slate-600">
                Designation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => handleDesignationSearch(e.target.value)}
                  onFocus={() => setShowDesignationDropdown(true)}
                  disabled={!formData.industry_id}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.designation ? "border-red-500" : ""} ${!formData.industry_id ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder={
                    formData.industry_id
                      ? "Search or enter designation"
                      : "Select industry first"
                  }
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.designation && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.designation}
                </p>
              )}
              {showDesignationDropdown && formData.industry_id && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {designationsLoading ? (
                    <div className="px-4 py-3 text-center">Loading...</div>
                  ) : designations.length > 0 ? (
                    <>
                      {designations.map((item) => (
                        <div
                          key={item.id}
                          className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                          onClick={() => handleDesignationSelect(item)}
                        >
                          <div className="flex justify-between">
                            <span>{item.name}</span>
                            {formData.designation_id === item.id && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                      {!designations.some(
                        (d) =>
                          d.name.toLowerCase() ===
                          formData.designation.toLowerCase(),
                      ) &&
                        formData.designation.trim() && (
                          <button
                            type="button"
                            onClick={handleAddNewDesignation}
                            className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Plus size={16} /> Add "{formData.designation}"
                          </button>
                        )}
                    </>
                  ) : (
                    <div className="px-4 py-3">
                      No designations found
                      {formData.designation.trim() && (
                        <button
                          type="button"
                          onClick={handleAddNewDesignation}
                          className="mt-2 w-full bg-blue-50 text-blue-600 py-1 rounded"
                        >
                          Add "{formData.designation}"
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="text-sm text-slate-600">
                Experience (Years)
              </label>
              <div className="relative">
                <Award
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  value={formData.work_experience}
                  onChange={handleChange}
                  name="work_experience"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="Years"
                  min="0"
                  max="50"
                  step="0.5"
                />
              </div>
            </div>
            {/* Skill */}
            <div ref={skillRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  disabled={!formData.designation_id}
                  onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                  className={`w-full border rounded-lg px-4 py-3 text-left flex justify-between items-center
                    ${!formData.designation_id
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white"
                    }`}
                >
                  <span>
                    {!formData.designation_id
                      ? "Select designation first"
                      : loadingSkills
                        ? "Loading..."
                        : formData.skills.length > 0
                          ? `${formData.skills.length} skill(s) selected`
                          : "Select Skills"}
                  </span>

                  <span>{showSkillDropdown ? "▲" : "▼"}</span>
                </button>

                {showSkillDropdown && (
                  <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {loadingSkills ? (
                      <div className="p-3 text-gray-500">Loading...</div>
                    ) : skills.length > 0 ? (
                      skills.map((skill) => (
                        <label
                          key={skill.id}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.skills.some((s) => s.id === skill.id)}
                            onChange={() => toggleSkill(skill)}
                          />
                          {skill.name}
                        </label>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500">No skills found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Skills */}
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill.name}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {errors.skills && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.skills}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Personal Details Card */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b px-6 py-4 font-semibold">
            Personal Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div>
              <label>Date of Birth</label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  name="date_of_birth"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                />
              </div>
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  {errors.date_of_birth}
                </p>
              )}
            </div>
            <div>
              <label>Father's Name</label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.father_name}
                  onChange={handleChange}
                  name="father_name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="Father's Name"
                />
              </div>
            </div>
            <div>
              <label>PAN Number</label>
              <div className="relative">
                <FileText
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.pan_number}
                  onChange={handlePANChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="ABCDE1234F"
                  maxLength="10"
                />
              </div>
              {errors.pan_number && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  {errors.pan_number}
                </p>
              )}
            </div>
            <div>
              <label>Aadhaar Number</label>
              <div className="relative">
                <Fingerprint
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.aadhar_number}
                  onChange={handleAadhaarChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="XXXX-XXXX-XXXX"
                  maxLength="14"
                />
              </div>
              {errors.aadhar_number && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  {errors.aadhar_number}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label>Residential Address</label>
              <div className="relative">
                <Home
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <textarea
                  value={formData.residential_address}
                  onChange={handleChange}
                  name="residential_address"
                  rows="3"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="Full address"
                ></textarea>
              </div>
            </div>
            <div ref={stateRef} className="relative">
              <label>
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleStateSearch(e.target.value)}
                  onFocus={() => setShowStateDropdown(true)}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                    errors.state_id ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Search state"
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.state_id && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  {errors.state_id}
                </p>
              )}
              {showStateDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg max-h-60 overflow-auto">
                  {states.map((s) => (
                    <div
                      key={s.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => handleStateSelect(s)}
                    >
                      <div className="flex justify-between">
                        <span>{s.name}</span>
                        {formData.state_id === s.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div ref={cityRef} className="relative">
              <label>
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  onFocus={() => formData.state_id && setShowCityDropdown(true)}
                  disabled={!formData.state_id}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                    errors.city_id ? "border-red-500" : "border-gray-300"
                  } ${
                    !formData.state_id ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder={
                    formData.state_id ? "Search city" : "Select state first"
                  }
                />
                {loadingCities ? (
                  <div className="absolute right-3 top-1/2 animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                ) : (
                  <Search
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                )}
              </div>
              {errors.city_id && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  {errors.city_id}
                </p>
              )}
              {showCityDropdown && formData.state_id && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg max-h-60 overflow-auto">
                  {cities.map((c) => (
                    <div
                      key={c.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => handleCitySelect(c)}
                    >
                      <div className="flex justify-between">
                        <span>{c.name}</span>
                        {formData.city_id === c.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label>Pincode</label>
              <div className="relative">
                {" "}
                <MapPinned
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) =>
                    updateFormData({
                      zip: e.target.value.replace(/\D/g, "").slice(0, 6),
                    })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="6-digit"
                  maxLength="6"
                />
              </div>
              {errors.zip && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  {errors.zip}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Working Address Card */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b px-6 py-4 font-semibold">
            Working Address
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div ref={currentStateRef} className="relative">
              <label>Working State</label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.current_state}
                  onChange={(e) => handleCurrentStateSearch(e.target.value)}
                  onFocus={() => setShowCurrentStateDropdown(true)}
                  className="w-full pl-10 pr-10 py-2 rounded-lg border"
                  placeholder="Search state"
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {showCurrentStateDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg max-h-60 overflow-auto">
                  {states.map((s) => (
                    <div
                      key={s.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => handleCurrentStateSelect(s)}
                    >
                      <div className="flex justify-between">
                        <span>{s.name}</span>
                        {formData.current_state_id === s.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div ref={currentCityRef} className="relative">
              <label>Working City</label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.current_city}
                  onChange={(e) => handleCurrentCitySearch(e.target.value)}
                  onFocus={() =>
                    formData.current_state_id &&
                    setShowCurrentCityDropdown(true)
                  }
                  disabled={!formData.current_state_id}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${!formData.current_state_id ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder={
                    formData.current_state_id
                      ? "Search city"
                      : "Select state first"
                  }
                />
                {loadingWorkingCities ? (
                  <div className="absolute right-3 top-1/2 animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                ) : (
                  <Search
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                )}
              </div>
              {showCurrentCityDropdown && formData.current_state_id && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg max-h-60 overflow-auto">
                  {workingCities.map((c) => (
                    <div
                      key={c.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => handleCurrentCitySelect(c)}
                    >
                      <div className="flex justify-between">
                        <span>{c.name}</span>
                        {formData.current_city_id === c.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label>Working Address</label>
              <div className="relative">
                <Home
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <textarea
                  value={formData.working_address}
                  onChange={(e) =>
                    updateFormData({ working_address: e.target.value })
                  }
                  rows="3"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="Working address"
                ></textarea>
              </div>
            </div>
            <div>
              <label>Working Zip Code</label>
              <div className="relative">
                {" "}
                <MapPinned
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={formData.working_zip}
                  onChange={(e) =>
                    updateFormData({
                      working_zip: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6),
                    })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="6-digit"
                  maxLength="6"
                />
              </div>
              {errors.working_zip && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  {errors.working_zip}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Payment Information Card */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b px-6 py-4 font-semibold">
            Payment Information
          </div>
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg w-fit">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">
                  Bank Transfer
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
              <div>
                <label>Account Holder Name</label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.account_holder_name}
                    disabled
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-100 cursor-not-allowed"
                  />
                </div>
                {errors.account_holder_name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    {errors.account_holder_name}
                  </p>
                )}
              </div>

              <div>
                <label>Account Number</label>
                <div className="relative">
                  <CreditCard
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    maxLength="18"
                    value={formData.account_number}
                    onChange={handleAccountNumberChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    maxLength="18"
                  />
                </div>
                {errors.account_number && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    {errors.account_number}
                  </p>
                )}
              </div>
              <div>
                <label>IFSC Code</label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Hash
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.ifsc_code}
                      onChange={handleIFSCChange}
                      maxLength="11"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border uppercase"
                      placeholder="e.g. ICIC0000001"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={verifyBankAccount}
                    disabled={verifyingBank || isBankVerified}
                    className={`whitespace-nowrap text-xs font-medium px-4 py-2.5 rounded-lg transition-colors h-full ${
                      isBankVerified
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
                    }`}
                  >
                    {verifyingBank
                      ? "..."
                      : isBankVerified
                        ? "Verified"
                        : "Verify Account"}
                  </button>
                </div>
                {errors.bank_verification && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.bank_verification}
                  </p>
                )}
                {errors.ifsc_code && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    {errors.ifsc_code}
                  </p>
                )}
              </div>
              <div>
                <label>Account Type</label>
                <div className="relative">
                  <CreditCard
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <select
                    value={formData.account_type}
                    onChange={handleChange}
                    name="account_type"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  >
                    <option value="">Select</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="salary">Salary</option>
                  </select>
                </div>
                {errors.account_type && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    {errors.account_type}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Salary Structure Card */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white rounded-[22px] shadow-sm border border-[#DDDDDD] overflow-hidden"
        >
          <div className="text-lg bg-[#F9F9F9] border-b px-6 py-4 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="text-blue-600" size={20} />
              <span>Salary Structure</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-slate-500">
                Define Custom Structure?
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.define_salary_structure}
                  onChange={(e) =>
                    updateFormData({
                      define_salary_structure: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {formData.define_salary_structure ? (
            <div className="p-0">
              <div className="w-full p-6 bg-white border-b">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <ShieldCheck className="text-blue-600" size={18} />
                    Statutory Compliance
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Toggle PF/ESIC applicability for this specific worker.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* PF Toggle */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          PF Applicable
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {formData.is_pf_applicable
                            ? `PF deductions will be applied (Upper Cap: ₹${formData.pf_upper_cap})`
                            : "No PF deductions will be applied"}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.is_pf_applicable}
                            onChange={(e) =>
                              updateFormData({
                                is_pf_applicable: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span
                          className={`text-[11px] font-bold tracking-widest ${formData.is_pf_applicable ? "text-blue-600" : "text-gray-400"}`}
                        >
                          {formData.is_pf_applicable ? "YES" : "NO"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ESIC Toggle */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          ESIC Applicable
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {formData.is_esi_applicable
                            ? `ESIC deductions will be applied (Upper Cap: ₹${formData.esi_upper_cap})`
                            : "No ESIC deductions will be applied"}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.is_esi_applicable}
                            onChange={(e) =>
                              updateFormData({
                                is_esi_applicable: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span
                          className={`text-[11px] font-bold tracking-widest ${formData.is_esi_applicable ? "text-blue-600" : "text-gray-400"}`}
                        >
                          {formData.is_esi_applicable ? "YES" : "NO"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {formLoading || initialSalaryLoading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <EditableSalaryTable
                  earningComponents={earningComponents}
                  earningValues={earningValues}
                  calculationResults={calculationResults}
                  onValueChange={handleEarningValueChange}
                  formErrors={errors}
                />
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase size={28} className="text-blue-600" />
                </div>
                <h4 className="text-slate-800 font-medium mb-2">
                  Default Structure Applied
                </h4>
                <p className="text-slate-500 text-sm">
                  This worker will be assigned the default salary structure
                  mapped to their designation. Enable the toggle above to define
                  a specific structure just for this worker.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleResetForm}
            disabled={loading}
            className="border px-6 py-2 rounded-lg text-slate-600 bg-gray-50 hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="border px-6 py-2 rounded-lg text-slate-600 bg-gray-50 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:brightness-105 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>{" "}
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </motion.div>
      </motion.form>
    </>
  );
};

export default SingleAddWorkerForm;
