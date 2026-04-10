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
            completed: !!profileData?.level,
            description: 'Junior, Mid, Senior, etc.'
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
