import api from "./api";

export const getAllProblems = async() => {
    const response = await api.get("/api/problems");
    return response.data;
};

export const getProblemBySlug = async(slug) => {
    const response = await api.get(`/api/problems/${slug}`);
    return response.data;
};