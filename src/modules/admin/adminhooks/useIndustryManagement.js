import { useState, useEffect, useCallback, useRef } from "react";
import Swal from "sweetalert2";
import {
  getIndustriesAPI,
  deleteIndustryAPI,
  toggleIndustryStatusAPI,
} from "../../../api/admin/adminIndustryAPI";

export const useIndustryManagement = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Keep filters stable in a ref for the fetch callback
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Core fetch function – depends only on page, uses filters from ref
  const fetchIndustries = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: filtersRef.current.search || undefined,
        status: filtersRef.current.status || undefined,
      };
      const response = await getIndustriesAPI(params);
      const responseData = response.data;
      setIndustries(responseData.data || []);
      setTotalPages(responseData.last_page || 1);
      setTotalRecords(responseData.total || 0);
    } catch (error) {
      console.error("Error fetching industries:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load industries",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Trigger a fresh fetch (used by search, clear, etc.)
  const triggerFetch = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Fetch whenever page or refreshTrigger changes
  useEffect(() => {
    fetchIndustries();
  }, [page, refreshTrigger, fetchIndustries]);

  // Search handler: reset page to 1 and force a refetch
  const handleSearch = useCallback(() => {
    setPage(1);
    triggerFetch();
  }, [triggerFetch]);

  // Clear all filters and refetch
  const handleClear = useCallback(() => {
    setFilters({ search: "", status: "" });
    setPage(1);
    triggerFetch();
  }, [triggerFetch]);

  // Delete and toggle status remain the same, but after success we can call fetch directly
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
      const response = await deleteIndustryAPI(id);

      if (response?.status !== 200) {
        Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: response?.message || "Cannot delete industry",
        });

        return;
      }

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Industry has been deleted.",
      });

      fetchIndustries();
    } catch (error) {
      console.error("Error deleting industry:", error);

      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus === 1 ? "deactivate" : "activate";
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} this industry?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (!result.isConfirmed) return;

    try {
      await toggleIndustryStatusAPI(id);
      Swal.fire("Success!", `Industry ${action}d successfully.`, "success");
      fetchIndustries(); // directly refetch
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
    industries,
    loading,
    page,
    totalPages,
    totalRecords,
    filters,
    setFilters,
    setPage,
    handleSearch,
    handleClear,
    handleDelete,
    handleToggleStatus,
    refresh: fetchIndustries,
  };
};
