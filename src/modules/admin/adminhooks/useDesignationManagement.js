import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getDesignationsByIndustryAPI,
  deleteDesignationAPI,
  toggleDesignationStatusAPI,
} from "../../../api/admin/adminDesignationAPI";

export const useDesignationManagement = (industryId) => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  // ---------------- FETCH DESIGNATIONS ----------------
  const fetchDesignations = useCallback(async () => {
    if (!industryId) return;

    setLoading(true);

    try {
      const params = {
        page,
        per_page: 10, // ✅ better than limit for Laravel pagination
        search: filters.search || undefined,
        status: filters.status || undefined,
      };

      const response = await getDesignationsByIndustryAPI(industryId, params);

      const apiData = response.data || {};

      // ✅ designation list
      setDesignations(apiData.data || []);

      // ✅ pagination fix
      setTotalPages(apiData.last_page || 1);

      // ✅ total records
      setTotalRecords(apiData.total || 0);
    } catch (error) {
      console.error("Error fetching designations:", error);

      // Optional error alert
      // Swal.fire({
      //   icon: "error",
      //   title: "Failed to load designations",
      //   text: error.response?.data?.message || "Something went wrong",
      // });

      setDesignations([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [industryId, page, filters.search, filters.status]);

  // ---------------- INITIAL FETCH ----------------
  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  // ---------------- SEARCH ----------------
  const handleSearch = () => {
    setPage(1);
    fetchDesignations();
  };

  // ---------------- CLEAR FILTERS ----------------
  const handleClear = () => {
    setFilters({
      search: "",
      status: "",
    });

    setPage(1);
  };

  // ---------------- DELETE DESIGNATION ----------------

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteDesignationAPI(id);

      // Handle API response that returns status in body
      if (response?.status === 500 || response?.data?.success === false) {
        return Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: response?.message || "This designation cannot be deleted",
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Designation has been deleted.",
      });

      fetchDesignations();
    } catch (error) {
      console.error("Error deleting designation:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      });
    }
  };

  // ---------------- TOGGLE STATUS ----------------
  const handleToggleStatus = async (id, currentStatus) => {
    const action = Number(currentStatus) === 1 ? "deactivate" : "activate";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} this designation?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (!result.isConfirmed) return;

    try {
      await toggleDesignationStatusAPI(id);

      Swal.fire("Success!", `Designation ${action}d successfully.`, "success");

      fetchDesignations();
    } catch (error) {
      console.error("Error toggling status:", error);

      Swal.fire({
        icon: "error",
        title: "Action failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return {
    designations,
    loading,

    // Pagination
    page,
    setPage,
    totalPages,
    totalRecords,

    // Filters
    filters,
    setFilters,

    // Actions
    handleSearch,
    handleClear,
    handleDelete,
    handleToggleStatus,

    // Refresh
    refresh: fetchDesignations,
  };
};
