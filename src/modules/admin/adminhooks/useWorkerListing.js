import { useState, useEffect, useCallback, useRef } from "react";
import {
  getWorkersAPI,
  deleteWorkerAPI,
  toggleWorkerStatusAPI,
  exportWorkersAPI,
} from "../../../api/admin/adminWorkerAPI";
import { useDebounce } from "../../../common/hooks/useDebounce";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const useWorkerListing = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const isExportingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const defaultFilters = {
    worker_name: "",
    worker_code: "",
    department: "",
    department_id: "",
    designation: "",
    designation_id: "",
    state: "",
    state_id: "",
    city: "",
    city_id: "",
    status: "",
    worker_type: "",
    joining_date_from: "",
    joining_date_to: "",
    industry: "",
    industry_id: "",
    agent_id: "",
    agent_name: "",
    staff_code: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const debouncedFilters = useDebounce(filters, 800);

  const abortPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const convertWorkerType = (value) => {
    if (value === "all") return "";
    if (value === "1") return "1";
    if (value === "0") return "0";
    if (value === "incomplete") return "incomplete";
    return "";
  };

  const buildApiParams = (appliedFilters) => {
    const params = {
      page,
      limit,
      ...appliedFilters,
      worker_type: convertWorkerType(appliedFilters.worker_type),
    };
    // Remove empty values
    Object.keys(params).forEach((key) => {
      if (
        params[key] === "" ||
        params[key] === null ||
        params[key] === undefined
      ) {
        delete params[key];
      }
    });
    return params;
  };

  const fetchWorkers = useCallback(
    async (appliedFilters = debouncedFilters) => {
      if (isExportingRef.current) return;
      abortPreviousRequest();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      setLoading(true);
      try {
        const apiParams = buildApiParams(appliedFilters);
        const response = await getWorkersAPI(apiParams, { signal });
        if (!isMountedRef.current) return;
        if (signal.aborted) return;
        const data = response?.data?.data || [];
        const total = response?.data?.total || 0;
        const lastPage = response?.data?.last_page || 1;
        setWorkers(data);
        setTotalRecords(total);
        setTotalPages(lastPage);
      } catch (error) {
        if (!isMountedRef.current) return;
        if (error.name === "AbortError") return;
        console.error("Error fetching workers:", error);
      } finally {
        if (isMountedRef.current && !signal.aborted) setLoading(false);
      }
    },
    [page, limit, abortPreviousRequest, debouncedFilters],
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchWorkers(debouncedFilters);
    return () => {
      isMountedRef.current = false;
      abortPreviousRequest();
    };
  }, [page, debouncedFilters, fetchWorkers]);

  const handleSearch = () => setPage(1);
  const handleClear = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This worker will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (!result.isConfirmed) return;
    try {
      const response = await deleteWorkerAPI(id);
      if (response?.status === 500) {
        Swal.fire({
          icon: "error",
          title: response?.data || "Delete failed",

          text: response?.message || "Worker cannot be deleted",
        });

        return;
      }
      if (response?.status === 200 || response?.status === 204) {
        setWorkers((prev) => prev.filter((worker) => worker.id !== id));
        setTotalRecords((prev) => prev - 1);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response?.message || "Worker deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not delete worker.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = currentStatus === "active";
    const actionText = isActive ? "deactivate" : "activate";
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `This worker will be ${actionText}d.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText} it`,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (!result.isConfirmed) return;
    try {
      const response = await toggleWorkerStatusAPI(id, !isActive);
      if (response?.status === 200 || response?.status === 204) {
        setWorkers((prev) =>
          prev.map((w) =>
            w.id === id
              ? { ...w, status: !isActive ? "active" : "inactive" }
              : w,
          ),
        );
        Swal.fire({
          icon: "success",
          title: "Success!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not update status.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
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
        ...(filters.worker_name && {
          worker_name: filters.worker_name,
        }),

        ...(filters.worker_code && {
          worker_code: filters.worker_code,
        }),

        ...(filters.department && {
          department: filters.department,
        }),

        ...(filters.department_id && {
          department_id: filters.department_id,
        }),

        ...(filters.designation && {
          designation: filters.designation,
        }),

        ...(filters.designation_id && {
          designation_id: filters.designation_id,
        }),

        ...(filters.work_location && {
          work_location: filters.work_location,
        }),

        ...(filters.joining_date_from && {
          joining_date_from: filters.joining_date_from,
        }),

        ...(filters.joining_date_to && {
          joining_date_to: filters.joining_date_to,
        }),

        ...(filters.status && {
          status: filters.status,
        }),

        ...(filters.industry && {
          industry: filters.industry,
        }),

        ...(filters.industry_id && {
          industry_id: filters.industry_id,
        }),

        ...(filters.agent_id && {
          agent_id: filters.agent_id,
        }),

        ...(filters.staff_code && {
          staff_code: filters.staff_code,
        }),

        ...(filters.worker_type &&
          filters.worker_type !== "all" && {
            worker_type: convertWorkerType(filters.worker_type),
          }),
      };

      const response = await exportWorkersAPI(params, { signal: exportSignal });

      if (exportSignal.aborted) return;

      const dataArray = Array.isArray(response.data)
        ? response.data
        : response.data?.data || workers;

      // Excel Data
      const exportData = dataArray.map((worker) => ({
        ID: worker.id,

        "Worker Code": worker.worker_code || "",

        "Worker Name": worker.worker_name || worker.employee_name || "",

        Department: worker.department?.name || worker.department || "",

        Designation: worker.designation?.name || worker.designation || "",

        "Work Location": worker.work_location || "",

        Email: worker.work_email || "",

        Phone: worker.mobile_number || "",

        Industry: worker.industry?.name || worker.industry || "",

        "Worker Type": worker.worker_type || "",

        Status:
          worker.status === "active" || worker.status === 1
            ? "Active"
            : "Inactive",

        "Joining Date": worker.joining_date || "",

        "Created At": worker.created_at || "",

        "Updated At": worker.updated_at || "",
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Append worksheet
      XLSX.utils.book_append_sheet(workbook, worksheet, "Workers");

      // Generate Excel buffer
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
        `workers-export-${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      Swal.fire({
        icon: "success",
        title: "Excel Export Successful!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      if (error.name === "AbortError") return;

      console.error("Export failed:", error);

      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "Unable to export workers.",
      });
    } finally {
      setLoading(false);
      isExportingRef.current = false;
    }
  };

  const cancelRequests = useCallback(
    () => abortPreviousRequest(),
    [abortPreviousRequest],
  );

  return {
    workers,
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
  };
};
