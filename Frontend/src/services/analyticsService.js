import axios from "axios";

export const getConfidenceAnalytics = async() => {
    const token = localStorage.getItem("token");
    return axios.get("/api/analytics/confidence", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};