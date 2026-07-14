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
  User,
  Download,
  Building2,
  Filter,
  ChevronRight,
  Files,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  containerVariants,
  itemVariants,
  tableRowVariants,
} from "../../../../common/utils/motionVariants";
import { useWorkerListing } from "../../adminhooks/useWorkerListing";
import WorkerViewModal from "../../components/worker/ViewWorkerModal";
import WorkerCommentsModal from "../../components/worker/WorkerCommentsModal";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAdminPermissions } from "../../../../common/hooks/useAdminPermissions";
import {
  getDesignationsAPI,
  getStatesAPI,
  getCitiesByStateAPI,
  getAgentsListAPI,
  getStaffListAPI,
} from "../../../../api/admin/adminWorkerAPI";
import { getIndustriesAPI } from "../../../../api/admin/adminCompanyAPI";
import { useDateRangeFilter } from "../../../../common/hooks/useDateRangeFilter";
import DateRangeDropdown from "../../../../common/components/DateRangeDropdown.jsx";

const WorkerListing = () => {
  const navigate = useNavigate();
  const { hasPermission, loading: permissionsLoading } = useAdminPermissions();

  const {
    workers,
    loading,
    page,
    totalPages,
    setPage,
    filters,
    setFilters,
    totalRecords,
    handleSearch,
    handleClear,
    handleDelete,
    handleToggleStatus,
    handleExportDownload,
  } = useWorkerListing();

  const {
    dateRange,
    applyPreset,
    setCustomRange,
    presets,
    formatDateForDisplay,
  } = useDateRangeFilter();
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedWorkerForComments, setSelectedWorkerForComments] =
    useState(null);

  const [designations, setDesignations] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [designationsLoading, setDesignationsLoading] = useState(false);

  const [industries, setIndustries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [industrySearch, setIndustrySearch] = useState("");
  const [designationSearch, setDesignationSearch] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);

  const [staffList, setStaffList] = useState([]);
  const [staffSearch, setStaffSearch] = useState("");
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const staffRef = useRef(null);

  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showWorkerTypeDropdown, setShowWorkerTypeDropdown] = useState(false);
  const [workerType, setWorkerType] = useState("all");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [agents, setAgents] = useState([]);
  const [agentSearch, setAgentSearch] = useState("");
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const agentRef = useRef(null);

  const designationRef = useRef(null);
  const industryRef = useRef(null);
  const workerTypeRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);

  const workerTypeOptions = [
    { key: "all", label: "All Workers" },
    { key: "1", label: "Active Workers" },
    { key: "0", label: "Inactive Workers" },
    { key: "incomplete", label: "Incomplete Workers" },
  ];

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

  const fetchAgents = async () => {
    try {
      const res = await getAgentsListAPI();
      setAgents(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
      setAgents([]);
    }
  };

  const fetchStaffList = async () => {
    try {
      const response = await getStaffListAPI();
      let staffData = [];
      if (response?.data?.data && Array.isArray(response.data.data)) {
        staffData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        staffData = response.data;
      } else if (Array.isArray(response)) {
        staffData = response;
      }
      setStaffList(staffData);
    } catch (error) {
      console.error("Failed to fetch staff list:", error);
      setStaffList([]);
    }
  };

  const fetchDesignations = async (industryId) => {
    setDesignationsLoading(true);
    try {
      const response = await getDesignationsAPI(industryId, { per_page: 1000 });
      let designationsArray = [];
      if (response.data && Array.isArray(response.data.data.data)) {
        designationsArray = response.data.data.data;
      } else if (Array.isArray(response.data.data)) {
        designationsArray = response.data.data;
      } else {
        designationsArray = [];
      }
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

  const fetchStates = async () => {
    try {
      const response = await getStatesAPI();
      setStates(response.data || []);
    } catch (error) {
      console.error("Failed to fetch states:", error);
      setStates([]);
    }
  };

  const fetchCitiesByState = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    try {
      setLoadingCities(true);
      const response = await getCitiesByStateAPI(stateId);
      setCities(response.data || []);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
    fetchStates();
    fetchAgents();
    fetchStaffList();
  }, []);

  useEffect(() => {
    if (filters.industry_id) {
      fetchDesignations(filters.industry_id);
    }
  }, [filters.industry_id]);

  useEffect(() => {
    if (filters.state_id) {
      fetchCitiesByState(filters.state_id);
    } else {
      setCities([]);
    }
  }, [filters.state_id]);

  const filteredDesignationsList = filteredDesignations.filter((d) =>
    d.name.toLowerCase().includes(designationSearch.toLowerCase()),
  );

  const filteredIndustries = industries.filter((i) =>
    i.name.toLowerCase().includes(industrySearch.toLowerCase()),
  );

  const handleDesignationSelect = (designation) => {
    setFilters({
      ...filters,
      designation: designation.name,
      designation_id: designation.id,
    });
    setShowDesignationDropdown(false);
    setDesignationSearch("");
  };

  const handleIndustrySelect = (industry) => {
    setFilters({
      ...filters,
      industry: industry.name,
      industry_id: industry.id,
      designation: "",
      designation_id: "",
    });
    setShowIndustryDropdown(false);
    setIndustrySearch("");
  };

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

  const handleCitySelect = (city) => {
    setFilters({
      ...filters,
      city: city.name,
      city_id: city.id,
    });
    setCitySearch("");
    setShowCityDropdown(false);
  };

  const handleStaffSelect = (staff) => {
    setFilters({
      ...filters,
      staff_code: staff.staff_code,
    });
    setStaffSearch("");
    setShowStaffDropdown(false);
    setTimeout(handleSearch, 100);
  };

  const handleDateRangeChange = (range) => {
    if (range.preset === "custom") {
      setCustomRange(range.from, range.to);
    } else {
      applyPreset(range.preset);
    }
    setFilters((prev) => ({
      ...prev,
      joining_date_from: range.from || "",
      joining_date_to: range.to || "",
    }));
    setTimeout(() => handleSearch(), 100);
  };

  const handleClearAll = () => {
    setFilters({
      worker_name: "",
      worker_code: "",
      department: "",
      designation: "",
      work_location: "",
      joining_date_from: "",
      joining_date_to: "",
      status: "",
      worker_type: "",
      industry: "",
      industry_id: "",
      state: "",
      state_id: "",
      city: "",
      city_id: "",
      agent_id: "",
      agent_name: "",
      staff_code: "",
    });
    const allPreset = presets.find((p) => p.id === "all");
    if (allPreset) applyPreset("all");
    setShowWorkerTypeDropdown(false);
    setWorkerType("all");
    handleSearch();
  };

  const handleClickOutside = useCallback((event) => {
    if (workerTypeRef.current && !workerTypeRef.current.contains(event.target))
      setShowWorkerTypeDropdown(false);
    if (
      designationRef.current &&
      !designationRef.current.contains(event.target)
    ) {
      setShowDesignationDropdown(false);
      setDesignationSearch("");
    }
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
    if (staffRef.current && !staffRef.current.contains(event.target)) {
      setShowStaffDropdown(false);
      setStaffSearch("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const openViewModal = (worker) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedWorker(null);
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

  // ✅ Comments modal handlers
  const openCommentsModal = (worker) => {
    setSelectedWorkerForComments(worker);
    setIsCommentsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setSelectedWorkerForComments(null);
    setIsCommentsModalOpen(false);
  };
  const closeAllDropdowns = () => {
    setShowDateDropdown(false);
    setShowIndustryDropdown(false);
    setShowStateDropdown(false);
    setShowCityDropdown(false);
    setShowAgentDropdown(false);
    // setShowRmDropdown(false);
    setShowStaffDropdown(false); // 👈 add this
    // setShowCompanyTypeDropdown(false);
  };
  const canView = hasPermission("workers", "view");
  const canCreate = hasPermission("workers", "create");
  const canEdit = hasPermission("workers", "edit");
  const canDelete = hasPermission("workers", "delete");
  const canExport = hasPermission("workers", "export");
  const canToggleStatus = hasPermission("workers", "toggle_status");
  const canViewDocuments = hasPermission("workers", "view_documents");
  const canViewComments = hasPermission("workers", "view_comments");
  const canViewWallet = hasPermission("workers", "view_wallet");

  if (!permissionsLoading && !canView) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <User className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to view workers.
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
        className={`bg-white p-4 border border-gray-200 shadow-sm ${filtersVisible ? "rounded-t-2xl border-b-0" : "mb-4 rounded-2xl"}`}
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div ref={workerTypeRef} className="relative w-full md:w-auto">
            <button
              onClick={() => setShowWorkerTypeDropdown(!showWorkerTypeDropdown)}
              className="flex w-full md:w-auto items-center justify-between gap-4 text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-white"
            >
              <span className="text-gray-800 truncate">
                {workerTypeOptions.find((o) => o.key === workerType)?.label}
              </span>
              <ChevronRight
                className={`w-5 h-5 !stroke-[3px] stroke-black transition-transform ${showWorkerTypeDropdown ? "rotate-90" : ""}`}
              />
            </button>
            {showWorkerTypeDropdown && (
              <div className="absolute left-0 mt-2 w-full sm:w-56 md:w-64 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {workerTypeOptions.map((option) => (
                  <div
                    key={option.key}
                    onClick={() => {
                      setWorkerType(option.key);
                      setShowWorkerTypeDropdown(false);
                      setFilters((prev) => ({
                        ...prev,
                        worker_type: option.key === "all" ? "" : option.key,
                      }));
                      setTimeout(handleSearch, 100);
                    }}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${workerType === option.key ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
                  >
                    <span>{option.label}</span>
                    {workerType === option.key && (
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
              placeholder="Search by name & code..."
              value={filters.worker_name || ""}
              onChange={(e) =>
                setFilters({ ...filters, worker_name: e.target.value })
              }
              className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {!filtersVisible && filters.worker_name && (
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${filtersVisible ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"}`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            {canExport && (
              <button
                onClick={handleExportClick}
                disabled={isExporting || loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${isExporting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export as Excel</span>
                    <span className="sm:hidden">Export</span>
                  </>
                )}
              </button>
            )}
            {canCreate && (
              <button
                onClick={() => navigate("/admin/worker/add")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New Worker</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* FILTER SECTION (unchanged) */}
      {filtersVisible && (
        <motion.div
          className="bg-white p-4 mb-4 rounded-b-2xl border border-gray-200 shadow-sm"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ... keep existing filter UI ... */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                FILTER BY :
              </div>
              <button
                onClick={handleClearAll}
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
              {/* Industry Filter */}
              <div
                ref={industryRef}
                className="relative w-48"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Building2
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
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Search industry"
                  />
                </div>
                {showIndustryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${!filters.industry ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          industry: "",
                          industry_id: "",
                          designation: "",
                          designation_id: "",
                        });
                        setIndustrySearch("");
                        setShowIndustryDropdown(false);
                      }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">All Industries</span>
                        {!filters.industry && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    {filteredIndustries.map((industry) => (
                      <div
                        key={industry.id}
                        className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${filters.industry === industry.name ? "bg-blue-50" : ""}`}
                        onClick={() => handleIndustrySelect(industry)}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span>{industry.name}</span>
                          {filters.industry === industry.name && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    {industrySearch && filteredIndustries.length === 0 && (
                      <div className="px-3 py-2 text-gray-500 text-center border-t text-sm">
                        No industries found for "{industrySearch}"
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Designation Filter */}
              <div
                ref={designationRef}
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
                      showDesignationDropdown
                        ? designationSearch
                        : filters.designation || ""
                    }
                    onChange={(e) => {
                      setDesignationSearch(e.target.value);
                      setShowDesignationDropdown(true);
                    }}
                    onFocus={() => {
                      setDesignationSearch("");
                      setShowDesignationDropdown(true);
                    }}
                    className={`w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!filters.industry_id && "cursor-not-allowed"}`}
                    placeholder={
                      filters.industry_id
                        ? "Search designation"
                        : "Search designation"
                    }
                    disabled={!filters.industry_id}
                  />
                </div>
                {!filters.industry_id && (
                  <p className="text-xs text-gray-500 mt-1 ml-1">
                    * select industry first
                  </p>
                )}
                {showDesignationDropdown && filters.industry_id && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {designationsLoading ? (
                      <div className="px-3 py-2 text-gray-500 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      <>
                        <div
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${!filters.designation ? "bg-blue-50" : ""}`}
                          onClick={() => {
                            setFilters({
                              ...filters,
                              designation: "",
                              designation_id: "",
                            });
                            setDesignationSearch("");
                            setShowDesignationDropdown(false);
                          }}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              All Designations
                            </span>
                            {!filters.designation && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                        {filteredDesignationsList.map((designation) => (
                          <div
                            key={designation.id}
                            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${filters.designation === designation.name ? "bg-blue-50" : ""}`}
                            onClick={() => handleDesignationSelect(designation)}
                          >
                            <div className="flex items-center justify-between text-sm">
                              <span>{designation.name}</span>
                              {filters.designation === designation.name && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                          </div>
                        ))}
                        {designationSearch &&
                          filteredDesignationsList.length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-center border-t text-sm">
                              No designations found for "{designationSearch}"
                            </div>
                          )}
                      </>
                    )}
                  </div>
                )}
              </div>
              {/* State Filter */}
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
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Search state"
                  />
                </div>
                {showStateDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${!filters.state_id ? "bg-blue-50" : ""}`}
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
                        (s) =>
                          !stateSearch ||
                          s.name
                            .toLowerCase()
                            .includes(stateSearch.toLowerCase()),
                      )
                      .map((state) => (
                        <div
                          key={state.id}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${filters.state_id === state.id ? "bg-blue-50" : ""}`}
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
                      states.filter((s) =>
                        s.name
                          .toLowerCase()
                          .includes(stateSearch.toLowerCase()),
                      ).length === 0 && (
                        <div className="px-3 py-2 text-gray-500 text-center border-t text-sm">
                          No states found for "{stateSearch}"
                        </div>
                      )}
                  </div>
                )}
              </div>
              {/* City Filter */}
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
                    className={`w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!filters.state_id ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                    <div
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${!filters.city_id ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        setFilters({ ...filters, city: "", city_id: "" });
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
                        (c) =>
                          !citySearch ||
                          c.name
                            .toLowerCase()
                            .includes(citySearch.toLowerCase()),
                      )
                      .map((city) => (
                        <div
                          key={city.id}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${filters.city_id === city.id ? "bg-blue-50" : ""}`}
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
                      cities.filter((c) =>
                        c.name.toLowerCase().includes(citySearch.toLowerCase()),
                      ).length === 0 && (
                        <div className="px-3 py-2 text-gray-500 text-center border-t text-sm">
                          No cities found for "{citySearch}"
                        </div>
                      )}
                  </div>
                )}
              </div>
              {/* Agent Filter */}
              <div
                ref={agentRef}
                className="relative w-48"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
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
                    placeholder="Search agent"
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                {showAgentDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
                    <div
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${!filters.agent_id ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          agent_id: "",
                          agent_name: "",
                        });
                        setShowAgentDropdown(false);
                      }}
                    >
                      <div className="flex justify-between">
                        <span className="text-gray-500">All Agents</span>
                        {!filters.agent_id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
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
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${filters.agent_id === agent.id ? "bg-blue-50" : ""}`}
                          onClick={() => {
                            setFilters({
                              ...filters,
                              agent_id: agent.id,
                              agent_name: agent.name,
                            });
                            setShowAgentDropdown(false);
                            setTimeout(handleSearch, 100);
                          }}
                        >
                          <div className="flex justify-between text-sm">
                            <span>{agent.name}</span>
                            {filters.agent_id === agent.id && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {/* Staff Filter */}
              <div
                ref={staffRef}
                className="relative w-48"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={
                      showStaffDropdown
                        ? staffSearch
                        : staffList.find(
                            (s) => s.staff_code === filters.staff_code,
                          )?.name || ""
                    }
                    onChange={(e) => {
                      setStaffSearch(e.target.value);

                      closeAllDropdowns();
                      setShowStaffDropdown(true);
                    }}
                    onFocus={() => {
                      closeAllDropdowns();
                      setStaffSearch("");
                      setShowStaffDropdown(true);
                    }}
                    placeholder="Search staff (RM)"
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                {showStaffDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
                    <div
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${!filters.staff_code ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        setFilters({ ...filters, staff_code: "" });
                        setShowStaffDropdown(false);
                        setTimeout(handleSearch, 100);
                      }}
                    >
                      <div className="flex justify-between">
                        <span className="text-gray-500">All Staff</span>
                        {!filters.staff_code && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    {staffList
                      .filter(
                        (staff) =>
                          !staffSearch ||
                          staff.name
                            ?.toLowerCase()
                            .includes(staffSearch.toLowerCase()),
                      )
                      .map((staff) => (
                        <div
                          key={staff.id}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${filters.staff_code === staff.staff_code ? "bg-blue-50" : ""}`}
                          onClick={() => handleStaffSelect(staff)}
                        >
                          <div className="flex justify-between text-sm">
                            <span>
                              {staff.name} ({staff.staff_code})
                            </span>
                            {filters.staff_code === staff.staff_code && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
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
          <h2 className="text-lg font-medium text-gray-800">Worker List</h2>
          <h2 className="flex items-center justify-between gap-1 text-lg font-medium text-gray-800">
            <p>Total Workers : </p> {totalRecords}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Worker Name & Code",
                  "Wallet Balance",
                  "Designation",
                  "Work Location",
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
              ) : workers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center">
                      <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-600">
                        No workers found.
                      </p>
                      <p className="text-sm mt-1 text-gray-400">
                        Create your first worker by clicking "Add New Worker"
                        above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                workers.map((worker, index) => (
                  <motion.tr
                    key={`${worker.id}-${index}`}
                    className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openViewModal(worker)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {worker.worker_name} - {worker.worker_code || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {canViewWallet ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/worker/wallet/${worker.id}`);
                          }}
                          className="text-amber-600 font-semibold hover:underline"
                        >
                          {worker.wallet_balance || "0.00"}
                        </button>
                      ) : (
                        <span>{worker.wallet_balance || "0.00"}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {worker.designation || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {[worker.current_city_name, worker.current_state_name]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${worker.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {worker.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-4 cursor-auto"
                    >
                      <div className="flex gap-3">
                        {canView && (
                          <button
                            onClick={() => openViewModal(worker)}
                            className="text-gray-600 hover:text-green-600"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() =>
                              navigate(`/admin/worker/edit/${worker.id}`)
                            }
                            className="text-gray-600 hover:text-blue-600"
                            title="Edit Worker"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                        {canViewDocuments && (
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/worker/view-documents/${worker.id}/`,
                                { state: { workerName: worker.worker_name } },
                              )
                            }
                            className="text-gray-600 hover:text-teal-600 flex items-center gap-1"
                            title="View Documents"
                          >
                            <Files size={18} />
                          </button>
                        )}
                        {/* ✅ Comments Button */}
                        {canViewComments && (
                          <button
                            onClick={() => openCommentsModal(worker)}
                            className="text-gray-600 hover:text-purple-600"
                            title="View Comments"
                          >
                            <MessageCircle size={18} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(worker.id)}
                            className="text-gray-600 hover:text-red-600"
                            title="Delete Worker"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        {canToggleStatus && (
                          <button
                            onClick={() =>
                              handleToggleStatus(worker.id, worker.status)
                            }
                            className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${worker.status === "active" ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                            title={
                              worker.status === "active"
                                ? "Deactivate Worker"
                                : "Activate Worker"
                            }
                          >
                            {worker.status === "active" ? (
                              <>
                                <XCircle size={16} /> Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} /> Activate
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
      {workers.length > 0 && (
        <motion.div className="flex items-center justify-center space-x-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-black hover:text-white"}`}
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
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm shadow-sm transition ${page === p ? "bg-black text-white" : "bg-white hover:bg-black hover:text-white"}`}
                >
                  {p}
                </button>
              );
            }
            if (p === page - 3 || p === page + 3)
              return (
                <span key={p} className="px-2">
                  ...
                </span>
              );
            return null;
          })}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-black hover:text-white"}`}
          >
            Next
          </button>
        </motion.div>
      )}

      {/* MODALS */}
      {canView && (
        <WorkerViewModal
          worker={selectedWorker}
          isOpen={isModalOpen}
          onClose={closeViewModal}
          canViewWallet={canViewWallet}
        />
      )}
      {canViewComments && (
        <WorkerCommentsModal
          isOpen={isCommentsModalOpen}
          onClose={closeCommentsModal}
          workerId={selectedWorkerForComments?.id}
          workerName={selectedWorkerForComments?.worker_name}
        />
      )}
    </motion.div>
  );
};

export default WorkerListing;
