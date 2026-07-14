import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWorkerProfile } from "../../workerhooks/useWorkerProfile";
import Loader from "../../../../common/components/Loader";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  Edit2,
  Home,
  Building,
  Building2,
  Hash,
  CreditCard,
  Fingerprint,
  Award,
  ShieldCheck,
  BanknoteIcon,
  FileText,
  MapPinned,
  BadgeCheck,
  IdCard,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";

const WorkerProfile = () => {
  const { formData, formLoading } = useWorkerProfile();

  // Calculate full name
  const fullName =
    `${formData.first_name || ""} ${formData.middle_name || ""} ${formData.last_name || ""}`.trim();

  if (formLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  const maskValue = (value) => {
    if (!value) return "";

    return "*".repeat(Math.max(0, value.length - 4)) + value.slice(-4);
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 w-full sm:px-6 md:px-8 py-0 md:py-4 flex flex-col items-center justify-center"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 w-full max-w-7xl"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            View your personal and professional information
          </p>
        </div>

        <div className="flex justify-start sm:justify-end">
          <Link
            to="/worker/profile/edit"
            className="inline-flex w-auto items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Edit2 size={18} />
            Edit Profile
          </Link>
        </div>
      </motion.div>

      {/* Profile Summary Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 w-full max-w-7xl"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="relative">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt={fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md object-cover"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-md">
                  <User className="w-12 h-12 sm:w-14 sm:h-14 text-blue-600" />
                </div>
              )}
              {formData.is_verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                  <BadgeCheck size={16} />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {fullName}
                </h2>
                <p className="text-gray-600 text-lg font-medium">
                  {formData.designation || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              {/* <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <Building size={18} className="text-blue-600" />
                <span className="font-medium">
                  {formData.department || "Department not set"}
                </span>
              </div> */}
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <MapPin size={18} className="text-green-600" />
                <span className="font-medium">
                  {formData.current_city || "Location not set"}
                </span>
              </div>
              {formData.work_experience && (
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <Award size={18} className="text-amber-600" />
                  <span className="font-medium">
                    {formData.work_experience} years experience
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full max-w-7xl">
        {/* Personal Information Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Personal Information
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={14} />
                    <span>First Name</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.first_name || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={14} />
                    <span>Last Name</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.last_name || "-"}
                  </p>
                </div>
              </div>

              {formData.middle_name && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={14} />
                    <span>Middle Name</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.middle_name}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Mail size={14} />
                    <span>Email</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.work_email || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Phone size={14} />
                    <span>Phone</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {maskValue(formData.mobile_number) || "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={14} />
                    <span>Gender</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.gender || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={14} />
                    <span>Date of Birth</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.date_of_birth
                      ? new Date(formData.date_of_birth).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>

              {formData.father_name && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={14} />
                    <span>Father's Name</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.father_name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Professional Information Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-green-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase size={20} className="text-green-600" />
              Professional Information
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Building2 size={14} />
                    <span>Industry</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.industry || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Award size={14} />
                    <span>Designation</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.designation || "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Building size={14} />
                    <span>Department</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.department || "-"}
                  </p>
                </div> */}
                {/* <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin size={14} />
                    <span>Work Location</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.work_location || "-"}
                  </p>
                </div> */}
              </div>

              {formData.work_experience && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar size={14} />
                      <span>Work Experience</span>
                    </div>
                    <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                      {formData.work_experience} years
                    </p>
                  </div>
                </div>
              )}

              {formData.dress_size && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={14} />
                    <span>Dress Size</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.dress_size}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Address Information Card (Residential) */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 w-full max-w-7xl"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-amber-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPinned size={20} className="text-amber-600" />
            Address Information
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {formData.residential_address && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Home size={14} />
                  <span>Residential Address</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {formData.residential_address}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPinned size={14} />
                  <span>State</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {formData.state || "-"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPinned size={14} />
                  <span>City</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {formData.city || "-"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPinned size={14} />
                  <span>Pincode</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {formData.zip || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Working Address Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 w-full max-w-7xl"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-indigo-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPinned size={20} className="text-indigo-600" />
            Work Address
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPinned size={14} />
                  <span>Work State</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {formData.current_state || "-"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPinned size={14} />
                  <span>Work City</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {formData.current_city || "-"}
                </p>
              </div>
            </div>

            {formData.working_address && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Home size={14} />
                  <span>Work Address</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {formData.working_address}
                </p>
              </div>
            )}

            {formData.working_zip && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  {/* <Hash size={14} /> */}
                  <MapPinned size={14} />
                  <span>Work Zip Code</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {formData.working_zip}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Identification & Payment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full max-w-7xl">
        {/* Identification Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-purple-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Fingerprint size={20} className="text-purple-600" />
              Identification Details
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {formData.pan_number && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FileText size={14} />
                    <span>PAN Number</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {maskValue(formData.pan_number)}
                  </p>
                </div>
              )}

              {formData.aadhaar_number && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <IdCard size={14} />
                    <span>Aadhaar Number</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {maskValue(formData.aadhaar_number)}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <ShieldCheck size={18} className="text-purple-600" />
                  <span className="font-semibold">Statutory Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Hash size={14} />
                      <span>UAN Number</span>
                    </div>
                    <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                      {formData.uan_number || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Hash size={14} />
                      <span>ESIC Number</span>
                    </div>
                    <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                      {maskValue(formData.esic_number) || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Information Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-emerald-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard size={20} className="text-emerald-600" />
              Payment Information
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <BanknoteIcon size={14} />
                  <span>Payment Method</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg w-fit">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">
                    Bank Transfer
                  </span>
                </div>
              </div>

              {formData.bank_accounts?.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <Building size={18} className="text-emerald-600" />
                    <span className="font-semibold text-sm">
                      Bank Account Details
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Bank Name
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formData.bank_name || "-"}
                      </p>
                    </div> */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Account Number
                      </p>
                      <p className="text-sm font-semibold text-gray-900 font-mono tracking-wider">
                        {formData.account_number
                          ? `****${formData.account_number.slice(-4)}`
                          : "-"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        IFSC Code
                      </p>
                      <p className="text-sm font-semibold text-gray-900 font-mono uppercase tracking-wider">
                        {formData.ifsc_code || "-"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Account Type
                      </p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {formData.account_type || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-500 font-medium">
                    No bank accounts linked
                  </p>
                  <Link
                    to="/worker/profile/edit"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Add account in edit profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WorkerProfile;
