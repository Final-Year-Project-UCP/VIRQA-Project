import { useState, memo } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff, User, Mail, Briefcase, Lock, Upload, Save } from "lucide-react";


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
        }`}
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
  const [form, setForm] = useState({
    name: "Alex Doe",
    email: "alex.doe@company.com",
    job: "Human Resources Manager",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);

  const strength = getStrength(form.newPassword);

  // ---------------------------
  // Update handler
  // ---------------------------
  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

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

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  // ---------------------------
  // Validation Before Submit
  // ---------------------------
  const validate = () => {
    let e = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (form.bio.length > 250) e.bio = "Bio must be under 250 characters";

    if (form.newPassword && strength.score < 4)
      e.newPassword = "Password must be strong (uppercase, lowercase, number, special)";

    if (form.newPassword && form.newPassword !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    if (form.newPassword && !form.currentPassword)
      e.currentPassword = "Enter current password to update";

    return e;
  };

  // ----------------------------
  // Submit Handler
  // ----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();

    if (Object.keys(v).length) {
      setErrors(v);
      toast.error("Please fix the errors in the form");
      return;
    }

    toast.success("Profile Updated Successfully!");
  };

  return (
    <div className="min-h-screen py-5">
      <div className="max-w-5xl mx-[2%]">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
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
                {photo ? (
                  <img src={photo} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User size={50} className="text-gray-400" />
                )}
              </div>

              <label className="mt-4 block text-center cursor-pointer px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <Upload size={18} /> Upload Photo
                <input type="file" className="hidden" onChange={handlePhoto} accept="image/*" />
              </label>

              {errors.photo && <p className="text-sm text-red-500 mt-1 text-center">{errors.photo}</p>}
            </div>

            {/* Personal Info */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-4">Personal Info</h3>

              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                error={errors.name}
              />

              <Input label="Email" icon={Mail} value={form.email} disabled />

              <Input label="Job Title" icon={Briefcase} value={form.job} disabled />
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
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="Tell something about yourself..."
                className="w-full p-4 border border-gray-300 bg-gray-50 rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-500"
                maxLength={250}
              />
              <div className="flex justify-between mt-2">
                {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
                <p className="text-sm text-gray-500 ml-auto">
                  {form.bio.length}/250 characters
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
                value={form.currentPassword}
                onChange={(e) => update("currentPassword", e.target.value)}
                error={errors.currentPassword}
              />

              <PasswordInput
                label="New Password"
                value={form.newPassword}
                onChange={(e) => update("newPassword", e.target.value)}
                error={errors.newPassword}
              />

              {/* Strength Bar */}
              {form.newPassword && (
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
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProfileSettings);