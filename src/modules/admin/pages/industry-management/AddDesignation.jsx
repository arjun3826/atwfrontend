import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import Swal from "sweetalert2";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { addDesignationAPI } from "../../../../api/admin/adminDesignationAPI";
import { useAdminPermissions } from "../../../../common/hooks/useAdminPermissions";
import Loader from "../../../../common/components/Loader";
import Breadcrumb from "../../../../common/components/Breadcrumb";

const AddDesignation = () => {
  const { id: industryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const industryName = searchParams.get("name") || "Industry";
  const { hasPermission, loading: permissionsLoading } = useAdminPermissions();

  const [formData, setFormData] = useState({
    name: "",
    // status: 1, // default active
    industry_id: industryId,
  });
  const [errors, setErrors] = useState({
    name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name") {
      if (value && !/^[a-zA-Z0-9\s]+$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          name: "Special characters are not allowed",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          name: "",
        }));
      }
    }
  };
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Designation name is required";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.name)) {
      newErrors.name = "Special characters are not allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // API expects payload with name and optionally status
      await addDesignationAPI(formData);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Designation added successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      // navigate(`/admin/industries/designations/${industryId}`);
      navigate(
        `/admin/industries/designations/${industryId}?name=${encodeURIComponent(industryName)}`,
      );
    } catch (error) {
      console.error("Error adding designation:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add designation",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!hasPermission("designation", "create")) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to add designations.
          </p>
          <button
            // onClick={() => navigate(`/admin/industries/designations/${industryId}`)}
            onClick={() =>
              navigate(
                `/admin/industries/designations/${industryId}?name=${encodeURIComponent(
                  industryName,
                )}`,
              )
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 bg-gray-50 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Breadcrumb
        items={[
          { label: "Industries", path: "/admin/industries" },
          {
            label: industryName,
            path: `/admin/industries/designations/${industryId}?name=${encodeURIComponent(
              industryName,
            )}`,
          },
          { label: "Add Designation" },
        ]}
      />
      <motion.div className="" variants={itemVariants}>
        <div className="flex items-center gap-4 mb-6">
          {/* <button
            onClick={() => navigate(`/admin/industries/designations/${industryId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button> */}
          <h1 className="text-2xl font-bold text-gray-800">
            Add New Designation
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Designation Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => validate()}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter designation name"
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              // onClick={() => navigate(`/admin/industries/designations/${industryId}`)}
              onClick={() =>
                navigate(
                  `/admin/industries/designations/${industryId}?name=${encodeURIComponent(
                    industryName,
                  )}`,
                )
              }
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Designation
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddDesignation;
