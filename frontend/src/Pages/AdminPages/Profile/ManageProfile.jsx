import React, { useState, useEffect, memo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../config/api.js";
import { toast } from "react-toastify";
import { 
    Eye, 
    EyeOff, 
    User as UserIcon, 
    Mail, 
    Briefcase, 
    Lock, 
    Upload, 
    Save, 
    Building2, 
    ShieldCheck, 
    Loader2, 
    CheckCircle2 
} from "lucide-react";

import { getErrorMessage } from "../../../utils/errorParser.js";

// ---------------------------
// Reusable Input Component
// ---------------------------
const Input = ({ label, icon: Icon, error, disabled, className, ...props }) => (
    <div className={`mb-5 ${className}`}>
        <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
            {Icon && <Icon size={14} className="text-indigo-500" />} {label}
        </label>
        <div className="relative group">
            <input
                {...props}
                disabled={disabled}
                className={`w-full px-4 py-3 border rounded-[1rem] transition-all duration-200 outline-none
                    ${disabled
                        ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed font-medium"
                        : "bg-white border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 font-bold"
                    }
                    ${error ? "border-rose-400 focus:ring-rose-100 placeholder:text-rose-200" : "placeholder:text-slate-300"}
                `}
            />
            {disabled && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <Lock size={14} />
                </div>
            )}
        </div>
        {error && <p className="text-[10px] font-black uppercase text-rose-500 mt-1.5 tracking-wider px-1">{error}</p>}
    </div>
);

// ---------------------------
// Password Strength Logic
// ---------------------------
const getStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "slate" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        { score: 1, label: "Vulnerable", color: "rose" },
        { score: 2, label: "Basic", color: "amber" },
        { score: 3, label: "Secure", color: "indigo" },
        { score: 4, label: "Unbreakable", color: "emerald" },
    ];

    return levels.find(l => l.score === score) || levels[0];
};

// ---------------------------
// Password Input Component 
// ---------------------------
const PasswordInput = ({ label, value, onChange, error, placeholder }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                <Lock size={14} className="text-indigo-500" /> {label}
            </label>
            <div className="relative group">
                <input
                    type={isVisible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 border rounded-[1rem] bg-white pr-12 transition-all duration-200 outline-none font-bold
                        ${error 
                            ? "border-rose-400 focus:ring-4 focus:ring-rose-100" 
                            : "border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
                        }
                    `}
                />
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {error && <p className="text-[10px] font-black uppercase text-rose-500 mt-1.5 tracking-wider px-1">{error}</p>}
        </div>
    );
};

// ---------------------------
// MAIN COMPONENT
// ---------------------------
const ProfileSettings = () => {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        name: "",
        email: "",
        job: "",
        dept: "",
        company: "",
        bio: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [photoFile, setPhotoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Fetch official Admin Profile data
    const { data: profileData, isLoading: isFetching } = useQuery({
        queryKey: ['adminProfile'],
        queryFn: async () => {
            const res = await api.get('admin/profile');
            return res.data.data;
        }
    });

    // Populate form with production data
    useEffect(() => {
        if (profileData) {
            setForm({
                name: profileData.fullName || "",
                email: profileData.email || "",
                job: "System Administrator", // Inherited for Admin
                dept: profileData.department || "Operations",
                company: profileData.organization || "VIRQA Authority",
                bio: profileData.professionalBio || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setPreviewUrl(profileData.profilePhoto);
        }
    }, [profileData]);

    const strength = getStrength(form.newPassword);

    // Update form text mutation
    const updateMutation = useMutation({
        mutationFn: async (formData) => {
            const res = await api.post('admin/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        },
        onSuccess: (data) => {
            toast.success("Identity Records Synchronized Successfully!", {
                icon: <CheckCircle2 className="text-emerald-500" />
            });
            queryClient.invalidateQueries(['adminProfile']);
            setForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, "Critical Synchronization Error"));
        }
    });

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file format. Please select an image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File oversized. Limit is 5MB for Cloud sync.");
            return;
        }

        setPhotoFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const validate = () => {
        let e = {};
        if (!form.name.trim()) e.name = "Public Identity Name is required";
        if (form.bio.length > 250) e.bio = "Biography has exceeded audit length limit";

        if (form.newPassword) {
            if (strength.score < 3) e.newPassword = "Security criteria not met (Need Stronger Password)";
            if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Security Token Mismatch (Passwords do not match)";
            if (!form.currentPassword) e.currentPassword = "Authorization required (Enter Current Password)";
        }

        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (Object.keys(v).length) {
            setErrors(v);
            return;
        }

        const formData = new FormData();
        formData.append("fullName", form.name);
        formData.append("professionalBio", form.bio);
        
        if (form.newPassword) {
            formData.append("password", form.newPassword);
            // In a real production environment, you might send currentPassword for verification too
        }

        if (photoFile) {
            formData.append("profilePhoto", photoFile);
        }

        updateMutation.mutate(formData);
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Accessing Secure Credential Vault...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity Management</h1>
                    </div>
                    <p className="text-slate-500 font-medium tracking-wide">Securely manage your global administrative identity and access tokens.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left Column: Fixed Identity Data */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/20 border border-slate-100 p-8 text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Building2 size={80} />
                            </div>

                            <div className="relative inline-block">
                                <div className="w-40 h-40 mx-auto rounded-[2.5rem] overflow-hidden bg-slate-100 ring-8 ring-white shadow-xl flex items-center justify-center border-2 border-slate-50">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 w-full h-full flex items-center justify-center">
                                            <UserIcon size={64} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl hover:bg-slate-900 cursor-pointer shadow-lg transition-all scale-100 hover:scale-110 active:scale-95 border-4 border-white">
                                    <Upload size={20} />
                                    <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                                </label>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{form.name || "Anonymous Admin"}</h2>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-emerald-200 shadow-lg"></span>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{form.job}</p>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-50 space-y-6 text-left">
                                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Official Sync Data</h3>
                                <Input label="Network Identifier" icon={Mail} value={form.email} disabled />
                                <Input label="Command Station" icon={Building2} value={form.company} disabled />
                                <Input label="Assigned Dept" icon={Briefcase} value={form.dept} disabled />
                            </div>
                        </div>

                        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle2 size={18} className="text-indigo-200" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-100">License Status</h4>
                                </div>
                                <p className="text-3xl font-black mb-2">Verified System Admin</p>
                                <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">You have full authority across the VIRQA Audit Engine and Employee Management layers.</p>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        </div>
                    </div>

                    {/* Right Column: Editable Identity Records */}
                    <div className="lg:col-span-8 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                            {/* Personal Records */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 lg:p-12">
                                <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <UserIcon size={24} className="text-indigo-600" />
                                    Identity Profile
                                </h3>

                                <div className="grid gap-8">
                                    <Input
                                        label="Display Full Name"
                                        placeholder="How should you appear in official reports?"
                                        value={form.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        error={errors.name}
                                    />

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                            Professional Narrative
                                        </label>
                                        <textarea
                                            value={form.bio}
                                            onChange={(e) => updateField("bio", e.target.value)}
                                            placeholder="Your professional summary for candidate observation..."
                                            className="w-full p-6 bg-slate-50/50 border border-slate-200 rounded-[1.5rem] h-40 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none font-bold placeholder:text-slate-300 text-slate-900"
                                            maxLength={250}
                                        />
                                        <div className="flex justify-between mt-3 px-1">
                                            {errors.bio ? <p className="text-[10px] font-black uppercase text-rose-500 tracking-wider">{errors.bio}</p> : <span></span>}
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                {form.bio.length} / 250 characters
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Module */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 lg:p-12">
                                <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <Lock size={24} className="text-indigo-600" />
                                    Security Tokens
                                </h3>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <PasswordInput
                                            label="Verification Key (Current)"
                                            placeholder="••••••••••••"
                                            value={form.currentPassword}
                                            onChange={(e) => updateField("currentPassword", e.target.value)}
                                            error={errors.currentPassword}
                                        />
                                    </div>

                                    <PasswordInput
                                        label="New Security Token"
                                        placeholder="Min. 8 characters"
                                        value={form.newPassword}
                                        onChange={(e) => updateField("newPassword", e.target.value)}
                                        error={errors.newPassword}
                                    />

                                    <PasswordInput
                                        label="Confirm Token"
                                        placeholder="Repeat new token"
                                        value={form.confirmPassword}
                                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                                        error={errors.confirmPassword}
                                    />

                                    {form.newPassword && (
                                        <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-6">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entropy Evaluation</span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest text-${strength.color}-600`}>
                                                    {strength.label}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-${strength.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out`}
                                                    style={{ width: `${(strength.score / 4) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Control */}
                            <div className="flex items-center justify-end gap-6 pt-4">
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                    Dismiss Changes
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="px-10 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center gap-3 active:scale-95 translate-y-0 hover:-translate-y-1"
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Syncing Identity...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Update Identity
                                        </>
                                    )}
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