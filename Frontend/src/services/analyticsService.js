import api from "./api";

export const getConfidenceAnalytics = async() => {
    const response = await api.get("/api/analytics/confidence");
    return response.data.data;
};
