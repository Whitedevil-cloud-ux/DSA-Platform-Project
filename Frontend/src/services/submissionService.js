import api from "./api";

export const submitProblem = async(payload) => {
    const response = await api.post("/api/submissions", payload);
    return response.data;
};

export const getProblemSubmissions = async(problemId) => {
    const response = await api.get(`/api/submissions/problem/${problemId}`);
    return response.data;
}

export const updateConfidence = async(submissionId, confidence) => {
    const response = await api.patch(`/api/submissions/${submissionId}/confidence`, { confidence });
    return response.data;
}
