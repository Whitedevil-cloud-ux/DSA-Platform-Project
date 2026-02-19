import api from "./api";

export const submitProblem = async(payload) => {
    const response = await api.post("/api/submissions", payload);
    return response.data;
};
