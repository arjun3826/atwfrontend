// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// import {
//   User,
//   Mail,
//   Phone,
//   Briefcase,
//   Calendar,
//   FileText,
//   Home,
//   CreditCard,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle,
//   AlertCircle,
//   X,
//   Building2,
// } from "lucide-react";
// import Cookies from "js-cookie";
// import { useWorkerSignup } from "../workerhooks/useWorkerSignup";

// const WorkerSignup = () => {
//   const {
//     currentStep,
//     totalSteps,
//     formData,
//     errors,
//     loading,
//     industries,
//     industriesLoading,

//     designations,
//     designationsLoading,
//     states,
//     statesLoading,
//     citiesMap,
//     citiesLoading,
//     handleChange,
//     fetchCities,
//     nextStep,
//     prevStep,
//     goToStep,
//     verifyReferralCode,
//   } = useWorkerSignup();

//   const [logoUrl, setLogoUrl] = useState("");
//   const [supportEmail, setSupportEmail] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [verifying, setVerifying] = useState(false);
//   // Modal state for terms
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
//   const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
//   const [showPrivacyModal, setShowPrivacyModal] = useState(false);
//   const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] =
//     useState(false);
//   const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] =
//     useState(false);

//   const hasToken = !!Cookies.get("token");
//   useEffect(() => {
//     setLogoUrl(Cookies.get("logo_url") || "");
//     setSupportEmail(Cookies.get("support_email") || "");
//     setWhatsappNumber(Cookies.get("whatsapp_number") || "");
//     setPhoneNumber(Cookies.get("phone_number") || "");
//   }, []);

//   useEffect(() => {
//     setModalCheckboxChecked(formData.accepted_terms);
//   }, [formData.accepted_terms]);

//   const stepTitles = [
//     "Basic Info",
//     "Work Details",
//     "Personal Details",
//     "Address",
//     "Bank & Terms",
//   ];

//   const stepIcons = [
//     <User size={18} />,
//     <Briefcase size={18} />,
//     <FileText size={18} />,
//     <Home size={18} />,
//     <CreditCard size={18} />,
//   ];

//   const handleModalScroll = (e) => {
//     const target = e.target;
//     const bottom =
//       target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
//     if (bottom && !hasScrolledToBottom) setHasScrolledToBottom(true);
//   };

//   const openModal = () => {
//     setShowTermsModal(true);
//     setHasScrolledToBottom(false);
//   };

//   const closeModal = () => setShowTermsModal(false);
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
//   const handleModalCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setModalCheckboxChecked(checked);
//     handleChange("accepted_terms", checked);
//   };
//   const handlePrivacyModalCheckboxChange = (e) => {
//     const checked = e.target.checked;

//     setPrivacyModalCheckboxChecked(checked);

//     handleChange("accepted_privacy", checked);
//   };
//   const handleVerifyReferral = async () => {
//     if (!formData.referral_code) return;

//     setVerifying(true);

//     const res = await verifyReferralCode();

//     setVerifying(false);

//     if (!res.success) {
//       alert(res.message || "Invalid referral code");
//     }
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Basic Information
//             </h2>
//             <p className="text-gray-600">
//               Enter your personal and contact details.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Mobile Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   {/* <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.mobile_number}
//                     onChange={(e) =>
//                       handleChange(
//                         "mobile_number",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     placeholder="Enter your mobile number"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.mobile_number ? "border-red-500" : "border-gray-300"}`}
//                   /> */}
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.mobile_number}
//                     disabled={hasToken}
//                     onChange={(e) =>
//                       handleChange(
//                         "mobile_number",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     placeholder="Enter your mobile number"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400
//     ${errors.mobile_number ? "border-red-500" : "border-gray-300"}
//     ${hasToken ? "bg-gray-100 cursor-not-allowed" : ""}
//   `}
//                   />
//                 </div>
//                 {errors.mobile_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.mobile_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   First Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={35}
//                     value={formData.first_name}
//                     onChange={(e) => handleChange("first_name", e.target.value)}
//                     placeholder="Enter your first name"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${errors.first_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.first_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.first_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Last Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={35}
//                     value={formData.last_name}
//                     onChange={(e) => handleChange("last_name", e.target.value)}
//                     placeholder="Enter your last name"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${errors.last_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.last_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.last_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Email</label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={formData.work_email}
//                     onChange={(e) => handleChange("work_email", e.target.value)}
//                     placeholder="Enter your work email"
//                     className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg"
//                   />
//                 </div>
//                 {/* {errors.work_email && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.work_email}
//                   </p>
//                 )} */}
//               </div>
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">Work Details</h2>
//             <p className="text-gray-600">
//               Tell us about your professional background.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Industry <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.industry_id}
//                   onChange={(e) => {
//                     handleChange("industry_id", e.target.value);
//                     handleChange("designation_id", "");
//                   }}
//                   disabled={industriesLoading}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.industry_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Industry</option>
//                   {industries.map((ind) => (
//                     <option key={ind.id} value={ind.id}>
//                       {ind.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.industry_id && (
//                   <p className="text-red-500 text-sm  flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.industry_id}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Designation <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.designation_id}
//                   onChange={(e) =>
//                     handleChange("designation_id", e.target.value)
//                   }
//                   disabled={designationsLoading}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.designation_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Designation</option>
//                   {designations.map((des) => (
//                     <option key={des.id} value={des.id}>
//                       {des.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.designation_id && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.designation_id}
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
//               Personal Details
//             </h2>
//             <p className="text-gray-600">KYC and identification information.</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Date of Birth <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Calendar
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   {/* <input
//                     type="date"
//                     value={formData.date_of_birth}
//                     onChange={(e) =>
//                       handleChange("date_of_birth", e.target.value)
//                     }
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${errors.date_of_birth ? "border-red-500" : "border-gray-300"}`}
//                   /> */}
//                   <input
//                     type="date"
//                     max={new Date().toISOString().split("T")[0]}
//                     value={formData.date_of_birth}
//                     onChange={(e) =>
//                       handleChange("date_of_birth", e.target.value)
//                     }
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${
//                       errors.date_of_birth
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />
//                 </div>
//                 {errors.date_of_birth && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.date_of_birth}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Father's Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.father_name}
//                   onChange={(e) => handleChange("father_name", e.target.value)}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.father_name ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 {errors.father_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.father_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Aadhar Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   maxLength={12}
//                   value={formData.aadhar_number}
//                   onChange={(e) =>
//                     handleChange(
//                       "aadhar_number",
//                       e.target.value.replace(/\D/g, ""),
//                     )
//                   }
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.aadhar_number ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 {errors.aadhar_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.aadhar_number}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">Work Address</h2>
//             <p className="text-gray-600">Where do you currently reside?</p>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Work Address <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   rows={2}
//                   value={formData.address_line}
//                   onChange={(e) => handleChange("address_line", e.target.value)}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.address_line ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 {errors.address_line && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.address_line}
//                   </p>
//                 )}
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Work State <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.state_id}
//                     onChange={(e) => {
//                       handleChange("state_id", e.target.value);
//                       handleChange("city_id", ""); // reset city
//                       fetchCities(e.target.value);
//                     }}
//                     disabled={statesLoading}
//                     className={`w-full px-3 py-2.5 border rounded-lg ${errors.state_id ? "border-red-500" : "border-gray-300"}`}
//                   >
//                     <option value="">Select State</option>
//                     {states.map((state) => (
//                       <option key={state.id} value={state.id}>
//                         {state.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.state_id && (
//                     <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                       <AlertCircle size={14} /> {errors.state_id}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Work City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.city_id}
//                     onChange={(e) => handleChange("city_id", e.target.value)}
//                     disabled={
//                       !formData.state_id || citiesLoading[formData.state_id]
//                     }
//                     className={`w-full px-3 py-2.5 border rounded-lg ${errors.city_id ? "border-red-500" : "border-gray-300"}`}
//                   >
//                     <option value="">Select City</option>
//                     {citiesMap[formData.state_id]?.map((city) => (
//                       <option key={city.id} value={city.id}>
//                         {city.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.city_id && (
//                     <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                       <AlertCircle size={14} /> {errors.city_id}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 5:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Bank Details & Terms
//             </h2>
//             <p className="text-gray-600">For salary processing and payments.</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* <div>
//                 <label className="block text-sm font-medium mb-1">Account Holder Name <span className="text-red-500">*</span></label>
//                 <input type="text" value={formData.account_holder_name} onChange={(e) => handleChange("account_holder_name", e.target.value)}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.account_holder_name ? "border-red-500" : "border-gray-300"}`} />
//                 {errors.account_holder_name && <p className="text-red-500 text-sm flex items-center mt-1 gap-1"><AlertCircle size={14} /> {errors.account_holder_name}</p>}
//               </div> */}
//               {/* <div>
//                 <label className="block text-sm font-medium mb-1">Bank Name <span className="text-red-500">*</span></label>
//                 <input type="text" value={formData.bank_name} onChange={(e) => handleChange("bank_name", e.target.value)}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.bank_name ? "border-red-500" : "border-gray-300"}`} />
//                 {errors.bank_name && <p className="text-red-500 text-sm flex items-center mt-1 gap-1"><AlertCircle size={14} /> {errors.bank_name}</p>}
//               </div> */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Account Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   maxLength={16}
//                   value={formData.account_number}
//                   onChange={(e) =>
//                     handleChange(
//                       "account_number",
//                       e.target.value.replace(/\D/g, ""),
//                     )
//                   }
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.account_number ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 {errors.account_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.account_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   IFSC Code <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   maxLength={15}
//                   value={formData.ifsc_code}
//                   onChange={(e) =>
//                     handleChange("ifsc_code", e.target.value.toUpperCase())
//                   }
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.ifsc_code ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 {errors.ifsc_code && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.ifsc_code}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Account Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.account_type}
//                   onChange={(e) => handleChange("account_type", e.target.value)}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.account_type ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="savings">Savings</option>
//                   <option value="current">Current</option>
//                   <option value="salary">Salary</option>
//                 </select>
//                 {errors.account_type && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.account_type}
//                   </p>
//                 )}
//               </div>
//             </div>
//             {/* Referral Code Section */}
//             <div className="bg-gray-50 p-4 rounded-xl border">
//               <label className="block text-sm font-medium mb-2">
//                 Referral Code <span className="text-gray-400">(Optional)</span>
//               </label>

//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={formData.referral_code || ""}
//                   onChange={(e) =>
//                     handleChange("referral_code", e.target.value)
//                   }
//                   placeholder="Enter referral code"
//                   className="flex-1 px-3 py-2.5 border rounded-lg"
//                 />

//                 {/* <button
//       type="button"
//       onClick={handleVerifyReferral}
//       disabled={verifying}
//       className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//     >
//       {verifying ? "Verifying..." : "Verify"}
//     </button> */}
//               </div>

//               {formData.referral_verified && (
//                 <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
//                   <CheckCircle size={14} /> Referral code verified
//                 </p>
//               )}
//             </div>
//             {/* Terms & Conditions */}
//             <div className="bg-gray-50 p-6 rounded-xl border">
//               <div
//                 className="flex items-start gap-3 cursor-pointer"
//                 onClick={openModal}
//               >
//                 <input
//                   type="checkbox"
//                   checked={formData.accepted_terms}
//                   readOnly
//                   className="mt-1 w-5 h-5 text-green-600 rounded"
//                 />
//                 <label className="text-sm text-gray-800">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={openModal}
//                     className="text-green-600 hover:underline font-semibold"
//                   >
//                     Terms and Conditions
//                   </button>
//                 </label>
//               </div>
//               {errors.accepted_terms && (
//                 <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                   <AlertCircle size={14} /> {errors.accepted_terms}
//                 </p>
//               )}
//             </div>

//             {/* Privacy Policy */}
//             <div className="bg-gray-50 p-6 rounded-xl border mt-4">
//               <div
//                 className="flex items-start gap-3 cursor-pointer"
//                 onClick={openPrivacyModal}
//               >
//                 <input
//                   type="checkbox"
//                   checked={formData.accepted_privacy}
//                   readOnly
//                   className="mt-1 w-5 h-5 text-green-600 rounded"
//                 />

//                 <label className="text-sm text-gray-800">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={openPrivacyModal}
//                     className="text-green-600 hover:underline font-semibold"
//                   >
//                     Privacy Policy
//                   </button>
//                 </label>
//               </div>

//               {errors.accepted_privacy && (
//                 <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                   <AlertCircle size={14} />
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
//             <Building2 className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl mx-auto mb-3" />
//           )}
//           <h1 className="text-3xl font-bold text-gray-800">
//             Worker Registration
//           </h1>
//           <p className="text-gray-600">
//             Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
//           {/* Progress Steps */}
//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               {stepTitles.map((title, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => goToStep(idx + 1)}
//                   disabled={idx + 1 > currentStep || loading}
//                   className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
//     ${
//       idx + 1 === currentStep
//         ? "bg-green-600 text-white"
//         : idx + 1 < currentStep
//           ? "bg-green-500 text-white"
//           : "bg-gray-200 text-gray-600"
//     }
//     ${
//       idx + 1 > currentStep
//         ? "cursor-not-allowed opacity-50"
//         : "cursor-pointer hover:bg-green-400"
//     }`}
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

//           {/* Step Content */}
//           <div className="mb-8">{renderStepContent()}</div>

//           {/* Navigation Buttons */}
//           <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//             <button
//               onClick={prevStep}
//               disabled={currentStep <= 1 || loading}
//               className={`flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 ${currentStep === 1 && "cursor-not-allowed"}`}
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
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   {currentStep === 1
//                     ? Cookies.get("token")
//                       ? "Next"
//                       : "Create Account"
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
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="text-green-600 hover:text-green-800 font-semibold hover:underline"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>

//         <div className="text-center mt-6 text-white text-sm">
//           <p>
//             © {new Date().getFullYear()} Worker Portal. All rights reserved.
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

//       {/* Background Blobs */}
//       <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>

//       {/* Terms Modal */}
//       {showTermsModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[500px] flex flex-col relative z-10">
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-xl font-bold text-gray-800">
//                 AWT Worker Terms & Condition
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>
//             <div
//               className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
//               onScroll={handleModalScroll}
//             >
//               <p>
//                 These Terms & Conditions govern your access to and use of the
//                 Anytime Work (ATW) website. By registering, accessing, or using
//                 the platform, you agree to comply with these Terms.
//               </p>
//               <p className="font-semibold">1. Eligibility</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Users must be 18 years of age or older.</li>
//                 <li>Users must be legally eligible to work in India.</li>
//               </ul>
//               <p className="font-semibold">2. Account Registration</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Users must provide accurate and up-to-date information.</li>
//                 <li>
//                   You are responsible for maintaining the confidentiality of
//                   your login credentials.
//                 </li>
//               </ul>
//               <p className="font-semibold">3. KYC Verification</p>
//               <p>Users may be required to submit:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Aadhaar Card</li>
//                 <li>PAN Card</li>
//                 <li>Bank Account Details</li>
//                 <li>Other employment-related documents</li>
//               </ul>
//               <p>
//                 Providing false or forged documents may result in account
//                 suspension or termination.
//               </p>
//               <p className="font-semibold">4. Job Applications</p>
//               <p>
//                 Workers may apply for vacancies available on the platform
//                 subject to platform policies and company requirements.
//               </p>
//               <p className="font-semibold">5. Payments</p>
//               <p>
//                 Salary and other payments are processed after attendance
//                 verification, company approval, and applicable statutory
//                 deductions.
//               </p>
//               <p className="font-semibold">6. User Responsibilities</p>
//               <p>Users must:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Provide genuine information.</li>
//                 <li>Follow workplace and platform policies.</li>
//                 <li>Avoid fraudulent, abusive, or unlawful activities.</li>
//                 <li>Maintain confidentiality of company information.</li>
//               </ul>
//               <p className="font-semibold">7. Account Suspension</p>
//               <p>
//                 ATW reserves the right to suspend or terminate any account that
//                 violates these Terms, submits fraudulent information, or misuses
//                 the platform.
//               </p>
//               <p className="font-semibold">8. Governing Law</p>
//               <p>
//                 These Terms are governed by the laws of India. Any disputes
//                 shall be subject to the jurisdiction of the competent courts at
//                 Jaipur, Rajasthan.
//               </p>
//               <p className="text-sm text-gray-500 mt-4 italic">
//                 (Scroll to the end to accept)
//               </p>
//             </div>
//             <div className="border-t rounded-2xl p-5 flex items-center justify-between relative z-10 bg-white">
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

// export default WorkerSignup;

import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  Home,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Lock,
  X,
  Building2,
  UserPlus,
} from "lucide-react";
import Cookies from "js-cookie";
import { useWorkerSignup } from "../workerhooks/useWorkerSignup";

const OTP_LENGTH = 6;

// ---- STUB: Aadhaar gate (UNDER DEVELOPMENT — replace with real API calls) ----

const WorkerSignup = () => {
  const {
    currentStep,
    totalSteps,
    formData,
    errors,
    loading,
    profileCompleted,
    industries,
    industriesLoading,
    designations,
    designationsLoading,
    skills,
    skillsLoading,
    states,
    statesLoading,
    citiesMap,
    citiesLoading,
    handleChange,
    fetchCities,
    sendAadhaarOtp,
    resendAadhaarOtp,
    verifyAadhaarOtp,
    nextStep,
    prevStep,
    goToStep,
    verifyReferralCode,
  } = useWorkerSignup();

  const navigate = useNavigate();

  const [logoUrl, setLogoUrl] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Terms modal state (unchanged)
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] = useState(false);
  const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!skillRef.current) return;
      if (!skillRef.current.contains(e.target)) setShowSkillDropdown(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    setShowSkillDropdown(false);
  }, [formData.designation_id]);

  const toggleSkill = (skill) => {
    const exists = formData.skills?.some((s) => s.id === skill.id);
    const next = exists ? formData.skills.filter((s) => s.id !== skill.id) : [...(formData.skills || []), skill];
    handleChange("skills", next);
  };

  const removeSkill = (skillId) => {
    handleChange(
      "skills",
      (formData.skills || []).filter((s) => s.id !== skillId),
    );
  };

  // ---- Aadhaar gate local UI state (stub flow, see banner above) ----
  const hasToken = !!Cookies.get("token");
  const [aadhaarGateStage, setAadhaarGateStage] = useState(
    hasToken ? "done" : "number", // "number" | "otp" | "done" | "skipped"
  );
  const [aadhaarNumberInput, setAadhaarNumberInput] = useState("");
  const [aadhaarOtpDigits, setAadhaarOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [aadhaarError, setAadhaarError] = useState("");
  const [aadhaarBusy, setAadhaarBusy] = useState(false);
  const [showAadhaarSuccessToast, setShowAadhaarSuccessToast] = useState(false);
  const [aadhaarResendTimer, setAadhaarResendTimer] = useState(30);
  const aadhaarOtpRefs = useRef([]);
  const [referenceId, setReferenceId] = useState("");
  const privacyContentRef = useRef(null);

  // Countdown for "Resend OTP in ..." on the Aadhaar OTP screen
  useEffect(() => {
    if (aadhaarGateStage !== "otp") return;
    if (aadhaarResendTimer <= 0) return;
    const t = setTimeout(() => setAadhaarResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [aadhaarGateStage, aadhaarResendTimer]);

  useEffect(() => {
    setLogoUrl(Cookies.get("logo_url") || "");
    setSupportEmail(Cookies.get("support_email") || "");
    setWhatsappNumber(Cookies.get("whatsapp_number") || "");
    setPhoneNumber(Cookies.get("phone_number") || "");
  }, []);

  useEffect(() => {
    setModalCheckboxChecked(formData.accepted_terms);
  }, [formData.accepted_terms]);

  useEffect(() => {
    setPrivacyModalCheckboxChecked(formData.accepted_privacy);
  }, [formData.accepted_privacy]);

  const stepTitles = ["Basic Info", "Work Details", "Personal Details", "Work Location", "Bank & Terms"];
  const stepIcons = [
    <User size={18} />,
    <Briefcase size={18} />,
    <FileText size={18} />,
    <Home size={18} />,
    <CreditCard size={18} />,
  ];

  // ---------------- Terms modal handlers (unchanged) ----------------
  const handleModalScroll = (e) => {
    const target = e.target;
    const bottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
    if (bottom && !hasScrolledToBottom) setHasScrolledToBottom(true);
  };
  const openModal = () => {
    setShowTermsModal(true);
    setHasScrolledToBottom(false);
  };
  const closeModal = () => setShowTermsModal(false);
  const openPrivacyModal = () => {
    setShowPrivacyModal(true);
    setPrivacyHasScrolledToBottom(false);
    setTimeout(() => {
    const el = privacyContentRef.current;
    if (el && el.scrollHeight <= el.clientHeight) {
      setPrivacyHasScrolledToBottom(true);
    }
  }, 0);
  };
  const closePrivacyModal = () => setShowPrivacyModal(false);
  const handlePrivacyModalScroll = (e) => {
    const target = e.target;
    const bottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
    if (bottom && !privacyHasScrolledToBottom) setPrivacyHasScrolledToBottom(true);
  };
  const handleModalCheckboxChange = (e) => {
    const checked = e.target.checked;
    setModalCheckboxChecked(checked);
    handleChange("accepted_terms", checked);
  };
  const handlePrivacyModalCheckboxChange = (e) => {
    handleChange("accepted_privacy", e.target.checked);
  };
  const handleVerifyReferral = async () => {
    if (!formData.referral_code) return;
    setVerifying(true);
    const res = await verifyReferralCode();
    setVerifying(false);
    if (!res.success) alert(res.message || "Invalid referral code");
  };

  // ---------------- Aadhaar gate handlers (STUB) ----------------
  const onSubmitAadhaarNumber = async (e) => {
    e.preventDefault();
    const digits = aadhaarNumberInput.replace(/\D/g, "");
    if (digits.length !== 12) {
      setAadhaarError("Enter a valid 12-digit Aadhaar number");
      return;
    }
    setAadhaarError("");
    setAadhaarBusy(true);
    const res = await sendAadhaarOtp(digits);
    if (res.success) {
        setReferenceId(res.reference_id);
        setAadhaarGateStage("otp");
    }
    setAadhaarBusy(false);
    if (res.success) {
      setAadhaarGateStage("otp");
      setAadhaarOtpDigits(Array(OTP_LENGTH).fill(""));
      setAadhaarResendTimer(30);
      setTimeout(() => aadhaarOtpRefs.current[0]?.focus(), 50);
    } else {
      setAadhaarError(res.message || "Could not send OTP");
    }
  };

  const onResendAadhaarOtp = async () => {
    if (aadhaarResendTimer > 0) return;

    setAadhaarBusy(true);

    const res = await resendAadhaarOtp(
        aadhaarNumberInput.replace(/\D/g, "")
    );

    setAadhaarBusy(false);

    if (res.success) {

        setReferenceId(res.reference_id);

        setAadhaarResendTimer(30);
        setAadhaarOtpDigits(Array(OTP_LENGTH).fill(""));
        aadhaarOtpRefs.current[0]?.focus();

    } else {

        setAadhaarError(res.message || "Unable to resend OTP");

    }
};

  const handleAadhaarOtpBoxChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...aadhaarOtpDigits];
    next[index] = digit;
    setAadhaarOtpDigits(next);
    if (aadhaarError) setAadhaarError("");
    if (digit && index < OTP_LENGTH - 1) aadhaarOtpRefs.current[index + 1]?.focus();
  };
  const handleAadhaarOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !aadhaarOtpDigits[index] && index > 0) {
      aadhaarOtpRefs.current[index - 1]?.focus();
    }
  };

  const onSubmitAadhaarOtp = async (e) => {
    e.preventDefault();
    const otp = aadhaarOtpDigits.join("");
    if (otp.length !== OTP_LENGTH) {
      setAadhaarError("Please enter the full 6-digit OTP");
      return;
    }
    setAadhaarBusy(true);
    const res = await verifyAadhaarOtp(
    otp,
    aadhaarNumberInput.replace(/\D/g, "")
    );
    setAadhaarBusy(false);
    if (res.success) {
      setShowAadhaarSuccessToast(true);
      setTimeout(() => {
        setShowAadhaarSuccessToast(false);
        setAadhaarGateStage("done");
      }, 1800);
    } else {
      setAadhaarError("Invalid OTP, please try again");
    }
  };

  const skipAadhaarGate = () => setAadhaarGateStage("skipped");

  const stepperHeader = (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {stepTitles.map((title, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <button
              onClick={() => goToStep(idx + 1)}
              disabled={idx + 1 > currentStep || loading}
              className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium transition
                ${idx + 1 === currentStep ? "bg-green-600 text-white ring-4 ring-green-100" : idx + 1 < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}
                ${idx + 1 > currentStep ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-green-400"}`}
            >
              {stepIcons[idx]}
            </button>
            <span className="text-[11px] text-gray-500 mt-1 hidden sm:block">{title}</span>
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-gradient-to-r from-green-600 to-teal-600 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const helpFooter = (whatsappNumber || phoneNumber) && (
    <div className="pt-6 mt-6 border-t border-gray-200">
      <p className="text-sm font-semibold text-gray-500 text-center mb-3">Need Help?</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5" />
            <span>WhatsApp</span>
          </a>
        )}
        {phoneNumber && (
          <a href={`tel:${phoneNumber}`} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
            <Phone size={18} /> <span>Call Us</span>
          </a>
        )}
      </div>
    </div>
  );

  const pageShell = (children) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center">
      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="max-h-20 mx-auto mb-3" />
          ) : (
            <Building2 className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl mx-auto mb-3" />
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">{children}</div>
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Worker Portal. All rights reserved.</p>
          <p className="mt-1">
            Need help?{" "}
            <a href={`mailto:${supportEmail}`} className="text-amber-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  // ======================= AADHAAR GATE SCREENS (stub) =======================
  // Screen 1: "Let's Create Your Account" — split panel, matches reference mockup 1:1.
  if (aadhaarGateStage === "number") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl">
          <div className="flex justify-center mb-6">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-16" />
            ) : (
              <img src="/images/logo.png" alt="Default Logo" className="max-h-16" />
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: form */}
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-blue-700">Let's Create Your Account</h1>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Your mobile number has been verified.
                  <br />
                  Complete your profile to start using Anytime Work.
                </p>

                <form onSubmit={onSubmitAadhaarNumber} className="space-y-4 mt-8">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">
                      Verify Aadhaar Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={aadhaarNumberInput}
                      onChange={(e) => setAadhaarNumberInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter your 12-digit Aadhaar number"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                        aadhaarError ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                      }`}
                    />
                    {aadhaarError && (
                      <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                        <AlertCircle size={14} /> {aadhaarError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={aadhaarBusy}
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {aadhaarBusy ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Sending OTP...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">By entering, you agree to our Terms of Service</p>

                  <button
                    type="button"
                    onClick={skipAadhaarGate}
                    className="w-full text-center text-sm text-blue-600 hover:underline"
                  >
                    Skip &amp; enter details manually
                  </button>

                  {(whatsappNumber || phoneNumber) && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 text-center mb-3">Help &amp; Support</p>
                      <div className="flex items-center justify-center gap-3">
                        {whatsappNumber && (
                          <a
                            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
                          >
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                              alt="WhatsApp"
                              className="w-4 h-4"
                            />
                            WhatsApp Help
                          </a>
                        )}
                        {phoneNumber && (
                          <a
                            href={`tel:${phoneNumber}`}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium"
                          >
                            <Phone size={16} />
                            Call Support
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </div>
              <div className="hidden md:block relative overflow-visible">
            <img
              src="/images/worker/registration_worker.png"
              alt="Worker"
            />
          </div>
            </div>

            <div className="border-t border-gray-100 py-4 text-center">
              <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Anytime Work – Worker Portal</p>
              <p className="text-gray-400 text-xs mt-0.5">All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: "Verify Aadhar OTP" — centered card, matches reference mockup 1:1,
  // including the bottom-right success toast shown right after verification.
  if (aadhaarGateStage === "otp") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-14" />
            ) : (
              <img src="/images/logo.png" alt="Default Logo" className="max-h-14" />
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <h1 className="text-xl font-bold text-blue-700">Verify Aadhar OTP</h1>
              <p className="text-gray-500 text-sm mt-2">
                Enter the 6-digit OTP sent to the mobile number
                <br />
                linked with your Aadhaar.
              </p>
            </div>

            <form onSubmit={onSubmitAadhaarOtp} className="space-y-4 mt-6">
              <label className="block text-sm font-medium text-gray-700 text-center">Enter OTP</label>
              <div className="flex items-center justify-center gap-2">
                {aadhaarOtpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (aadhaarOtpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleAadhaarOtpBoxChange(i, e.target.value)}
                    onKeyDown={(e) => handleAadhaarOtpKeyDown(i, e)}
                    className={`w-11 h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      aadhaarError ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                ))}
              </div>
              {aadhaarError && (
                <p className="text-red-500 text-sm flex items-center justify-center gap-1">
                  <AlertCircle size={14} /> {aadhaarError}
                </p>
              )}

              <div className="text-center text-sm">
                <span className="text-gray-500">Didn't receive the OTP? </span>
                {aadhaarResendTimer > 0 ? (
                  <span className="text-blue-600">Resend OTP in 0:{String(aadhaarResendTimer).padStart(2, "0")}</span>
                ) : (
                  <button type="button" onClick={onResendAadhaarOtp} className="text-blue-600 hover:underline font-medium">
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAadhaarGateStage("number")}
                  className="flex items-center gap-1 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  disabled={aadhaarBusy}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {aadhaarBusy ? "Verifying..." : "Continue →"}
                </button>
              </div>

              <button
                type="button"
                onClick={skipAadhaarGate}
                className="w-full text-center text-sm text-blue-600 hover:underline"
              >
                Skip &amp; enter details manually
              </button>

              {(whatsappNumber || phoneNumber) && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 text-center mb-3">Help &amp; Support</p>
                  <div className="flex items-center justify-center gap-3">
                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                          alt="WhatsApp"
                          className="w-4 h-4"
                        />
                        WhatsApp Help
                      </a>
                    )}
                    {phoneNumber && (
                      <a
                        href={`tel:${phoneNumber}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        <Phone size={16} />
                        Call Support
                      </a>
                    )}
                  </div>
                </div>
              )}
            </form>

            <div className="text-center pt-4 mt-2 border-t border-gray-200">
              <p className="text-gray-500 text-xs">By signing in, you agree to our Terms of Service</p>
              <p className="text-gray-400 text-xs mt-2">
                © {new Date().getFullYear()} Anytime Work – Worker Portal
                <br />
                All rights reserved
              </p>
            </div>
          </div>
        </div>

        {/* Success toast — "Retrieving your details..." (matches mockup) */}
        {showAadhaarSuccessToast && (
          <div className="fixed bottom-6 right-6 z-[9999] w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800 font-medium leading-snug">Your Aadhaar has been verified successfully.</p>
                <p className="text-xs text-gray-500 mt-0.5">Retrieving your details...</p>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  animation: "aadhaar-progress 1.8s linear forwards",
                }}
              />
            </div>
            <style>{`
              @keyframes aadhaar-progress {
                from { width: 0%; }
                to { width: 100%; }
              }
            `}</style>
          </div>
        )}
      </div>
    );
  }
  // ============================ END AADHAAR GATE ============================

  const aadhaarLocked = aadhaarGateStage === "done";

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
            <p className="text-gray-600">Enter your personal and contact details.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.mobile_number}
                    disabled={hasToken}
                    onChange={(e) => handleChange("mobile_number", e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter your mobile number"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400
                      ${errors.mobile_number ? "border-red-500" : "border-gray-300"}
                      ${hasToken ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                </div>
                {errors.mobile_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.mobile_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    maxLength={35}
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    placeholder="Enter your first name"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${errors.first_name ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.first_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    maxLength={35}
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    placeholder="Enter your last name"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${errors.last_name ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.last_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.work_email}
                    onChange={(e) => handleChange("work_email", e.target.value)}
                    placeholder="Enter your work email"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Select Your Work Details</h2>
            <p className="text-gray-600">Tell us about your professional background.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.industry_id}
                    onChange={(e) => {
                      handleChange("industry_id", e.target.value);
                      handleChange("designation_id", "");
                    }}
                    disabled={industriesLoading}
                    className={`w-full px-3 py-2.5 border rounded-lg ${errors.industry_id ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select Industry</option>
                    {industries.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name}
                      </option>
                    ))}
                  </select>
                  {errors.industry_id && (
                    <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                      <AlertCircle size={14} /> {errors.industry_id}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.designation_id}
                    onChange={(e) => handleChange("designation_id", e.target.value)}
                    disabled={designationsLoading}
                    className={`w-full px-3 py-2.5 border rounded-lg ${errors.designation_id ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select Designation</option>
                    {designations.map((des) => (
                      <option key={des.id} value={des.id}>
                        {des.name}
                      </option>
                    ))}
                  </select>
                  {errors.designation_id && (
                    <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                      <AlertCircle size={14} /> {errors.designation_id}
                    </p>
                  )}
                </div>
              </div>

              <div ref={skillRef} className="relative">
                <label className="block text-sm font-medium mb-1">
                  Skills {skills.length > 0 && <span className="text-red-500">*</span>}
                </label>

                <div className="relative">
                  <button
                    type="button"
                    disabled={!formData.designation_id}
                    onClick={() => setShowSkillDropdown((s) => !s)}
                    className={`w-full border rounded-lg px-4 py-3 text-left flex justify-between items-center ${
                      !formData.designation_id ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                    }`}
                  >
                    <span>
                      {!formData.designation_id
                        ? "Select designation first"
                        : skillsLoading
                          ? "Loading..."
                          : (formData.skills || []).length > 0
                            ? `${(formData.skills || []).length} skill(s) selected`
                            : skills.length > 0
                              ? "Select Skills"
                              : "No skills available"}
                    </span>
                    <span className="text-xs text-gray-500">{showSkillDropdown ? "▲" : "▼"}</span>
                  </button>

                  {showSkillDropdown && (
                    <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {skillsLoading ? (
                        <div className="p-3 text-gray-500">Loading...</div>
                      ) : skills.length > 0 ? (
                        skills.map((skill) => (
                          <label key={skill.id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData.skills || []).some((s) => s.id === skill.id)}
                              onChange={() => toggleSkill(skill)}
                            />
                            {skill.name}
                          </label>
                        ))
                      ) : (
                        <div className="p-3 text-gray-500">No skills found</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {(formData.skills || []).map((skill) => (
                    <span key={skill.id} className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {skill.name}
                      <button type="button" onClick={() => removeSkill(skill.id)} className="text-red-500 font-bold">
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                {errors.skills && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.skills}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Personal Details</h2>
            <p className="text-gray-600">KYC and identification information.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${errors.date_of_birth ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.date_of_birth}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Father's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.father_name}
                  onChange={(e) => handleChange("father_name", e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg ${errors.father_name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.father_name && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.father_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Aadhar Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={12}
                    readOnly={aadhaarLocked}
                    value={formData.aadhar_number}
                    onChange={(e) => !aadhaarLocked && handleChange("aadhar_number", e.target.value.replace(/\D/g, ""))}
                    className={`w-full px-3 py-2.5 border rounded-lg ${errors.aadhar_number ? "border-red-500" : "border-gray-300"} ${aadhaarLocked ? "bg-gray-50 pr-9" : ""}`}
                  />
                  {aadhaarLocked && <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                </div>
                {aadhaarLocked && <p className="text-green-600 text-xs mt-1 flex items-center gap-1"><CheckCircle size={12} /> Verified via Aadhaar OTP</p>}
                {errors.aadhar_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.aadhar_number}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Add Your Work Location</h2>
            <p className="text-gray-600">Choose your current location where you're residing.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Work Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.address_line}
                  onChange={(e) => handleChange("address_line", e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg ${errors.address_line ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.address_line && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.address_line}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Work State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state_id}
                    onChange={(e) => {
                      handleChange("state_id", e.target.value);
                      handleChange("city_id", "");
                      fetchCities(e.target.value);
                    }}
                    disabled={statesLoading}
                    className={`w-full px-3 py-2.5 border rounded-lg ${errors.state_id ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state_id && (
                    <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                      <AlertCircle size={14} /> {errors.state_id}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.city_id}
                    onChange={(e) => handleChange("city_id", e.target.value)}
                    disabled={!formData.state_id || citiesLoading[formData.state_id]}
                    className={`w-full px-3 py-2.5 border rounded-lg ${errors.city_id ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select District</option>
                    {citiesMap[formData.state_id]?.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city_id && (
                    <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                      <AlertCircle size={14} /> {errors.city_id}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.working_zip || ""}
                    onChange={(e) => handleChange("working_zip", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit pincode"
                    className={`w-full px-3 py-2.5 border rounded-lg ${errors.working_zip ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.working_zip && (
                    <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                      <AlertCircle size={14} /> {errors.working_zip}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Add Your Banking Details</h2>
                <p className="text-gray-600">For salary processing and payments.</p>
              </div>
              {/* Skip disabled: see file banner (#3) — needs hook + backend change first */}
              <button
                type="button"
                disabled
                title="Bank details are currently required — Skip will be enabled once optional-KYC support ships"
                className="px-4 py-1.5 text-sm border border-gray-300 text-gray-400 rounded-lg cursor-not-allowed shrink-0"
              >
                Skip
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.account_number}
                  onChange={(e) => handleChange("account_number", e.target.value.replace(/\D/g, ""))}
                  className={`w-full px-3 py-2.5 border rounded-lg ${errors.account_number ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.account_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.account_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={formData.ifsc_code}
                  onChange={(e) => handleChange("ifsc_code", e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2.5 border rounded-lg ${errors.ifsc_code ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.ifsc_code && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.ifsc_code}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.account_type}
                  onChange={(e) => handleChange("account_type", e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg ${errors.account_type ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                  <option value="salary">Salary</option>
                </select>
                {errors.account_type && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.account_type}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border">
              <label className="block text-sm font-medium mb-2">
                Referral Code <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.referral_code || ""}
                  onChange={(e) => handleChange("referral_code", e.target.value)}
                  placeholder="Enter referral code"
                  className="flex-1 px-3 py-2.5 border rounded-lg"
                />
              </div>
              {formData.referral_verified && (
                <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                  <CheckCircle size={14} /> Referral code verified
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border">
              <div className="flex items-start gap-3 cursor-pointer" onClick={openModal}>
                <input type="checkbox" checked={formData.accepted_terms} readOnly className="mt-1 w-5 h-5 text-green-600 rounded" />
                <label className="text-sm text-gray-800">
                  I agree to the{" "}
                  <button type="button" onClick={openModal} className="text-green-600 hover:underline font-semibold">
                    Terms and Conditions
                  </button>
                </label>
              </div>
              {errors.accepted_terms && (
                <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                  <AlertCircle size={14} /> {errors.accepted_terms}
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border mt-4">
              <div className="flex items-start gap-3 cursor-pointer" onClick={openPrivacyModal}>
                <input type="checkbox" checked={formData.accepted_privacy} readOnly className="mt-1 w-5 h-5 text-green-600 rounded" />
                <label className="text-sm text-gray-800">
                  I agree to the{" "}
                  <button type="button" onClick={openPrivacyModal} className="text-green-600 hover:underline font-semibold">
                    Privacy Policy
                  </button>
                </label>
              </div>
              {errors.accepted_privacy && (
                <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                  <AlertCircle size={14} /> {errors.accepted_privacy}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (profileCompleted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logoUrl ? <img src={logoUrl} alt="Logo" className="h-10" /> : <img src="/images/logo.png" alt="Logo" className="h-10" />}
            </div>
            <div className="flex items-center gap-3 text-gray-800 font-semibold">
              <span>Hi, {formData.first_name || "Worker"}</span>
              <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center">
                <User size={20} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-6 pb-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[520px]">
            <div className="flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle size={22} className="text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-600 leading-tight">Account Created Successfully!</h1>
              <p className="text-gray-600 mt-3 max-w-md">
                Your worker account is ready.
                <br />
                Start applying for jobs and managing your work.
              </p>

              <button
                type="button"
                onClick={() => navigate("/worker/dashboard")}
                className="mt-8 inline-flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full sm:w-64"
              >
                Find Jobs <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center justify-center">
              <img
              src="/images/worker/registration_worker.png"
              alt="Worker"
            />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return pageShell(
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Worker Registration</h1>
        <p className="text-gray-600 text-sm">
          Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
        </p>
      </div>

      {stepperHeader}

      <div className="mb-8">{renderStepContent()}</div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={prevStep}
          disabled={currentStep <= 1 || loading}
          className={`flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 ${currentStep === 1 && "cursor-not-allowed"}`}
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Saving...
            </>
          ) : (
            <>
              {currentStep === totalSteps ? "Submit" : "Next"} <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>

      {helpFooter}

      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:text-green-800 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Terms Modal (unchanged) */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[500px] flex flex-col relative z-10">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">AWT Worker Terms &amp; Condition</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700" onScroll={handleModalScroll}>
              <p>
                These Terms &amp; Conditions govern your access to and use of the Anytime Work (ATW) website. By
                registering, accessing, or using the platform, you agree to comply with these Terms.
              </p>
              <p className="font-semibold">1. Eligibility</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Users must be 18 years of age or older.</li>
                <li>Users must be legally eligible to work in India.</li>
              </ul>
              <p className="font-semibold">2. Account Registration</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Users must provide accurate and up-to-date information.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              </ul>
              <p className="font-semibold">3. KYC Verification</p>
              <p>Users may be required to submit:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Aadhaar Card</li>
                <li>PAN Card</li>
                <li>Bank Account Details</li>
                <li>Other employment-related documents</li>
              </ul>
              <p>Providing false or forged documents may result in account suspension or termination.</p>
              <p className="font-semibold">4. Job Applications</p>
              <p>Workers may apply for vacancies available on the platform subject to platform policies and company requirements.</p>
              <p className="font-semibold">5. Payments</p>
              <p>Salary and other payments are processed after attendance verification, company approval, and applicable statutory deductions.</p>
              <p className="font-semibold">6. User Responsibilities</p>
              <p>Users must:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide genuine information.</li>
                <li>Follow workplace and platform policies.</li>
                <li>Avoid fraudulent, abusive, or unlawful activities.</li>
                <li>Maintain confidentiality of company information.</li>
              </ul>
              <p className="font-semibold">7. Account Suspension</p>
              <p>ATW reserves the right to suspend or terminate any account that violates these Terms, submits fraudulent information, or misuses the platform.</p>
              <p className="font-semibold">8. Governing Law</p>
              <p>These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts at Jaipur, Rajasthan.</p>
              <p className="text-sm text-gray-500 mt-4 italic">(Scroll to the end to accept)</p>
            </div>
            <div className="border-t rounded-2xl p-5 flex items-center justify-between relative z-10 bg-white">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modalCheckboxChecked}
                  onChange={handleModalCheckboxChange}
                  disabled={!hasScrolledToBottom}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-700">I have read and agree to the Terms and Conditions</span>
              </label>
              <button onClick={closeModal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[500px] flex flex-col relative z-10">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">Privacy Policy</h3>
              <button onClick={closePrivacyModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div ref={privacyContentRef} className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700" onScroll={handlePrivacyModalScroll}>
              <p>
                We collect the information you provide during registration (mobile number, name, Aadhaar, address,
                and bank details) solely to verify your identity, process job assignments, and enable salary payments.
              </p>
              <p>Your data is never sold to third parties and is shared only with employers you apply to work for.</p>
            </div>
            <div className="border-t rounded-2xl p-5 flex items-center justify-between relative z-10 bg-white">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyModalCheckboxChecked}
                  onChange={handlePrivacyModalCheckboxChange}
                  disabled={!privacyHasScrolledToBottom}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-700">I have read and agree to the Privacy Policy</span>
              </label>
              <button onClick={closePrivacyModal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
  );
};

export default WorkerSignup;
