import axios from "axios";

export const getConfidenceAnalytics = async() => {
    const token = localStorage.getItem("token");
    return axios.get("http://localhost:8080/api/analytics/confidence", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};