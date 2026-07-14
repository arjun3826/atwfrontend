import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Edit2,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Building,
  Building2,
  Users,
  Filter,
  Download,
  ChevronRight,
  Files,
  FileSpreadsheet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  containerVariants,
  itemVariants,
  tableRowVariants,
} from "../../../../common/utils/motionVariants";
import { useCompanyListing } from "../../adminhooks/useCompanyListing";
import CompanyViewModal from "../../components/company/ViewCompanyModal";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAdminPermissions } from "../../../../common/hooks/useAdminPermissions";
import { getIndustriesAPI } from "../../../../api/admin/adminCompanyAPI";
import {
  getStatesAPI,
  getCitiesByStateAPI,
} from "../../../../api/admin/adminStaffAPI";
import {
  getAgentsListAPI,
  getStaffListAPI,
} from "../../../../api/admin/adminCompanyAPI";

import { useDateRangeFilter } from "../../../../common/hooks/useDateRangeFilter";
import DateRangeDropdown from "../../../../common/components/DateRangeDropdown.jsx";

const CompanyListing = () => {
  const navigate = useNavigate();
  const { hasPermission, loading: permissionsLoading } = useAdminPermissions();
  const {
    companies,
    loading,
    page,
    totalPages,
    setPage,
    filters,
    defaultFilters,
    setFilters,
    totalRecords,
    handleSearch,
    handleDelete,
    handleToggleStatus,
    handleExportDownload,
    handleSaveCommission,
  } = useCompanyListing();

  const {
    dateRange,
    applyPreset,
    setCustomRange,
    presets,
    formatDateForDisplay,
  } = useDateRangeFilter();
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showCompanyTypeDropdown, setShowCompanyTypeDropdown] = useState(false);
  const [companyType, setCompanyType] = useState("all");
  const [industrySearch, setIndustrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  // Commission modal states
  const [commissionModal, setCommissionModal] = useState(false);
  const [commissionValue, setCommissionValue] = useState("");
  const [commissionType, setCommissionType] = useState("fixed");

  const [agents, setAgents] = useState([]);
  const [rms, setRms] = useState([]);

  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [showRmDropdown, setShowRmDropdown] = useState(false);

  const [agentSearch, setAgentSearch] = useState("");
  const [rmSearch, setRmSearch] = useState("");

  const agentRef = useRef(null);
  const rmRef = useRef(null);
  const industryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const companyTypeRef = useRef(null);

  const companyTypeOptions = [
    { key: "all", label: "All Companies" },
    { key: "1", label: "Active Companies" },
    { key: "0", label: "Inactive Companies" },
    { key: "incomplete", label: "Incomplete Companies" },
  ];

  // Fetch states
  const fetchStates = async () => {
    try {
      const response = await getStatesAPI();
      setStates(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch states:", error);
      setStates([]);
    }
  };

  // Fetch cities by state
  const fetchCitiesByState = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    try {
      setLoadingCities(true);
      const response = await getCitiesByStateAPI(stateId);
      setCities(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };
  const fetchAgents = async () => {
    try {
      const res = await getAgentsListAPI();

      setAgents(res.data?.data || res.data || []);
    } catch (err) {
      setAgents([]);
    }
  };

  const fetchRMs = async () => {
    try {
      const res = await getStaffListAPI();

      setRms(res.data?.data || res.data || []); // ✅ FIX
    } catch (err) {
      setRms([]);
    }
  };
  // Fetch industries
  const fetchIndustries = async () => {
    try {
      const response = await getIndustriesAPI();
      setIndustries(response.data || []);
    } catch (error) {
      console.error("Failed to fetch industries:", error);
      setIndustries([]);
    }
  };

  // Handle state selection
  const handleStateSelect = async (state) => {
    setFilters({
      ...filters,
      state: state.name,
      state_id: state.id,
      city: "",
      city_id: "",
    });
    setStateSearch("");
    setShowStateDropdown(false);
    await fetchCitiesByState(state.id);
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    setFilters({
      ...filters,
      city: city.name,
      city_id: city.id,
    });
    setCitySearch("");
    setShowCityDropdown(false);
  };

  const handleDateRangeChange = (range) => {
    if (range.preset === "custom") {
      setCustomRange(range.from, range.to);
    } else {
      applyPreset(range.preset);
    }

    setFilters((prev) => ({
      ...prev,
      dor_from: range.from || "",
      dor_to: range.to || "",
    }));

    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  // Reset all filters
  const handleClear = () => {
    setFilters(defaultFilters);
    setCompanyType("all");
    const allPreset = presets.find((p) => p.id === "all");
    if (allPreset) {
      const range = allPreset.action();
      applyPreset("all");
      setFilters((prev) => ({
        ...prev,
        dor_from: range.from || "",
        dor_to: range.to || "",
      }));
    }
    setPage(1);
  };

  // Handle click outside
  const handleClickOutside = useCallback((event) => {
    if (industryRef.current && !industryRef.current.contains(event.target)) {
      setShowIndustryDropdown(false);
      setIndustrySearch("");
    }
    if (stateRef.current && !stateRef.current.contains(event.target)) {
      setShowStateDropdown(false);
      setStateSearch("");
    }
    if (cityRef.current && !cityRef.current.contains(event.target)) {
      setShowCityDropdown(false);
      setCitySearch("");
    }
    if (agentRef.current && !agentRef.current.contains(event.target)) {
      setShowAgentDropdown(false);
      setAgentSearch("");
    }

    if (rmRef.current && !rmRef.current.contains(event.target)) {
      setShowRmDropdown(false);
      setRmSearch("");
    }
    if (
      companyTypeRef.current &&
      !companyTypeRef.current.contains(event.target)
    ) {
      setShowCompanyTypeDropdown(false);
    }
  }, []);
  const closeAllDropdowns = () => {
    setShowDateDropdown(false);
    setShowIndustryDropdown(false);
    setShowStateDropdown(false);
    setShowCityDropdown(false);
    setShowAgentDropdown(false);
    setShowRmDropdown(false);
    setShowCompanyTypeDropdown(false);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    fetchIndustries();
    fetchStates();
    fetchAgents();
    fetchRMs();
  }, []);

  useEffect(() => {
    if (filters.state_id) {
      fetchCitiesByState(filters.state_id);
    } else {
      setCities([]);
    }
  }, [filters.state_id]);

  const openViewModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };

  const handleExportClick = async () => {
    try {
      setIsExporting(true);
      await handleExportDownload();
    } finally {
      setIsExporting(false);
    }
  };

  // Open commission modal and prefill data
  const openCommissionModal = (company) => {
    setSelectedCompany(company);
    setCommissionValue(company.agent_charge || "");
    setCommissionType(company.agent_charge_type || "fixed");
    setCommissionModal(true);
  };

  // Check permissions
  const canView = hasPermission("companies", "view");
  const canCreate = hasPermission("companies", "create");
  const canEdit = hasPermission("companies", "edit");
  const canDelete = hasPermission("companies", "delete");
  const canExport = hasPermission("companies", "export");
  const jobOpenings = hasPermission("companies", "view_jobs");
  const canToggleStatus = hasPermission("companies", "toggle_status");
  const canViewDocuments = hasPermission("companies", "view_documents");
  const canViewSalarySheets = hasPermission("reports", "salary_sheets");
  const canManageCompanyWorkers = hasPermission(
    "companies",
    "manage_company_workers",
  );
  if (!permissionsLoading && !canView) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <Building2 className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to view companies.
          </p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* HEADER WITH FILTER TOGGLE */}
      <motion.div
        className={`bg-white p-4 border border-gray-200 shadow-sm ${
          filtersVisible ? "rounded-t-2xl border-b-0" : "mb-4 rounded-2xl"
        }`}
        variants={itemVariants}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
          <div ref={companyTypeRef} className="relative w-full md:w-auto">
            <button
              onClick={() =>
                setShowCompanyTypeDropdown(!showCompanyTypeDropdown)
              }
              className="flex items-center justify-between space-x-4 text-2xl !font-bold px-4 py-2 border border-gray-300 rounded-lg bg-white border-none hover:border-none"
            >
              <span className="text-gray-800">
                {companyTypeOptions.find((o) => o.key === companyType)?.label}
              </span>
              <ChevronRight
                className={`w-5 h-5 !stroke-[3px] stroke-black transition-transform ${
                  showCompanyTypeDropdown ? "rotate-90" : ""
                }`}
              />
            </button>

            {showCompanyTypeDropdown && (
              <div className="absolute !w-64 z-50 mt-0 ml-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {companyTypeOptions.map((option) => (
                  <div
                    key={option.key}
                    onClick={() => {
                      setCompanyType(option.key);
                      setShowCompanyTypeDropdown(false);
                      setFilters((prev) => ({
                        ...prev,
                        company_type: option.key === "all" ? "" : option.key,
                      }));
                      setTimeout(() => {
                        handleSearch();
                      }, 100);
                    }}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm
                      hover:bg-gray-100
                      ${
                        companyType === option.key
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700"
                      }`}
                  >
                    <span>{option.label}</span>
                    {companyType === option.key && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name"
              value={filters.companyname || ""}
              onChange={(e) =>
                setFilters({ ...filters, companyname: e.target.value })
              }
              className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {!filtersVisible && filters.companyname && (
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                filtersVisible
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {canExport && (
              <button
                onClick={handleExportClick}
                disabled={isExporting || loading}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isExporting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export as Excel</span>
                  </>
                )}
              </button>
            )}

            {canCreate && (
              <button
                onClick={() => navigate("/admin/company/add")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New Company</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* FILTER SECTION */}
      {filtersVisible && (
        <motion.div
          className="bg-white p-4 mb-4 rounded-b-2xl border border-gray-200 shadow-sm"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                FILTER BY :
              </div>
              <button
                onClick={handleClear}
                className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-3 items-start">
              <div className="relative w-56">
                <DateRangeDropdown
                  showDateDropdown={showDateDropdown}
                  setShowDateDropdown={setShowDateDropdown}
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                  presets={presets}
                  applyPreset={applyPreset}
                  formatDateForDisplay={formatDateForDisplay}
                />
              </div>

              {/* Industry Filter Dropdown */}
              <div
                ref={industryRef}
                className="relative w-48"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Briefcase
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={
                      showIndustryDropdown
                        ? industrySearch
                        : filters.industry || ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setIndustrySearch(value);

                      closeAllDropdowns();
                      setShowIndustryDropdown(true);
                    }}
                    onFocus={() => {
                      closeAllDropdowns();
                      setShowIndustryDropdown(true);
                    }}
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search industry"
                  />
                </div>

                {showIndustryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {industries.length > 0 ? (
                      <>
                        <div
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                            !filters.industry ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            setFilters({ ...filters, industry: "" });
                            setIndustrySearch("");
                            setShowIndustryDropdown(false);
                          }}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              All Industries
                            </span>
                            {!filters.industry && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                        {industries
                          .filter(
                            (industry) =>
                              !industrySearch ||
                              industry.name
                                .toLowerCase()
                                .includes(industrySearch.toLowerCase()),
                          )
                          .map((industry) => (
                            <div
                              key={industry.id}
                              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                filters.industry === industry.name
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                              onClick={() => {
                                setFilters({
                                  ...filters,
                                  industry: industry.name,
                                });
                                setIndustrySearch("");
                                setShowIndustryDropdown(false);
                              }}
                            >
                              <div className="flex items-center justify-between text-sm">
                                <span>{industry.name}</span>
                                {filters.industry === industry.name && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        {industrySearch &&
                          industries.filter((industry) =>
                            industry.name
                              .toLowerCase()
                              .includes(industrySearch.toLowerCase()),
                          ).length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-center border-t border-gray-200 text-sm">
                              No industries found for "{industrySearch}"
                            </div>
                          )}
                      </>
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-center text-sm">
                        Loading industries...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* State Filter Dropdown */}
              <div
                ref={stateRef}
                className="relative w-40"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={
                      showStateDropdown ? stateSearch : filters.state || ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setStateSearch(value);

                      closeAllDropdowns();
                      setShowStateDropdown(true);
                    }}
                    onFocus={() => {
                      closeAllDropdowns();
                      setStateSearch("");
                      setShowStateDropdown(true);
                    }}
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search state"
                  />
                </div>

                {showStateDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {states.length > 0 ? (
                      <>
                        <div
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                            !filters.state_id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            setFilters({
                              ...filters,
                              state: "",
                              state_id: "",
                              city: "",
                              city_id: "",
                            });
                            setStateSearch("");
                            setShowStateDropdown(false);
                          }}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">All States</span>
                            {!filters.state_id && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                        {states
                          .filter(
                            (state) =>
                              !stateSearch ||
                              state.name
                                .toLowerCase()
                                .includes(stateSearch.toLowerCase()),
                          )
                          .map((state) => (
                            <div
                              key={state.id}
                              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                filters.state_id === state.id
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                              onClick={() => handleStateSelect(state)}
                            >
                              <div className="flex items-center justify-between text-sm">
                                <span>{state.name}</span>
                                {filters.state_id === state.id && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        {stateSearch &&
                          states.filter((state) =>
                            state.name
                              .toLowerCase()
                              .includes(stateSearch.toLowerCase()),
                          ).length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-center border-t border-gray-200 text-sm">
                              No states found for "{stateSearch}"
                            </div>
                          )}
                      </>
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-center text-sm">
                        Loading states...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* City Filter Dropdown */}
              <div
                ref={cityRef}
                className="relative w-40"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={showCityDropdown ? citySearch : filters.city || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCitySearch(value);

                      closeAllDropdowns();
                      setShowCityDropdown(true);
                    }}
                    onFocus={() => {
                      if (filters.state_id) {
                        closeAllDropdowns();
                        setCitySearch("");
                        setShowCityDropdown(true);
                      }
                    }}
                    disabled={!filters.state_id}
                    className={`w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      !filters.state_id ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder={
                      !filters.state_id ? "Select state first" : "Search city"
                    }
                  />
                  {loadingCities && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {showCityDropdown && filters.state_id && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {cities.length > 0 ? (
                      <>
                        <div
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                            !filters.city_id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            setFilters({
                              ...filters,
                              city: "",
                              city_id: "",
                            });
                            setCitySearch("");
                            setShowCityDropdown(false);
                          }}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">All Cities</span>
                            {!filters.city_id && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                        {cities
                          .filter(
                            (city) =>
                              !citySearch ||
                              city.name
                                .toLowerCase()
                                .includes(citySearch.toLowerCase()),
                          )
                          .map((city) => (
                            <div
                              key={city.id}
                              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                filters.city_id === city.id ? "bg-blue-50" : ""
                              }`}
                              onClick={() => handleCitySelect(city)}
                            >
                              <div className="flex items-center justify-between text-sm">
                                <span>{city.name}</span>
                                {filters.city_id === city.id && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        {citySearch &&
                          cities.filter((city) =>
                            city.name
                              .toLowerCase()
                              .includes(citySearch.toLowerCase()),
                          ).length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-center border-t border-gray-200 text-sm">
                              No cities found for "{citySearch}"
                            </div>
                          )}
                      </>
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-center text-sm">
                        {loadingCities
                          ? "Loading cities..."
                          : "No cities found for this state"}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div ref={agentRef} className="relative w-48">
                <input
                  type="text"
                  placeholder="Search agent"
                  value={
                    showAgentDropdown ? agentSearch : filters.agent_name || ""
                  }
                  onChange={(e) => {
                    setAgentSearch(e.target.value);

                    closeAllDropdowns();
                    setShowAgentDropdown(true);
                  }}
                  onFocus={() => {
                    closeAllDropdowns();
                    setAgentSearch("");
                    setShowAgentDropdown(true);
                  }}
                  className="w-full px-3 py-1.5 border rounded-lg text-sm"
                />

                {showAgentDropdown && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFilters({
                          ...filters,
                          agent_id: "",
                          agent_name: "",
                        });
                        setShowAgentDropdown(false);
                      }}
                    >
                      All Agents
                    </div>

                    {agents
                      .filter(
                        (a) =>
                          !agentSearch ||
                          a.name
                            ?.toLowerCase()
                            .includes(agentSearch.toLowerCase()),
                      )
                      .map((agent) => (
                        <div
                          key={agent.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFilters({
                              ...filters,
                              agent_id: agent.id,
                              agent_name: agent.name,
                            });
                            setShowAgentDropdown(false);

                            setTimeout(() => handleSearch(), 100);
                          }}
                        >
                          {agent.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div ref={rmRef} className="relative w-48">
                <input
                  type="text"
                  placeholder="Search RM"
                  value={showRmDropdown ? rmSearch : filters.rm_name || ""}
                  onChange={(e) => {
                    setRmSearch(e.target.value);

                    closeAllDropdowns();
                    setShowRmDropdown(true);
                  }}
                  onFocus={() => {
                    closeAllDropdowns();
                    setRmSearch("");
                    setShowRmDropdown(true);
                  }}
                  className="w-full px-3 py-1.5 border rounded-lg text-sm"
                />

                {showRmDropdown && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFilters({ ...filters, rm_id: "", rm_name: "" });
                        setShowRmDropdown(false);
                      }}
                    >
                      All RM
                    </div>

                    {rms
                      .filter(
                        (r) =>
                          !rmSearch ||
                          r.name
                            ?.toLowerCase()
                            .includes(rmSearch.toLowerCase()),
                      )
                      .map((rm) => (
                        <div
                          key={rm.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFilters({
                              ...filters,
                              rm_id: rm.id,
                              rm_name: rm.name,
                            });
                            setShowRmDropdown(false);

                            setTimeout(() => handleSearch(), 100); // 🔥 trigger search
                          }}
                        >
                          {rm.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* MAIN TABLE */}
      <motion.div
        className="bg-white rounded-[22px] border border-[#DDDDDD] shadow-sm overflow-hidden"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Company List</h2>
          <h2 className="flex items-center justify-between gap-1 text-lg font-medium text-gray-800">
            <p>Total Companies : </p> {totalRecords}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Company Name & Code",
                  "No. of Active Jobs",
                  "Contact Person",
                  "Industry",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center">
                      <Building className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-600">
                        No companies found.
                      </p>
                      <p className="text-sm mt-1 text-gray-400">
                        Create your first company by clicking "Add New Company"
                        above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                companies.map((company, index) => (
                  <motion.tr
                    key={`${company.id}-${index}`}
                    className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openViewModal(company)}
                  >
                    <td className="px-6 cursor-pointer  py-4 text-sm text-gray-900 font-medium">
                      {company.company_name} - {company.company_code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <td>{company.active_jobs_count || 0}</td>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {company.company_owner?.owner_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-medium text-blue-600">
                        {company.industry?.name || "Not specified"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          company.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {company.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-4 cursor-auto"
                    >
                      <div className="flex gap-3">
                        {canView && (
                          <button
                            onClick={() => openViewModal(company)}
                            className="text-gray-600 hover:text-green-600"
                            title="View Company"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() =>
                              navigate(`/admin/company/edit/${company.id}`)
                            }
                            className="text-gray-600 hover:text-blue-600"
                            title="Edit Company"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(company.id)}
                            className="text-gray-600 hover:text-red-600"
                            title="Delete Company"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        {jobOpenings && (
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/company/job-openings/${company.id}/`,
                                {
                                  state: { companyName: company.company_name },
                                },
                              )
                            }
                            className="text-gray-600 hover:text-purple-600 flex items-center gap-1"
                            title="Job Openings"
                          >
                            <Briefcase size={18} />
                          </button>
                        )}
                        {canViewDocuments && (
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/company/view-documents/${company.id}/`,
                                {
                                  state: {
                                    companyName: company.company_name,
                                    company: company,
                                  },
                                },
                              )
                            }
                            className="text-gray-600 hover:text-teal-600 flex items-center gap-1"
                            title="View Documents"
                          >
                            <Files size={18} />
                          </button>
                        )}
                        {canManageCompanyWorkers && (
                          <button
                            onClick={() =>
                              navigate(`/admin/all-workers/${company.id}`, {
                                state: {
                                  companyName: company.company_name,
                                  company: company,
                                },
                              })
                            }
                            className="text-gray-600 hover:text-indigo-600 flex items-center gap-1"
                            title="All Workers"
                          >
                            <Users size={18} />
                          </button>
                        )}
                        {canViewSalarySheets && (
                          <button
                            onClick={() =>
                              navigate(`/admin/company/salary-sheets`, {
                                state: {
                                  companyId: company.id,
                                  companyName: company.company_name,
                                },
                              })
                            }
                            className="text-gray-600 hover:text-green-600 flex items-center gap-1"
                            title="Salary Sheets"
                          >
                            <FileSpreadsheet size={18} />
                          </button>
                        )}
                        {/* Commission Button */}
                        {/* <button
                          onClick={() => openCommissionModal(company)}
                          disabled={!company.agent}
                          className={`text-gray-600 hover:text-orange-600 ${
                            !company.agent
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title={
                            company.agent ? "Set Commission" : "No Agent Assigned"
                          }
                        >
                          <Handshake  size={18}/>
                        </button> */}
                        {canToggleStatus && (
                          <button
                            onClick={() =>
                              handleToggleStatus(company.id, company.status)
                            }
                            className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1
                              ${
                                company.status
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                            title={
                              company.status
                                ? "Deactivate Company"
                                : "Activate Company"
                            }
                          >
                            {company.status ? (
                              <>
                                <XCircle size={16} />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} />
                                Activate
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* PAGINATION */}
      {companies.length > 0 && (
        <motion.div className="flex items-center justify-center space-x-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition 
              ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const p = index + 1;
            if (
              p === 1 ||
              p === totalPages ||
              (p >= page - 1 && p <= page + 1)
            ) {
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm shadow-sm transition
                    ${
                      page === p
                        ? "bg-black text-white"
                        : "bg-white hover:bg-black hover:text-white"
                    }`}
                >
                  {p}
                </button>
              );
            }
            if (p === page - 3 || p === page + 3) {
              return (
                <span key={p} className="px-2">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition 
              ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
          >
            Next
          </button>
        </motion.div>
      )}

      {/* COMMISSION MODAL */}
      {commissionModal && selectedCompany && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setCommissionModal(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                Agent Commission
              </h2>
              <button
                onClick={() => setCommissionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Agent Details Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  Agent Details
                </h3>
                {selectedCompany.agent ? (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm border border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agent Code:</span>
                      <span className="font-medium text-gray-900">
                        {selectedCompany.agent.agent_code || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">
                        {selectedCompany.agent.agent_name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">
                        {selectedCompany.agent.agent_email || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium text-gray-900">
                        {selectedCompany.agent.agent_phone || "N/A"}
                      </span>
                    </div>
                    {/* Agent Location - added */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agent Location:</span>
                      <span className="font-medium text-gray-900">
                        {selectedCompany.agent.agent_location || "Not provided"}
                      </span>
                    </div>
                    {/* Work Location - added */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Work Location:</span>
                      <span className="font-medium text-gray-900">
                        {selectedCompany.agent.work_location || "Not provided"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
                    No agent assigned to this company.
                  </div>
                )}
              </div>

              {/* Commission Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  Set Commission
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commission Amount
                    </label>
                    <input
                      type="number"
                      value={commissionValue}
                      onChange={(e) => setCommissionValue(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter commission value"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commission Type
                    </label>
                    <select
                      value={commissionType}
                      onChange={(e) => setCommissionType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="fixed">Fixed (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setCommissionModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSaveCommission(
                    selectedCompany,
                    commissionValue,
                    commissionType,
                  );
                  setCommissionModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Save Commission
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* VIEW MODAL */}
      <CompanyViewModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={closeViewModal}
      />
    </motion.div>
  );
};

export default CompanyListing;
