import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../config/api.js";
import ExecutiveAssessmentReport from "../../../components/interview/ExecutiveAssessmentReport.jsx";
import { Loader2, XCircle, ArrowLeft } from "lucide-react";

const EmployerCandidateResult = () => {
    const { sessionId, candidateId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["employer-candidate-result", sessionId, candidateId],
        queryFn: async () => {
            const res = await api.get(`employee/interview/${sessionId}/candidate/${candidateId}/result`);
            return res.data?.data;
        },
        retry: 1,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-gray-500 font-medium">Loading evaluation report…</p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 p-6">
                <XCircle className="w-14 h-14 text-red-400" />
                <h1 className="text-xl font-bold text-gray-700">Report Not Found</h1>
                <p className="text-sm text-gray-400 max-w-sm text-center">
                    {error?.response?.data?.message || "No completed evaluation found for this candidate."}
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mt-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    return (
        <ExecutiveAssessmentReport
            data={data}
            onBack={() => navigate(-1)}
            isEmployer={true}
        />
    );
};

export default EmployerCandidateResult;
