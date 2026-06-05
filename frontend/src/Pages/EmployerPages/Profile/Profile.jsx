import { useState, useRef, memo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Eye, EyeOff, User, Mail, Briefcase, Lock, Upload, Save, Loader2 } from "lucide-react";
import { api } from "../../../config/api.js";
import { getErrorMessage } from "../../../utils/errorParser";

// ---------------------------
// Reusable Input Component
// ---------------------------
const Input = ({ label, icon: Icon, error, ...props }) => (
  <div className="mb-5">
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
      {Icon && <Icon size={14} />} {label}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:ring-2 transition ${error ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);


// ---------------------------
// Password Strength Function
// ---------------------------
const getStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["red", "orange", "yellow", "green", "emerald"];

  return {
    score,
    label: labels[score - 1] || "",
    color: colors[score - 1] || "gray",
  };
};


// ---------------------------
// Password Input Component
// ---------------------------
const PasswordInput = ({ label, value, onChange, error }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 pr-12 focus:ring-2 transition ${error ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};


// ---------------------------
// MAIN COMPONENT
// ---------------------------
const ProfileSettings = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ---------------------------
  // Fetch Profile (TanStack)
  // ---------------------------
  const { data: profile, isLoading } = useQuery({
    queryKey: ["employeeProfile"],
    queryFn: async () => {
      const res = await api.get("/employee/profile");
      return res.data?.data;
    },
    staleTime: 60_000,
  });

  // Sync form state once data is available
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setBio(profile.professionalBio || "");
    }
  }, [profile]);

  const strength = getStrength(passwords.newPassword);

  // ---------------------------
  // Update Profile Mutation
  // ---------------------------
  const updateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (fullName) formData.append("fullName", fullName);
      if (bio) formData.append("professionalBio", bio);
      if (photoFile) formData.append("profilePhoto", photoFile);
      return api.post("/employee/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    },
    onSuccess: () => {
      toast.success("Profile Updated Successfully!");
      queryClient.invalidateQueries({ queryKey: ["employeeProfile"] });
      setPhotoFile(null);
      setPhotoPreview(null);
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to update profile")),
  });

  // ---------------------------
  // Change Password Mutation
  // ---------------------------
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      return api.post("/employee/profile", {
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to update password")),
  });

  // ---------------------------
  // Photo Upload Validation
  // ---------------------------
  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      const msg = "Only images allowed";
      setErrors((e) => ({ ...e, photo: msg }));
      toast.error(msg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = "Image must be under 5MB";
      setErrors((e) => ({ ...e, photo: msg }));
      toast.error(msg);
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ---------------------------
  // Submit Profile Info
  // ---------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!fullName.trim()) errs.name = "Name is required";
    if (bio.length > 250) errs.bio = "Bio must be under 250 characters";

    if (passwords.newPassword && strength.score < 4)
      errs.newPassword = "Password must be strong (uppercase, lowercase, number, special)";

    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    if (passwords.newPassword && !passwords.currentPassword)
      errs.currentPassword = "Enter current password to update";

    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error("Please fix the errors in the form");
      return;
    }

    setErrors({});

    // Run profile update
    updateMutation.mutate();

    // If password fields filled, also change password
    if (passwords.newPassword && passwords.currentPassword) {
      changePasswordMutation.mutate();
    }
  };

  const isSubmitting = updateMutation.isPending || changePasswordMutation.isPending;
  const displayPhoto = photoPreview || profile?.profilePhoto;

  // ---------------------------
  // Loading skeleton
  // ---------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <p className="text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User size={28} /> Profile Settings
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ---------------------------
              Left Column
          --------------------------- */}
          <div className="space-y-6">
            {/* Photo */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-4">Profile Photo</h3>

              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {displayPhoto ? (
                  <img src={displayPhoto} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User size={50} className="text-gray-400" />
                )}
              </div>

              <label className="mt-4 block text-center cursor-pointer px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <Upload size={18} /> Upload Photo
                <input type="file" className="hidden" onChange={handlePhoto} accept="image/*" ref={fileInputRef} />
              </label>

              {errors.photo && <p className="text-sm text-red-500 mt-1 text-center">{errors.photo}</p>}
              {photoPreview && <p className="text-xs text-blue-600 mt-2 text-center">New photo ready — save to apply</p>}
            </div>

            {/* Personal Info */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-4">Personal Info</h3>

              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                error={errors.name}
              />

              <Input label="Email" icon={Mail} value={profile?.email || ""} disabled />

              <Input label="Job Title" icon={Briefcase} value={profile?.jobTitle || ""} disabled />
            </div>
          </div>

          {/* ---------------------------
              Right Column
          --------------------------- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-4">Professional Bio</h3>
              <textarea
                value={bio}
                onChange={(e) => { setBio(e.target.value); setErrors(p => ({ ...p, bio: "" })); }}
                placeholder="Tell something about yourself..."
                className="w-full p-4 border border-gray-300 bg-gray-50 rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-500"
                maxLength={250}
              />
              <div className="flex justify-between mt-2">
                {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
                <p className="text-sm text-gray-500 ml-auto">
                  {bio.length}/250 characters
                </p>
              </div>
            </div>

            {/* Security */}
            <form className="bg-white p-6 rounded-xl shadow" onSubmit={handleSubmit}>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
                <Lock /> Security Settings
              </h3>

              <PasswordInput
                label="Current Password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                error={errors.currentPassword}
              />

              <PasswordInput
                label="New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                error={errors.newPassword}
              />

              {/* Strength Bar */}
              {passwords.newPassword && (
                <div className="mb-5">
                  <p className={`text-sm font-medium text-${strength.color}-600`}>
                    Strength: {strength.label}
                  </p>
                  <div className="bg-gray-200 h-2 w-full rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${strength.color}-500 transition`}
                      style={{ width: `${strength.score * 20}%` }}
                    />
                  </div>
                </div>
              )}

              <PasswordInput
                label="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                error={errors.confirmPassword}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Saving...</>
                  ) : (
                    <><Save size={18} /> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
};

export default memo(ProfileSettings);