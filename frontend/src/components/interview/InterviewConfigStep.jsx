import { useState } from 'react';
import { Hash, X, ChevronDown, Layers, Target, Gauge, BookOpen, Mic } from 'lucide-react';
import { toast } from 'react-toastify';

const DOMAINS = [
    'Web Development', 'Mobile Development', 'Backend Development', 'Frontend Development',
    'Full Stack Development', 'Data Science', 'Machine Learning', 'Artificial Intelligence',
    'DevOps', 'Cloud Computing', 'Cybersecurity', 'Database Administration',
    'Software Engineering', 'UI/UX Design', 'Project Management', 'Business Analysis',
    'IT Support', 'Network Engineering', 'Blockchain', 'QA & Testing',
    'Mathematics', 'Computer Science Fundamentals'
];

const SKILLS_LIBRARY = {
    'Web Development': ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'GraphQL', 'REST API'],
    'Backend Development': ['Node.js', 'Express.js', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'PHP', 'Laravel', 'Go', 'Rust', 'Microservices'],
    'Data Science': ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'SQL', 'R', 'Tableau', 'Power BI', 'Statistics'],
    'Machine Learning': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Neural Networks', 'NLP', 'Computer Vision', 'Reinforcement Learning', 'Feature Engineering'],
    'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'AWS', 'GCP', 'Azure', 'Terraform', 'Ansible', 'Linux', 'Bash'],
    'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS', 'Expo', 'Firebase', 'REST API'],
    'Database Administration': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Database Optimization', 'Indexing', 'Backup & Recovery'],
    'Cybersecurity': ['Network Security', 'Penetration Testing', 'OWASP', 'Firewalls', 'Encryption', 'SIEM', 'Incident Response', 'Vulnerability Assessment'],
    'Mathematics': ['Algebra', 'Calculus', 'Statistics', 'Linear Algebra', 'Discrete Mathematics', 'Probability', 'Number Theory'],
};

const EXPERIENCE_LEVELS = ['Fresh', 'Junior', 'Mid', 'Senior'];
const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

const DIFFICULTY_COLORS = {
    Easy: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Hard: 'bg-red-100 text-red-700 border-red-200',
};

const EXPERIENCE_COLORS = {
    Fresh: 'bg-purple-100 text-purple-700 border-purple-200',
    Junior: 'bg-blue-100 text-blue-700 border-blue-200',
    Mid: 'bg-orange-100 text-orange-700 border-orange-200',
    Senior: 'bg-gray-100 text-gray-700 border-gray-200',
};

const InterviewConfigStep = ({ formData, setFormData, onNext, onBack }) => {
    const [domain, setDomain] = useState(formData.domain || '');
    const [skills, setSkills] = useState(formData.skills || []);
    const [skillInput, setSkillInput] = useState('');
    const [experienceLevel, setExperienceLevel] = useState(formData.experienceLevel || 'Junior');
    const [difficulty, setDifficulty] = useState(formData.difficulty || 'Medium');
    const [jobDescription, setJobDescription] = useState(formData.jobDescription || '');

    const suggestedSkills = SKILLS_LIBRARY[domain] || [];

    const addSkill = (skill) => {
        const trimmed = skill.trim();
        if (!trimmed) return;
        if (skills.includes(trimmed)) { toast.warn('Skill already added'); return; }
        if (skills.length >= 10) { toast.warn('Maximum 10 skills'); return; }
        setSkills([...skills, trimmed]);
        setSkillInput('');
    };

    const removeSkill = (s) => setSkills(skills.filter(x => x !== s));

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill(skillInput);
        }
    };

    const handleNext = () => {
        if (!domain) { toast.error('Please select a domain'); return; }
        if (!experienceLevel) { toast.error('Please select an experience level'); return; }
        if (!difficulty) { toast.error('Please select a difficulty level'); return; }
        if (skills.length === 0) { toast.error('Add at least one skill to assess'); return; }

        setFormData({
            ...formData,
            domain,
            skills,
            experienceLevel,
            difficulty,
            jobDescription,
        });
        onNext();
    };

    return (
        <div className="space-y-5">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mic className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">Live AI voice interview</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        Questions are generated in real time from your configuration. Conversation length is guided by the session duration you set on the next step — no fixed question list.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
                <div className="space-y-5">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8 hover:border-blue-100 transition-colors">
                        <label className="flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                            <Layers className="w-4 h-4 text-blue-600" /> Domain <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={domain}
                                onChange={e => { setDomain(e.target.value); setSkills([]); }}
                                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-gray-50 focus:bg-white transition-all text-sm font-medium"
                            >
                                <option value="">— Select Domain —</option>
                                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8">
                        <label className="flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                            <Hash className="w-4 h-4 text-indigo-600" /> Skills to assess <span className="text-red-400">*</span>
                            <span className="ml-auto text-xs text-gray-300 font-bold">{skills.length}/10</span>
                        </label>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                                placeholder="Type a skill & press Enter"
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-gray-50 focus:bg-white transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => addSkill(skillInput)}
                                className="px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {skills.map(s => (
                                    <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                        {s}
                                        <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {suggestedSkills.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Suggested for {domain}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {suggestedSkills.map(s => !skills.includes(s) && (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => addSkill(s)}
                                            className="px-2.5 py-1 border border-gray-200 text-gray-600 rounded-full text-xs hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
                                        >
                                            + {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8">
                        <label className="flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                            <BookOpen className="w-4 h-4 text-blue-600" /> Interviewer focus / job description
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={e => setJobDescription(e.target.value)}
                            placeholder="Optional: role expectations, team context, or topics the AI should emphasize during the live conversation…"
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-all resize-none"
                        />
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8">
                        <label className="flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                            <Target className="w-4 h-4 text-purple-600" /> Experience level <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {EXPERIENCE_LEVELS.map(lvl => (
                                <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setExperienceLevel(lvl)}
                                    className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${experienceLevel === lvl
                                        ? EXPERIENCE_COLORS[lvl] + ' shadow-sm scale-[1.02]'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8">
                        <label className="flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                            <Gauge className="w-4 h-4 text-orange-600" /> Starting difficulty <span className="text-red-400">*</span>
                        </label>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            The AI adapts difficulty during the interview based on the candidate&apos;s answers.
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {DIFFICULTY_LEVELS.map(lvl => (
                                <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setDifficulty(lvl)}
                                    className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${difficulty === lvl
                                        ? DIFFICULTY_COLORS[lvl] + ' shadow-sm scale-[1.02]'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-2">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                    ← Back
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95 transition-all"
                >
                    Next: Schedule →
                </button>
            </div>
        </div>
    );
};

export default InterviewConfigStep;
