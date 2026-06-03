/**
 * True when the candidate has set seniority (level) or years of experience.
 * Profile UI saves `experience`; completion previously only checked `level`.
 */
export const hasExperienceLevel = (profileData) => {
    if (profileData?.level) return true;
    const exp = profileData?.experience;
    if (exp === undefined || exp === null || exp === '') return false;
    if (typeof exp === 'number') return exp > 0;
    const trimmed = String(exp).trim();
    if (!trimmed) return false;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num > 0 : trimmed.length > 0;
};

/**
 * Utility to calculate profile completion percentage and steps
 * @param {Object} profileData - The user profile data object
 * @returns {Object} { progress, steps, isComplete }
 */
export const calculateProfileCompletion = (profileData) => {
    const steps = [
        {
            id: 1,
            label: 'Basic Info',
            completed: !!profileData?.fullName && !!profileData?.email,
            description: 'Name and email address'
        },
        {
            id: 2,
            label: 'Profile Photo',
            completed: !!profileData?.profilePhoto,
            description: 'A professional profile picture'
        },
        {
            id: 3,
            label: 'Professional Bio',
            completed: !!profileData?.professionalBio,
            description: 'Brief summary of your background'
        },
        {
            id: 4,
            label: 'Experience Level',
            completed: hasExperienceLevel(profileData),
            description: 'Years of experience or seniority (Junior, Mid, Senior)'
        },
        {
            id: 5,
            label: 'Technical Skills',
            completed: profileData?.skills?.length > 0,
            description: 'Your core technology stack'
        },
        {
            id: 6,
            label: 'Contact Number',
            completed: !!profileData?.phoneNumber,
            description: 'Global reachability'
        },
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progress = Math.round((completedCount / steps.length) * 100);
    const isComplete = progress === 100;

    return {
        progress,
        steps,
        isComplete
    };
};
