import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getDashboardStats } from "../services/dashboardService";

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async() => {
            const res = await getDashboardStats();
            setStats(res.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if(!stats || !stats.patternMastery) {
        return <div className="p-10">No analytics data available.</div>
    }

    if(loading) {
        return <div className="p-10">Loading analytics...</div>
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 p-10 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Analytics</h1>

                {/* Pattern Comparision Table */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-10">
                    <h2 className="text-xl font-semibold mb-4">
                        Pattern Breakdown
                    </h2>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Pattern</th>
                                <th>Mastery</th>
                                <th>Trend</th>
                                <th>Risk</th>
                                <th>Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.patternMastery?.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-3 font-medium">
                                        {item.pattern}
                                    </td>
                                    <td>{item.masteryScore}%</td>
                                    <td>
                                        {item.trend === "improving" && "Improving"}
                                        {item.trend === "declining" && "Declining"}
                                        {item.trend === "stable" && "Stable"}
                                    </td>
                                    <td>
                                        {item.isAtRisk ? (
                                            <span className="text-red-600 font-medium">
                                                At Risk
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>{item.interviewWeight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Focus Score Ranking */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-10">
                    <h2 className="text-xl font-semibold mb-4">
                        Focus Priority Ranking
                    </h2>

                    {stats.patternMastery
                        .sort((a, b) => b.focusScore - a.focusScore)
                        .map((item, index) => (
                            <div key={index} className="flex justify-between py-2 border-b">
                                <span>{item.pattern}</span>
                                <span className="font-medium">
                                {Math.round(item.focusScore)}
                                </span>
                            </div>
                        ))}
                    </div>

                {/* Readiness Breakdown */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">
                        Interview Readiness Score
                    </h2>
                    <p className="text-4xl font-bold text-indigo-600 mb-2">
                        {stats.interviewReadiness}%
                    </p>
                    <p className="text-gray-600">
                        Calculated using weighted mastery, trend penalties,
                        risk signals, and confidence adjustments.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;