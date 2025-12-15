import { useState, memo } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff, User, Mail, Briefcase, Lock, Upload, Save, Building2, ShieldCheck } from "lucide-react";

// ---------------------------
// Reusable Input Component
// ---------------------------
const Input = ({ label, icon: Icon, error, disabled, className, ...props }) => (
    <div className={`mb-5 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            {Icon && <Icon size={14} className="text-gray-500" />} {label}
        </label>
        <div className="relative">
            <input
                {...props}
                disabled={disabled}
                className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200
                    ${disabled
                        ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed"
                        : "bg-white border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900"
                    }
                    ${error ? "border-red-400 focus:ring-red-100" : ""}
                `}
            />
            {disabled && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={14} />
                </div>
            )}
        </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Lock size={14} className="text-gray-500" /> {label}
            </label>
            <div className="relative">
                <input
                    type={isVisible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white pr-12 transition-all duration-200
                        ${error ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"}
                    `}
                />
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
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
        name: "Admin User",
        email: "admin@globaltech.com",
        job: "System Administrator",
        dept: "IT Operations",
        company: "Global Tech Solutions",
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
            setErrors((e) => ({ ...e, photo: "Only images allowed" }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors((e) => ({ ...e, photo: "Image must be under 5MB" }));
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

        if (form.newPassword) {
            if (strength.score < 4)
                e.newPassword = "Password too weak";
            if (form.newPassword !== form.confirmPassword)
                e.confirmPassword = "Passwords do not match";
            if (!form.currentPassword)
                e.currentPassword = "Required to set new password";
        }

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
            return;
        }

        toast.success("Profile Updated Successfully!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-8xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* ---------------------------
                        Left Column: Identity & Fixed Info (4 Cols)
                    --------------------------- */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="relative inline-block">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-md flex items-center justify-center">
                                    {photo ? (
                                        <img src={photo} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <User size={48} className="text-gray-400" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer shadow-sm transition-colors">
                                    <Upload size={16} />
                                    <input type="file" className="hidden" onChange={handlePhoto} accept="image/*" />
                                </label>
                            </div>

                            <h2 className="mt-4 text-lg font-bold text-gray-800">{form.name}</h2>
                            <p className="text-sm text-gray-500">{form.job}</p>

                            <div className="mt-6 pt-6 border-t border-gray-100 text-left">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Details</h3>

                                <Input label="Email Address" icon={Mail} value={form.email} disabled />
                                <Input label="Role" icon={ShieldCheck} value={form.job} disabled />
                                <Input label="Department" icon={Briefcase} value={form.dept} disabled />
                            </div>
                        </div>

                        {/* Company Info (Fixed) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Building2 size={14} /> Organization
                            </h3>
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <div className="font-semibold text-blue-900">{form.company}</div>
                                <div className="text-xs text-blue-600 mt-1">Enterprise License • Active</div>
                            </div>
                        </div>
                    </div>

                    {/* ---------------------------
                        Right Column: Editable Info & Security (8 Cols)
                    --------------------------- */}
                    <div className="lg:col-span-8 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                    <User size={20} className="text-blue-600" />
                                    Personal Information
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        value={form.name}
                                        onChange={(e) => update("name", e.target.value)}
                                        error={errors.name}
                                        className="col-span-2"
                                    />

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Professional Bio
                                        </label>
                                        <textarea
                                            value={form.bio}
                                            onChange={(e) => update("bio", e.target.value)}
                                            placeholder="Share a brief description about your role..."
                                            className="w-full p-4 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                                            maxLength={250}
                                        />
                                        <div className="flex justify-between mt-2">
                                            {errors.bio ? <p className="text-sm text-red-500">{errors.bio}</p> : <span></span>}
                                            <p className="text-xs text-gray-400">
                                                {form.bio.length}/250 characters
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                    <ShieldCheck size={20} className="text-blue-600" />
                                    Security & Password
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <PasswordInput
                                            label="Current Password"
                                            value={form.currentPassword}
                                            onChange={(e) => update("currentPassword", e.target.value)}
                                            error={errors.currentPassword}
                                        />
                                    </div>

                                    <PasswordInput
                                        label="New Password"
                                        value={form.newPassword}
                                        onChange={(e) => update("newPassword", e.target.value)}
                                        error={errors.newPassword}
                                    />

                                    <PasswordInput
                                        label="Confirm Password"
                                        value={form.confirmPassword}
                                        onChange={(e) => update("confirmPassword", e.target.value)}
                                        error={errors.confirmPassword}
                                    />

                                    {form.newPassword && (
                                        <div className="col-span-2 bg-gray-50 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Password Strength</span>
                                                <span className={`text-sm font-bold text-${strength.color}-600`}>
                                                    {strength.label}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-${strength.color}-500 transition-all duration-300`}
                                                    style={{ width: `${strength.score * 20}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-200 transition-all active:scale-95"
                                >
                                    <Save size={18} />
                                    Save Changes
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