// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Building,
//   User,
//   Mail,
//   Phone,
//   FileText,
//   CheckCircle,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Trash2,
//   Home,
//   X,
//   Calculator,
// } from "lucide-react";
// import Cookies from "js-cookie";
// import { useCompanyRegister } from "../companyhooks/useCompanyRegister";

// const CompanyRegister = () => {
//   const {
//     currentStep,
//     totalSteps,
//     formData,
//     errors,
//     loading,
//     selectedIndustryId,
//     industries,
//     industriesLoading,
//     states,
//     token,
//     citiesMap,
//     citiesLoading,
//     handleChange,
//     handleIndustryChange,
//     addAddress,
//     updateAddress,
//     removeAddress,
//     nextStep,
//     prevStep,
//     goToStep,
//     fetchCities,
//   } = useCompanyRegister();

//   const [logoUrl, setLogoUrl] = useState("");
//   const [supportEmail, setSupportEmail] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");

//   // Modal states for Terms & Conditions
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
//   const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
//   const [showPrivacyModal, setShowPrivacyModal] = useState(false);
//   const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] =
//     useState(false);
//   const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] =
//     useState(false);
//   useEffect(() => {
//     setLogoUrl(Cookies.get("logo_url") || "");
//     setSupportEmail(Cookies.get("support_email") || "");
//     setWhatsappNumber(Cookies.get("whatsapp_number") || "");
//     setPhoneNumber(Cookies.get("phone_number") || "");
//   }, []);

//   // Sync modal checkbox with main form checkbox
//   useEffect(() => {
//     setModalCheckboxChecked(formData.accepted_terms);
//   }, [formData.accepted_terms]);

//   useEffect(() => {
//     setPrivacyModalCheckboxChecked(formData.accepted_privacy || false);
//   }, [formData.accepted_privacy]);
//   const stepTitles = [
//     "Company Info",
//     "Owner Details",
//     "KYC Details",
//     "Address",
//     "Terms & Privacy",
//   ];

//   const stepIcons = [
//     <Building size={18} />,
//     <User size={18} />,
//     <FileText size={18} />,
//     <Home size={18} />,
//     <CheckCircle size={18} />,
//   ];

//   // Scroll handler for modal content
//   const handleModalScroll = (e) => {
//     const target = e.target;
//     const bottom =
//       target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
//     if (bottom && !hasScrolledToBottom) {
//       setHasScrolledToBottom(true);
//     }
//   };

//   // Reset scroll state when modal opens
//   const openModal = () => {
//     setShowTermsModal(true);
//     setHasScrolledToBottom(false);
//   };

//   const closeModal = () => {
//     setShowTermsModal(false);
//   };

//   // Handle checkbox change inside modal
//   const handleModalCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setModalCheckboxChecked(checked);
//     handleChange("accepted_terms", checked);
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Basic Company Information
//             </h2>
//             <p className="text-gray-600">
//               Enter your company details and select an industry.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Building
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.company_name}
//                     onChange={(e) =>
//                       handleChange("company_name", e.target.value)
//                     }
//                     disabled={loading}
//                     placeholder="Enter company name"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.company_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.company_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.company_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Email <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleChange("email", e.target.value)}
//                     // disabled={loading}
//                     disabled={loading || !!token}
//                     placeholder="Enter company email"
//                     // className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.email ? "border-red-500" : "border-gray-300"}`}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     } ${
//                       !!token
//                         ? "bg-gray-100 cursor-not-allowed text-gray-500"
//                         : ""
//                     }`}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.email}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Phone <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.company_phone}
//                     onChange={(e) =>
//                       handleChange(
//                         "company_phone",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     disabled={loading || !!token}
//                     placeholder="Enter company phone"
//                     // className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.company_phone ? "border-red-500" : "border-gray-300"}`}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
//                       errors.company_phone
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     } ${
//                       !!token
//                         ? "bg-gray-100 cursor-not-allowed text-gray-500"
//                         : ""
//                     }`}
//                   />
//                 </div>
//                 {errors.company_phone && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.company_phone}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Industry <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={selectedIndustryId}
//                   onChange={(e) => handleIndustryChange(e.target.value)}
//                   disabled={loading || industriesLoading}
//                   className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.industry_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Industry</option>
//                   {industries.map((ind) => (
//                     <option key={ind.id} value={ind.id}>
//                       {ind.name}
//                     </option>
//                   ))}
//                 </select>
//                 {/* FIXED: error key changed from industry_ids to industry_id */}
//                 {errors.industry_id && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.industry_id}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Owner / Contact Person Details
//             </h2>
//             <p className="text-gray-600">
//               Who is the primary contact for this company?
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.owner_name}
//                     onChange={(e) => handleChange("owner_name", e.target.value)}
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.owner_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={formData.owner_email}
//                     onChange={(e) =>
//                       handleChange("owner_email", e.target.value)
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_email ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_email && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.owner_email}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Phone <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.owner_phone}
//                     onChange={(e) =>
//                       handleChange(
//                         "owner_phone",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_phone ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_phone && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.owner_phone}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               KYC / Tax Details
//             </h2>
//             <p className="text-gray-600">
//               Provide GST (required) and other tax identifiers.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   GST Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Building
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.gst_number}
//                     maxLength={15}
//                     onChange={(e) =>
//                       handleChange("gst_number", e.target.value.toUpperCase())
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.gst_number ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.gst_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.gst_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   TAN Number (Optional)
//                 </label>
//                 <div className="relative">
//                   <Calculator
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.pan_number}
//                     onChange={(e) => handleChange("pan_number", e.target.value)}
//                     disabled={loading}
//                     className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
//                   />
//                 </div>
//                 {errors.tan_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />
//                     {errors.tan_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   CIN Number (Optional)
//                 </label>
//                 <div className="relative">
//                   <Calculator
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={21}
//                     value={formData.tin_number}
//                     onChange={(e) => handleChange("tin_number", e.target.value)}
//                     disabled={loading}
//                     className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
//                   />
//                 </div>
//                 {errors.cin_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />
//                     {errors.cin_number}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-bold text-gray-800">
//                 Working Addresses
//               </h2>
//               <button
//                 type="button"
//                 onClick={addAddress}
//                 className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
//               >
//                 <Plus size={16} /> Add Address
//               </button>
//             </div>
//             <p className="text-gray-600">
//               Add at least one address for your company.
//             </p>
//             {formData.addresses.length === 0 && (
//               <p className="text-gray-500 text-center py-4">
//                 No addresses added yet. Click "Add Address" to begin.
//               </p>
//             )}
//             {formData.addresses.map((addr, idx) => (
//               <div
//                 key={idx}
//                 className="border rounded-lg p-4 relative bg-gray-50/50"
//               >
//                 <button
//                   type="button"
//                   onClick={() => removeAddress(idx)}
//                   className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//                 <h4 className="font-medium mb-3">Address </h4>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Street Address <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={addr.address}
//                       onChange={(e) =>
//                         updateAddress(idx, "address", e.target.value)
//                       }
//                       className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_address`] ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors[`address_${idx}_address`] && (
//                       <p className="text-red-500 text-sm">
//                         <AlertCircle size={14} className="inline mr-1" />{" "}
//                         {errors[`address_${idx}_address`]}
//                       </p>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         State <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={addr.state_id}
//                         onChange={(e) => {
//                           updateAddress(idx, "state_id", e.target.value);
//                           fetchCities(e.target.value);
//                         }}
//                         className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_state_id`] ? "border-red-500" : "border-gray-300"}`}
//                       >
//                         <option value="">Select State</option>
//                         {states.map((s) => (
//                           <option key={s.id} value={s.id}>
//                             {s.name}
//                           </option>
//                         ))}
//                       </select>
//                       {errors[`address_${idx}_state_id`] && (
//                         <p className="text-red-500 text-sm">
//                           <AlertCircle size={14} className="inline mr-1" />{" "}
//                           {errors[`address_${idx}_state_id`]}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         City <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={addr.city_id}
//                         onChange={(e) =>
//                           updateAddress(idx, "city_id", e.target.value)
//                         }
//                         disabled={
//                           !addr.state_id || citiesLoading[addr.state_id]
//                         }
//                         className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_city_id`] ? "border-red-500" : "border-gray-300"}`}
//                       >
//                         <option value="">Select City</option>
//                         {citiesMap[addr.state_id]?.map((c) => (
//                           <option key={c.id} value={c.id}>
//                             {c.name}
//                           </option>
//                         ))}
//                       </select>
//                       {errors[`address_${idx}_city_id`] && (
//                         <p className="text-red-500 text-sm">
//                           <AlertCircle size={14} className="inline mr-1" />{" "}
//                           {errors[`address_${idx}_city_id`]}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       ZIP Code <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       maxLength={6}
//                       value={addr.zip}
//                       onChange={(e) =>
//                         updateAddress(
//                           idx,
//                           "zip",
//                           e.target.value.replace(/\D/g, ""),
//                         )
//                       }
//                       className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_zip`] ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors[`address_${idx}_zip`] && (
//                       <p className="text-red-500 text-sm">
//                         <AlertCircle size={14} className="inline mr-1" />{" "}
//                         {errors[`address_${idx}_zip`]}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {errors.addresses && (
//               <p className="text-red-500 text-sm">
//                 <AlertCircle size={14} className="inline mr-1" />{" "}
//                 {errors.addresses}
//               </p>
//             )}
//           </div>
//         );

//       case 5:
//         return (
//           <div className="space-y-6">
//             <div className="mt-4">
//               <label className="block text-xl font-bold text-gray-800 mb-1">
//                 Referral Code (Optional)
//               </label>
//               <input
//                 type="text"
//                 value={formData.agent_code || ""}
//                 maxLength={10}
//                 onChange={(e) => handleChange("agent_code", e.target.value)}
//                 disabled={loading}
//                 placeholder="Enter referral code (if any)"
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
//               />
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">
//               Terms & Conditions
//             </h2>
//             <p className="text-gray-600">
//               Review and accept to complete registration.
//             </p>
//             <div className="bg-gray-50 p-6 rounded-xl border">
//               <div className="flex items-start gap-3">
//                 <div
//                   className="flex items-start gap-3 cursor-pointer"
//                   onClick={openModal}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={formData.accepted_terms}
//                     readOnly
//                     className="mt-1 w-5 h-5 text-green-600 rounded"
//                   />
//                 </div>
//                 <label className="text-sm text-gray-800">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={openModal}
//                     className="text-green-600 hover:underline font-semibold focus:outline-none"
//                   >
//                     Terms and Conditions
//                   </button>
//                 </label>
//               </div>
//               {errors.accepted_terms && (
//                 <p className="text-red-500 text-sm flex items-center mt-3">
//                   <AlertCircle size={14} className="mr-1" />{" "}
//                   {errors.accepted_terms}
//                 </p>
//               )}
//             </div>
//             <div className="bg-gray-50 p-6 rounded-xl border mt-4">
//               <div className="flex items-start gap-3">
//                 <div
//                   className="flex items-start gap-3 cursor-pointer"
//                   onClick={openPrivacyModal}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={formData.accepted_privacy}
//                     readOnly
//                     className="mt-1 w-5 h-5 text-green-600 rounded"
//                   />
//                 </div>

//                 <label className="text-sm text-gray-800">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={openPrivacyModal}
//                     className="text-green-600 hover:underline font-semibold focus:outline-none"
//                   >
//                     Privacy Policy
//                   </button>
//                 </label>
//               </div>

//               {errors.accepted_privacy && (
//                 <p className="text-red-500 text-sm flex items-center mt-3">
//                   <AlertCircle size={14} className="mr-1" />
//                   {errors.accepted_privacy}
//                 </p>
//               )}
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };
//   const openPrivacyModal = () => {
//     setShowPrivacyModal(true);
//     setPrivacyHasScrolledToBottom(false);
//   };

//   const closePrivacyModal = () => {
//     setShowPrivacyModal(false);
//   };

//   const handlePrivacyModalScroll = (e) => {
//     const target = e.target;

//     const bottom =
//       target.scrollTop + target.clientHeight >= target.scrollHeight - 10;

//     if (bottom && !privacyHasScrolledToBottom) {
//       setPrivacyHasScrolledToBottom(true);
//     }
//   };

//   const handlePrivacyModalCheckboxChange = (e) => {
//     const checked = e.target.checked;

//     setPrivacyModalCheckboxChecked(checked);

//     handleChange("accepted_privacy", checked);
//   };

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center"
//       style={{
//         backgroundImage: "url('/images/admin/Login-Bg.png')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="relative z-10 w-full max-w-4xl">
//         <div className="text-center mb-4">
//           {logoUrl ? (
//             <img src={logoUrl} alt="Logo" className="max-h-20 mx-auto mb-3" />
//           ) : (
//             <Building className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl mx-auto mb-3" />
//           )}
//           <h1 className="text-3xl font-bold text-gray-800">
//             Company Registration
//           </h1>
//           <p className="text-gray-600">
//             Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
//           </p>
//         </div>
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               {stepTitles.map((title, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => goToStep(idx + 1)}
//                   disabled={idx + 1 > currentStep || loading}
//                   className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
//                     ${idx + 1 === currentStep ? "bg-green-600 text-white" : idx + 1 < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}
//                     ${idx + 1 > currentStep ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-400"}`}
//                 >
//                   {stepIcons[idx]}
//                 </button>
//               ))}
//             </div>
//             <div className="h-2 bg-gray-200 rounded-full">
//               <div
//                 className="h-full bg-gradient-to-r from-green-600 to-teal-600 rounded-full transition-all duration-500"
//                 style={{ width: `${(currentStep / totalSteps) * 100}%` }}
//               />
//             </div>
//           </div>
//           <div className="mb-8">{renderStepContent()}</div>
//           <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//             <button
//               onClick={prevStep}
//               disabled={currentStep === 1 || loading}
//               className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
//             >
//               <ChevronLeft size={18} /> Previous
//             </button>
//             <button
//               onClick={nextStep}
//               disabled={loading}
//               className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>{" "}
//                   {currentStep === 1 ? "Creating..." : "Saving..."}
//                 </>
//               ) : (
//                 <>
//                   {currentStep === 1
//                     ? "Create Company"
//                     : currentStep === totalSteps
//                       ? "Submit"
//                       : "Next"}{" "}
//                   <ChevronRight size={18} />
//                 </>
//               )}
//             </button>
//           </div>
//           {/* Help & Support */}
//           {(whatsappNumber || phoneNumber) && (
//             <div className="pt-6 mt-6 border-t border-gray-200">
//               <p className="text-sm font-semibold text-gray-500 text-center mb-3">
//                 Need Help?
//               </p>
//               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                 {whatsappNumber && (
//                   <a
//                     href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition"
//                   >
//                     <img
//                       src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                       alt="WhatsApp"
//                       className="w-5 h-5"
//                     />
//                     <span>WhatsApp</span>
//                   </a>
//                 )}
//                 {phoneNumber && (
//                   <a
//                     href={`tel:${phoneNumber}`}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
//                   >
//                     <Phone size={18} /> <span>Call Us</span>
//                   </a>
//                 )}
//               </div>
//             </div>
//           )}
//           <div className="text-center mt-6">
//             <p className="text-gray-500 text-sm">
//               Already have a company account?{" "}
//               <Link
//                 to="/company/login"
//                 className="text-green-600 hover:text-green-800 font-semibold hover:underline"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//         <div className="text-center mt-6 text-white text-sm">
//           <p>
//             © {new Date().getFullYear()} Company Portal. All rights reserved.
//           </p>
//           <p className="mt-1">
//             Need help?{" "}
//             <a
//               href={`mailto:${supportEmail}`}
//               className="text-amber-300 hover:underline"
//             >
//               Contact Support
//             </a>
//           </p>
//         </div>
//       </div>
//       <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>

//       {showTermsModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
//             {/* Header */}
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-xl font-bold text-gray-800">
//                 Terms and Conditions for Company
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Content */}
//             <div
//               className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
//               onScroll={handleModalScroll}
//             >
//               <p>
//                 These Terms & Conditions govern your access to and use of the
//                 Anytime Work (ATW) Company Web Portal. By registering,
//                 accessing, or using the portal, your organization agrees to
//                 comply with these Terms.
//               </p>

//               <p className="font-semibold">1. Corporate Eligibility</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>
//                   Only legally registered businesses and authorized
//                   representatives may create and manage Company accounts.
//                 </li>
//                 <li>
//                   Companies must provide accurate registration and compliance
//                   information.
//                 </li>
//               </ul>

//               <p className="font-semibold">2. Company Account</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Maintain accurate company information.</li>
//                 <li>Keep login credentials secure and confidential.</li>
//                 <li>
//                   The Company is responsible for all activities performed
//                   through its account.
//                 </li>
//               </ul>

//               <p className="font-semibold">3. Company Verification</p>
//               <p>Companies may be required to submit:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>GST Certificate</li>
//                 <li>PAN</li>
//                 <li>CIN (if applicable)</li>
//                 <li>Bank Account Details</li>
//                 <li>Authorized Signatory Details</li>
//                 <li>Company Address Proof</li>
//                 <li>Other documents requested by ATW</li>
//               </ul>
//               <p>
//                 Providing false or forged information may result in suspension,
//                 termination, or legal action.
//               </p>

//               <p className="font-semibold">4. Vacancy & Workforce Management</p>
//               <p>The Company Portal allows authorized users to:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Create and manage vacancies</li>
//                 <li>Hire and assign workers</li>
//                 <li>Manage attendance</li>
//                 <li>View workforce reports</li>
//                 <li>Manage company staff and roles</li>
//                 <li>Download reports and invoices</li>
//               </ul>
//               <p>
//                 All vacancies must comply with applicable labour laws, minimum
//                 wage regulations, and platform policies.
//               </p>

//               <p className="font-semibold">5. Billing & Payments</p>
//               <p>
//                 Invoices, service charges, payroll, statutory deductions, and
//                 other commercial transactions are processed according to the
//                 agreed business terms and applicable laws.
//               </p>

//               <p className="font-semibold">6. Data Protection</p>
//               <p>
//                 Companies must use worker information only for authorized
//                 business purposes.
//               </p>
//               <p>The Company must not:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Share worker information with unauthorized persons.</li>
//                 <li>Download or misuse confidential information.</li>
//                 <li>
//                   Sell, copy, or distribute platform data without authorization.
//                 </li>
//               </ul>

//               <p className="font-semibold">7. Website Usage</p>
//               <p>While using the portal, users may:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Upload company documents</li>
//                 <li>Upload compliance certificates</li>
//                 <li>Manage worker records</li>
//                 <li>Generate reports</li>
//                 <li>
//                   Use browser-based file upload and location features (where
//                   applicable)
//                 </li>
//               </ul>

//               <p className="font-semibold">8. Prohibited Activities</p>
//               <p>The following activities are strictly prohibited:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Fake company registration</li>
//                 <li>Fraudulent vacancy posting</li>
//                 <li>Fake attendance records</li>
//                 <li>Unauthorized access</li>
//                 <li>Data scraping</li>
//                 <li>Reverse engineering</li>
//                 <li>Sharing confidential worker information</li>
//                 <li>Misuse of platform data</li>
//               </ul>
//               <p>
//                 Violation may result in immediate suspension or permanent
//                 termination of the account.
//               </p>

//               <p className="font-semibold">9. Intellectual Property</p>
//               <p>
//                 All software, dashboards, reports, APIs, trademarks, logos,
//                 documents, and platform content are the exclusive property of
//                 Anytime Global Private Limited.
//               </p>

//               <p className="font-semibold">10. Suspension & Termination</p>
//               <p>
//                 ATW reserves the right to suspend or permanently terminate
//                 Company accounts for:
//               </p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Policy violations</li>
//                 <li>Fraudulent activities</li>
//                 <li>Non-payment</li>
//                 <li>Security risks</li>
//                 <li>Legal or regulatory requirements</li>
//               </ul>

//               <p className="font-semibold">11. Governing Law</p>
//               <p>
//                 These Terms are governed by the laws of India. Any disputes
//                 shall be subject to the jurisdiction of the competent courts at
//                 Jaipur, Rajasthan.
//               </p>

//               <p className="text-sm text-gray-500 mt-4 italic">
//                 (Scroll to the end to accept)
//               </p>
//             </div>

//             {/* Footer */}
//             <div className="border-t rounded 2xl p-5 flex items-center justify-between bg-white">
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={modalCheckboxChecked}
//                   onChange={handleModalCheckboxChange}
//                   disabled={!hasScrolledToBottom}
//                   className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//                 <span className="text-sm text-gray-700">
//                   I have read and agree to the Terms and Conditions
//                 </span>
//               </label>

//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyRegister;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Home,
  X,
  Calculator,
} from "lucide-react";
import Cookies from "js-cookie";
import { useCompanyRegister } from "../companyhooks/useCompanyRegister";

const CompanyRegister = () => {
  const {
    currentStep,
    totalSteps,
    formData,
    errors,
    loading,
    selectedIndustryId,
    industries,
    industriesLoading,
    states,
    token,
    citiesMap,
    citiesLoading,
    handleChange,
    handleIndustryChange,
    addAddress,
    updateAddress,
    removeAddress,
    nextStep,
    prevStep,
    goToStep,
    fetchCities,
  } = useCompanyRegister();

  const [logoUrl, setLogoUrl] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Modal states for Terms & Conditions
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] =
    useState(false);
  const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] =
    useState(false);

  useEffect(() => {
    setLogoUrl(Cookies.get("logo_url") || "");
    setSupportEmail(Cookies.get("support_email") || "");
    setWhatsappNumber(Cookies.get("whatsapp_number") || "");
    setPhoneNumber(Cookies.get("phone_number") || "");
  }, []);

  // Sync modal checkbox with main form checkbox
  useEffect(() => {
    setModalCheckboxChecked(formData.accepted_terms);
  }, [formData.accepted_terms]);

  useEffect(() => {
    setPrivacyModalCheckboxChecked(formData.accepted_privacy || false);
  }, [formData.accepted_privacy]);

  const stepTitles = [
    "Company Info",
    "Owner Details",
    "KYC Details",
    "Address",
    "Terms & Privacy",
  ];

  const stepIcons = [
    <Building size={18} />,
    <User size={18} />,
    <FileText size={18} />,
    <Home size={18} />,
    <CheckCircle size={18} />,
  ];

  // Scroll handler for Terms modal content
  const handleModalScroll = (e) => {
    const target = e.target;
    const bottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
    if (bottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const openModal = () => {
    setShowTermsModal(true);
    setHasScrolledToBottom(false);
  };

  const closeModal = () => {
    setShowTermsModal(false);
  };

  const handleModalCheckboxChange = (e) => {
    const checked = e.target.checked;
    setModalCheckboxChecked(checked);
    handleChange("accepted_terms", checked);
  };

  // Privacy modal handlers
  const openPrivacyModal = () => {
    setShowPrivacyModal(true);
    setPrivacyHasScrolledToBottom(false);
  };

  const closePrivacyModal = () => {
    setShowPrivacyModal(false);
  };

  const handlePrivacyModalScroll = (e) => {
    const target = e.target;
    const bottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
    if (bottom && !privacyHasScrolledToBottom) {
      setPrivacyHasScrolledToBottom(true);
    }
  };

  const handlePrivacyModalCheckboxChange = (e) => {
    const checked = e.target.checked;
    setPrivacyModalCheckboxChecked(checked);
    handleChange("accepted_privacy", checked);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Basic Company Information
            </h2>
            <p className="text-gray-600">
              Enter your company details and select an industry.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) =>
                      handleChange("company_name", e.target.value)
                    }
                    disabled={loading}
                    placeholder="Enter company name"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.company_name ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.company_name && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.company_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={loading || !!token}
                    placeholder="Enter company email"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } ${
                      !!token
                        ? "bg-gray-100 cursor-not-allowed text-gray-500"
                        : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.company_phone}
                    onChange={(e) =>
                      handleChange(
                        "company_phone",
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    disabled={loading || !!token}
                    placeholder="Enter company phone"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
                      errors.company_phone
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${
                      !!token
                        ? "bg-gray-100 cursor-not-allowed text-gray-500"
                        : ""
                    }`}
                  />
                </div>
                {errors.company_phone && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.company_phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedIndustryId}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  disabled={loading || industriesLoading}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.industry_id ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Industry</option>
                  {industries.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
                </select>
                {errors.industry_id && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.industry_id}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Owner / Contact Person Details
            </h2>
            <p className="text-gray-600">
              Who is the primary contact for this company?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => handleChange("owner_name", e.target.value)}
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_name ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.owner_name && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.owner_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={formData.owner_email}
                    onChange={(e) =>
                      handleChange("owner_email", e.target.value)
                    }
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_email ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.owner_email && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.owner_email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.owner_phone}
                    onChange={(e) =>
                      handleChange(
                        "owner_phone",
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_phone ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.owner_phone && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.owner_phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              KYC / Tax Details
            </h2>
            <p className="text-gray-600">
              Provide GST (required) and other tax identifiers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  GST Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.gst_number}
                    maxLength={15}
                    onChange={(e) =>
                      handleChange("gst_number", e.target.value.toUpperCase())
                    }
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.gst_number ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.gst_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.gst_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  TAN Number (Optional)
                </label>
                <div className="relative">
                  <Calculator
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.pan_number}
                    onChange={(e) => handleChange("pan_number", e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                  />
                </div>
                {errors.tan_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.tan_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  CIN Number (Optional)
                </label>
                <div className="relative">
                  <Calculator
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    maxLength={21}
                    value={formData.tin_number}
                    onChange={(e) => handleChange("tin_number", e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                  />
                </div>
                {errors.cin_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.cin_number}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Working Addresses
              </h2>
              <button
                type="button"
                onClick={addAddress}
                className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Add Address
              </button>
            </div>
            <p className="text-gray-600">
              Add at least one address for your company.
            </p>
            {formData.addresses.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No addresses added yet. Click "Add Address" to begin.
              </p>
            )}
            {formData.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 relative bg-gray-50/50"
              >
                <button
                  type="button"
                  onClick={() => removeAddress(idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
                <h4 className="font-medium mb-3">Address </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addr.address}
                      onChange={(e) =>
                        updateAddress(idx, "address", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_address`] ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors[`address_${idx}_address`] && (
                      <p className="text-red-500 text-sm">
                        <AlertCircle size={14} className="inline mr-1" />{" "}
                        {errors[`address_${idx}_address`]}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addr.state_id}
                        onChange={(e) => {
                          updateAddress(idx, "state_id", e.target.value);
                          fetchCities(e.target.value);
                        }}
                        className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_state_id`] ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {errors[`address_${idx}_state_id`] && (
                        <p className="text-red-500 text-sm">
                          <AlertCircle size={14} className="inline mr-1" />{" "}
                          {errors[`address_${idx}_state_id`]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addr.city_id}
                        onChange={(e) =>
                          updateAddress(idx, "city_id", e.target.value)
                        }
                        disabled={
                          !addr.state_id || citiesLoading[addr.state_id]
                        }
                        className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_city_id`] ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">Select City</option>
                        {citiesMap[addr.state_id]?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors[`address_${idx}_city_id`] && (
                        <p className="text-red-500 text-sm">
                          <AlertCircle size={14} className="inline mr-1" />{" "}
                          {errors[`address_${idx}_city_id`]}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={addr.zip}
                      onChange={(e) =>
                        updateAddress(
                          idx,
                          "zip",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_zip`] ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors[`address_${idx}_zip`] && (
                      <p className="text-red-500 text-sm">
                        <AlertCircle size={14} className="inline mr-1" />{" "}
                        {errors[`address_${idx}_zip`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {errors.addresses && (
              <p className="text-red-500 text-sm">
                <AlertCircle size={14} className="inline mr-1" />{" "}
                {errors.addresses}
              </p>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="mt-4">
              <label className="block text-xl font-bold text-gray-800 mb-1">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                value={formData.agent_code || ""}
                maxLength={10}
                onChange={(e) => handleChange("agent_code", e.target.value)}
                disabled={loading}
                placeholder="Enter referral code (if any)"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Terms & Conditions
            </h2>
            <p className="text-gray-600">
              Review and accept to complete registration.
            </p>
            <div className="bg-gray-50 p-6 rounded-xl border">
              <div className="flex items-start gap-3">
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={openModal}
                >
                  <input
                    type="checkbox"
                    checked={formData.accepted_terms}
                    readOnly
                    className="mt-1 w-5 h-5 text-green-600 rounded"
                  />
                </div>
                <label className="text-sm text-gray-800">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={openModal}
                    className="text-green-600 hover:underline font-semibold focus:outline-none"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>
              {errors.accepted_terms && (
                <p className="text-red-500 text-sm flex items-center mt-3">
                  <AlertCircle size={14} className="mr-1" />{" "}
                  {errors.accepted_terms}
                </p>
              )}
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border mt-4">
              <div className="flex items-start gap-3">
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={openPrivacyModal}
                >
                  <input
                    type="checkbox"
                    checked={formData.accepted_privacy}
                    readOnly
                    className="mt-1 w-5 h-5 text-green-600 rounded"
                  />
                </div>

                <label className="text-sm text-gray-800">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={openPrivacyModal}
                    className="text-green-600 hover:underline font-semibold focus:outline-none"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {errors.accepted_privacy && (
                <p className="text-red-500 text-sm flex items-center mt-3">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.accepted_privacy}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/admin/Login-Bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="max-h-20 mx-auto mb-3" />
          ) : (
            <Building className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl mx-auto mb-3" />
          )}
          <h1 className="text-3xl font-bold text-gray-800">
            Company Registration
          </h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {stepTitles.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => goToStep(idx + 1)}
                  disabled={idx + 1 > currentStep || loading}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${idx + 1 === currentStep ? "bg-green-600 text-white" : idx + 1 < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}
                    ${idx + 1 > currentStep ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-400"}`}
                >
                  {stepIcons[idx]}
                </button>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
          <div className="mb-8">{renderStepContent()}</div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <button
              onClick={nextStep}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>{" "}
                  {currentStep === 1 ? "Creating..." : "Saving..."}
                </>
              ) : (
                <>
                  {currentStep === 1
                    ? "Create Company"
                    : currentStep === totalSteps
                      ? "Submit"
                      : "Next"}{" "}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
          {/* Help & Support */}
          {(whatsappNumber || phoneNumber) && (
            <div className="pt-6 mt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-500 text-center mb-3">
                Need Help?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                      alt="WhatsApp"
                      className="w-5 h-5"
                    />
                    <span>WhatsApp</span>
                  </a>
                )}
                {phoneNumber && (
                  <a
                    href={`tel:${phoneNumber}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                  >
                    <Phone size={18} /> <span>Call Us</span>
                  </a>
                )}
              </div>
            </div>
          )}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Already have a company account?{" "}
              <Link
                to="/company/login"
                className="text-green-600 hover:text-green-800 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        <div className="text-center mt-6 text-white text-sm">
          <p>
            © {new Date().getFullYear()} Company Portal. All rights reserved.
          </p>
          <p className="mt-1">
            Need help?{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="text-amber-300 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                Terms and Conditions for Company
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
              onScroll={handleModalScroll}
            >
              <p>
                These Terms & Conditions govern your access to and use of the
                Anytime Work (ATW) Company Web Portal. By registering,
                accessing, or using the portal, your organization agrees to
                comply with these Terms.
              </p>

              <p className="font-semibold">1. Corporate Eligibility</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Only legally registered businesses and authorized
                  representatives may create and manage Company accounts.
                </li>
                <li>
                  Companies must provide accurate registration and compliance
                  information.
                </li>
              </ul>

              <p className="font-semibold">2. Company Account</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Maintain accurate company information.</li>
                <li>Keep login credentials secure and confidential.</li>
                <li>
                  The Company is responsible for all activities performed
                  through its account.
                </li>
              </ul>

              <p className="font-semibold">3. Company Verification</p>
              <p>Companies may be required to submit:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>GST Certificate</li>
                <li>PAN</li>
                <li>CIN (if applicable)</li>
                <li>Bank Account Details</li>
                <li>Authorized Signatory Details</li>
                <li>Company Address Proof</li>
                <li>Other documents requested by ATW</li>
              </ul>
              <p>
                Providing false or forged information may result in suspension,
                termination, or legal action.
              </p>

              <p className="font-semibold">4. Vacancy & Workforce Management</p>
              <p>The Company Portal allows authorized users to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create and manage vacancies</li>
                <li>Hire and assign workers</li>
                <li>Manage attendance</li>
                <li>View workforce reports</li>
                <li>Manage company staff and roles</li>
                <li>Download reports and invoices</li>
              </ul>
              <p>
                All vacancies must comply with applicable labour laws, minimum
                wage regulations, and platform policies.
              </p>

              <p className="font-semibold">5. Billing & Payments</p>
              <p>
                Invoices, service charges, payroll, statutory deductions, and
                other commercial transactions are processed according to the
                agreed business terms and applicable laws.
              </p>

              <p className="font-semibold">6. Data Protection</p>
              <p>
                Companies must use worker information only for authorized
                business purposes.
              </p>
              <p>The Company must not:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Share worker information with unauthorized persons.</li>
                <li>Download or misuse confidential information.</li>
                <li>
                  Sell, copy, or distribute platform data without authorization.
                </li>
              </ul>

              <p className="font-semibold">7. Website Usage</p>
              <p>While using the portal, users may:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Upload company documents</li>
                <li>Upload compliance certificates</li>
                <li>Manage worker records</li>
                <li>Generate reports</li>
                <li>
                  Use browser-based file upload and location features (where
                  applicable)
                </li>
              </ul>

              <p className="font-semibold">8. Prohibited Activities</p>
              <p>The following activities are strictly prohibited:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Fake company registration</li>
                <li>Fraudulent vacancy posting</li>
                <li>Fake attendance records</li>
                <li>Unauthorized access</li>
                <li>Data scraping</li>
                <li>Reverse engineering</li>
                <li>Sharing confidential worker information</li>
                <li>Misuse of platform data</li>
              </ul>
              <p>
                Violation may result in immediate suspension or permanent
                termination of the account.
              </p>

              <p className="font-semibold">9. Intellectual Property</p>
              <p>
                All software, dashboards, reports, APIs, trademarks, logos,
                documents, and platform content are the exclusive property of
                Anytime Global Private Limited.
              </p>

              <p className="font-semibold">10. Suspension & Termination</p>
              <p>
                ATW reserves the right to suspend or permanently terminate
                Company accounts for:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Policy violations</li>
                <li>Fraudulent activities</li>
                <li>Non-payment</li>
                <li>Security risks</li>
                <li>Legal or regulatory requirements</li>
              </ul>

              <p className="font-semibold">11. Governing Law</p>
              <p>
                These Terms are governed by the laws of India. Any disputes
                shall be subject to the jurisdiction of the competent courts at
                Jaipur, Rajasthan.
              </p>

              <p className="text-sm text-gray-500 mt-4 italic">
                (Scroll to the end to accept)
              </p>
            </div>

            {/* Footer */}
            <div className="border-t rounded-2xl p-5 flex items-center justify-between bg-white">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modalCheckboxChecked}
                  onChange={handleModalCheckboxChange}
                  disabled={!hasScrolledToBottom}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Terms and Conditions
                </span>
              </label>

              <button
                onClick={closeModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                Privacy Policy
              </h3>
              <button
                onClick={closePrivacyModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
              onScroll={handlePrivacyModalScroll}
            >
              <p>
                Anytime Work (&quot;ATW&quot;) is committed to protecting your
                company&#39;s information and maintaining the confidentiality of
                business and workforce data.
              </p>

              <p className="font-semibold">1. Information We Collect</p>
              <p>We may collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Company Name</li>
                <li>GST Number</li>
                <li>PAN</li>
                <li>CIN (if applicable)</li>
                <li>Company Address</li>
                <li>Authorized Representative Details</li>
                <li>Mobile Number</li>
                <li>Email Address</li>
                <li>Bank Account Details</li>
                <li>Company Documents</li>
                <li>Vacancy Information</li>
                <li>Worker Records</li>
                <li>Attendance Records</li>
                <li>Payroll &amp; Invoice Details</li>
                <li>Device &amp; Browser Information</li>
                <li>IP Address</li>
                <li>Login Activity</li>
              </ul>

              <p className="font-semibold">
                2. Information Submitted Through the Website
              </p>
              <p>Users may submit information through:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Company Registration</li>
                <li>Company Profile Updates</li>
                <li>KYC Document Uploads</li>
                <li>Vacancy Creation</li>
                <li>Worker Management</li>
                <li>Staff Management</li>
                <li>Report Downloads</li>
                <li>Support Requests</li>
              </ul>

              <p className="font-semibold">3. How We Use Your Information</p>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verify company identity</li>
                <li>Manage company accounts</li>
                <li>Create and manage vacancies</li>
                <li>Process worker onboarding</li>
                <li>Manage attendance and payroll</li>
                <li>Generate invoices and reports</li>
                <li>Comply with statutory and legal obligations</li>
                <li>Improve platform security</li>
                <li>Provide customer support</li>
              </ul>

              <p className="font-semibold">4. Data Sharing</p>
              <p>Information may be shared only with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Assigned Workers</li>
                <li>Banking &amp; Payment Partners</li>
                <li>KYC Verification Providers</li>
                <li>Government Authorities (where legally required)</li>
              </ul>
              <p>We do not sell company or worker information.</p>

              <p className="font-semibold">5. Data Security</p>
              <p>We protect your information using:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>HTTPS Secure Encryption</li>
                <li>Encrypted Storage</li>
                <li>Role-Based Access Control (RBAC)</li>
                <li>Private Document Storage</li>
                <li>Activity Logging &amp; Audit Records</li>
                <li>
                  Masking of sensitive information after verification
                  <br />
                  <span className="text-sm text-gray-500">
                    Examples: GST: 27ABCDE1234F1Z5 · PAN: ABCDE****F · Bank
                    Account: XXXXXXXX4567 · Mobile Number: 98XXXXXX10
                  </span>
                </li>
              </ul>

              <p className="font-semibold">6. Data Retention</p>
              <p>
                Company information is retained only for the period required by
                applicable laws, taxation rules, employment regulations,
                contractual obligations, and legitimate business purposes.
              </p>

              <p className="font-semibold">7. Your Rights</p>
              <p>Authorized Company users may request to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>View company information</li>
                <li>Update company profile</li>
                <li>Replace verification documents</li>
                <li>
                  Request account deletion (subject to legal and contractual
                  obligations)
                </li>
              </ul>

              <p className="font-semibold">8. Contact Us</p>
              <p>
                <strong>Compliance Department</strong>
                <br />
                Anytime Global Private Limited
                <br />
                Address: KH-04, Dabara, Didwana, Nagaur – 341506, Rajasthan,
                India
                <br />
                Email: compliance@anytimeglobal.com
              </p>

              <p className="text-sm text-gray-500 italic">
                By accessing or using the Anytime Work Company Web Portal, you
                acknowledge that you have read, understood, and agreed to these
                Terms &amp; Conditions and Privacy Policy.
              </p>

              <p className="text-sm text-gray-500 mt-4 italic">
                (Scroll to the end to accept)
              </p>
            </div>

            {/* Footer */}
            <div className="border-t rounded-2xl p-5 flex items-center justify-between bg-white">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyModalCheckboxChecked}
                  onChange={handlePrivacyModalCheckboxChange}
                  disabled={!privacyHasScrolledToBottom}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Privacy Policy
                </span>
              </label>

              <button
                onClick={closePrivacyModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyRegister;
