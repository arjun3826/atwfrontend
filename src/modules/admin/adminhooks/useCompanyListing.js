import { useState, useEffect, useCallback, useRef } from "react";
import {
  getCompaniesAPI,
  deleteCompanyAPI,
  toggleCompanyStatusAPI,
  exportCompaniesAPI,
  addAgentCommissionAPI,
  updateAgentCommissionAPI,
} from "../../../api/admin/adminCompanyAPI";
import { useDebounce } from "../../../common/hooks/useDebounce";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const useCompanyListing = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const isExportingRef = useRef(false);

  // Refs for AbortController and cleanup
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const defaultFilters = {
    companyname: "",
    industry: "",
    companyemail: "",
    state: "",
    state_id: "",
    city: "",
    city_id: "",
    dor_from: "",
    dor_to: "",
    status: "",
    company_type: "all",
    agent_id: "",
    rm_id: "",
    agent_name: "",
    rm_name: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const debouncedFilters = useDebounce(filters, 800);

  // Cleanup function for aborting requests
  const abortPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const fetchCompanies = useCallback(
    async (debouncedFilters) => {
      // Don't fetch if exporting
      if (isExportingRef.current) {
        return;
      }

      abortPreviousRequest();

      // Create new AbortController
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);

      try {
        const params = {
          page,
          limit,
          ...(debouncedFilters.companyname && {
            companyname: debouncedFilters.companyname,
          }),
          ...(debouncedFilters.industry && {
            industry: debouncedFilters.industry,
          }),
          ...(debouncedFilters.companyemail && {
            companyemail: debouncedFilters.companyemail,
          }),
          ...(debouncedFilters.state && { state: debouncedFilters.state }),
          ...(debouncedFilters.state_id && {
            state_id: debouncedFilters.state_id,
          }),
          ...(debouncedFilters.city && { city: debouncedFilters.city }),
          ...(debouncedFilters.city_id && {
            city_id: debouncedFilters.city_id,
          }),
          ...(debouncedFilters.agent_id && {
            agent_id: debouncedFilters.agent_id,
          }),
          ...(debouncedFilters.rm_id && {
            rm_id: debouncedFilters.rm_id,
          }),
          ...(debouncedFilters.dor_from && {
            dor_from: debouncedFilters.dor_from,
          }),
          ...(debouncedFilters.dor_to && { dor_to: debouncedFilters.dor_to }),
          ...(debouncedFilters.status && { status: debouncedFilters.status }),
          ...(debouncedFilters.company_type &&
            debouncedFilters.company_type !== "all" && {
              company_type: debouncedFilters.company_type,
            }),
        };

        // Pass signal to API call
        const response = await getCompaniesAPI(params, { signal });

        // Check if component is still mounted
        if (!isMountedRef.current) return;

        // Check if request was aborted
        if (signal.aborted) {
          return;
        }

        const data = response?.data?.data || [];

        if (response?.data) {
          setCompanies(data);
          setTotalPages(response.data.last_page || 1);
          setTotalRecords(response.data.total || 0);
        } else {
          setCompanies([]);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (error) {
        // Only handle error if not aborted and component is mounted
        if (!isMountedRef.current) return;

        // Check if error is from abort
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch companies:", error);
      } finally {
        if (isMountedRef.current && !signal.aborted) {
          setLoading(false);
        }
      }
    },
    [page, limit, abortPreviousRequest],
  );

  useEffect(() => {
    isMountedRef.current = true;

    fetchCompanies(debouncedFilters);

    return () => {
      isMountedRef.current = false;
      abortPreviousRequest();
    };
  }, [page, debouncedFilters, fetchCompanies]);

  const handleSearch = () => {
    setPage(1);
    // No need to call fetchCompanies directly, useEffect will handle it
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This company will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteCompanyAPI(id);
      if (response?.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: response?.message || "Cannot delete company",
        });

        return;
      }
      if (response?.status === 200 || response?.status === 204) {
        // Remove from list after success
        setCompanies((prev) => prev.filter((company) => company.id !== id));
        setTotalRecords((prev) => prev - 1);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The company has been successfully deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not delete the company. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const actionText = currentStatus ? "deactivate" : "activate";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `This company will be ${actionText}d.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText} it`,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await toggleCompanyStatusAPI(id, !currentStatus);

      if (response?.status === 200 || response?.status === 204) {
        // Update the status in the local state
        setCompanies((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: !currentStatus } : c)),
        );

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Company has been ${
            !currentStatus ? "activated" : "deactivated"
          }.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not update company status. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleExportDownload = async () => {
    isExportingRef.current = true;

    const exportAbortController = new AbortController();

    const exportSignal = exportAbortController.signal;

    try {
      setLoading(true);

      const params = {
        ...(filters.companyname && {
          companyname: filters.companyname,
        }),

        ...(filters.industry && {
          industry: filters.industry,
        }),

        ...(filters.companyemail && {
          companyemail: filters.companyemail,
        }),

        ...(filters.state && {
          state: filters.state,
        }),

        ...(filters.state_id && {
          state_id: filters.state_id,
        }),

        ...(filters.city && {
          city: filters.city,
        }),

        ...(filters.city_id && {
          city_id: filters.city_id,
        }),

        ...(filters.dor && {
          dor: filters.dor,
        }),

        ...(filters.status && {
          status: filters.status,
        }),

        ...(filters.company_type &&
          filters.company_type !== "all" && {
            company_type: filters.company_type,
          }),
      };

      const response = await exportCompaniesAPI(params, {
        signal: exportSignal,
      });

      if (exportSignal.aborted) return;

      const dataArray = Array.isArray(response.data)
        ? response.data
        : response.data?.data || companies;

      // Excel Data
      const exportData = dataArray.map((company) => {
        const primaryAddress =
          company.addresses && company.addresses.length > 0
            ? company.addresses[0]
            : null;

        return {
          ID: company.id,

          "Company Code": company.company_code || "",

          "Company Name": company.company_name || "",

          Email: company.email || "",

          Phone: company.phone || "",

          Industry: company.industry?.name || company.industry || "",

          "Company Owner": company.company_owner?.owner_name || "",

          "Owner Email": company.company_owner?.owner_email || "",

          "Owner Phone": company.company_owner?.owner_phone || "",

          "GST Number": company.gst_number || "",

          "PAN Number": company.pan_number || "",

          "TIN Number": company.tin_number || "",

          "Work Type": company.work_type || "",

          "Service Charge": company.service_charge || "",

          "Service Charge Type": company.service_charge_type || "",

          Status: company.status === 1 ? "Active" : "Inactive",

          "Created At": company.created_at || "",

          "Updated At": company.updated_at || "",

          Address: primaryAddress?.address || "",

          City: primaryAddress?.city || "",

          State: primaryAddress?.state || "",

          ZIP: primaryAddress?.zip || "",
        };
      });

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Append worksheet
      XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");

      // Generate Excel Buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create Blob
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      // Download Excel
      saveAs(
        blob,
        `companies-export-${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      Swal.fire({
        icon: "success",
        title: "Excel Export Successful!",
        text: `Exported ${dataArray.length} companies.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      if (error.name === "AbortError") return;

      console.error("Export failed:", error);

      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "Unable to export companies.",
      });
    } finally {
      setLoading(false);
      isExportingRef.current = false;
    }
  };

  // Function to manually cancel ongoing requests (optional, for cleanup)
  const cancelRequests = useCallback(() => {
    abortPreviousRequest();
  }, [abortPreviousRequest]);

  // === NEW: Save agent commission ===
  const handleSaveCommission = async (company, value, type) => {
    try {
      if (!company?.agent) {
        Swal.fire({
          icon: "error",
          title: "No Agent",
          text: "No agent assigned to this company",
        });
        return;
      }

      const payload = {
        company_id: company.id,
        agent_charge: value,
        agent_charge_type: type,
      };

      // Decide add or update
      if (!company.agent_charge) {
        await addAgentCommissionAPI(payload);
      } else {
        await updateAgentCommissionAPI(payload);
      }

      // Update UI instantly (no reload needed)
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === company.id
            ? {
                ...c,
                agent_charge: value,
                agent_charge_type: type,
              }
            : c,
        ),
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Commission saved successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save commission",
      });
    }
  };

  return {
    companies,
    loading,
    page,
    totalPages,
    totalRecords,
    setPage,
    defaultFilters,
    filters,
    setFilters,
    handleSearch,
    handleClear,
    handleDelete,
    handleToggleStatus,
    handleExportDownload,
    cancelRequests,
    handleSaveCommission, // ✅ Exposed for components
  };
};
