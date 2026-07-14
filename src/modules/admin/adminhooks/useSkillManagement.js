import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getSkillsByDesignationAPI,
  deleteSkillAPI,
  toggleSkillStatusAPI,
} from "../../../api/admin/adminSkillAPI";

export const useSkillManagement = (designationId) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const fetchSkills = useCallback(async () => {
    if (!designationId) return;
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: filters.search || undefined,
        status: filters.status || undefined,
      };
      const response = await getSkillsByDesignationAPI(designationId, params);
      const { data, pagination } = response.data;
      setSkills(data || []);
      setTotalPages(pagination?.totalPages || 1);
      setTotalRecords(pagination?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching skills:", error);
      // Swal.fire({
      //   icon: "error",
      //   title: "Failed to load skills",
      //   text: error.response?.data?.message || "Something went wrong",
      // });
    } finally {
      setLoading(false);
    }
  }, [designationId, page, filters.search, filters.status]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleSearch = () => {
    setPage(1);
    fetchSkills();
  };

  const handleClear = () => {
    setFilters({ search: "", status: "" });
    setPage(1);
  };

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
      await deleteSkillAPI(id);
      Swal.fire("Deleted!", "Skill has been deleted.", "success");
      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
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
      text: `Do you want to ${action} this skill?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (!result.isConfirmed) return;

    try {
      await toggleSkillStatusAPI(id);
      Swal.fire("Success!", `Skill ${action}d successfully.`, "success");
      fetchSkills();
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
    skills,
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
    refresh: fetchSkills,
  };
};