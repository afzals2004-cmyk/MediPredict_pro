import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, Clock, Search, Download } from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAnalytics, setShowAnalytics] = useState(false); // Toggle for dashboard

    // Filter States
    const [diseaseType, setDiseaseType] = useState('All');
    const [riskLevel, setRiskLevel] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const params = {};
            if (diseaseType !== 'All') params.disease_type = diseaseType;
            if (riskLevel !== 'All') params.risk_level = riskLevel;
            if (startDate) params.start_date = new Date(startDate).toISOString();
            if (endDate) params.end_date = new Date(endDate).toISOString();

            const response = await api.get('/history', { params });
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce fetch or fetch on filter change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchHistory();
        }, 500); // Debounce for text inputs slightly, though here we use dropdowns mainly.
        return () => clearTimeout(timeoutId);
    }, [diseaseType, riskLevel, startDate, endDate]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm">
                        <Clock className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Prediction History</h1>
                        <p className="text-gray-400">Track past diagnoses and reports</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors border ${showAnalytics
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                    </button>
                    <button onClick={fetchHistory} className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Analytics Dashboard Toggle */}
            {showAnalytics && (
                <div className="mb-8">
                    <AnalyticsDashboard />
                </div>
            )}

            {/* Advanced Search / Filters */}
            <div className="glass-card p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Disease Type</label>
                    <select
                        value={diseaseType}
                        onChange={(e) => setDiseaseType(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-gray-300 focus:outline-none focus:border-blue-500"
                    >
                        <option value="All">All Diseases</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Heart Disease">Heart Disease</option>
                        <option value="Parkinsons">Parkinsons</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Risk Level</label>
                    <select
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-gray-300 focus:outline-none focus:border-blue-500"
                    >
                        <option value="All">All Levels</option>
                        <option value="High Risk">High Risk / Positive</option>
                        <option value="Low Risk">Low Risk / Negative</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 text-left text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Date & Time</th>
                                <th className="p-4 font-medium">Disease Type</th>
                                <th className="p-4 font-medium">Result</th>
                                <th className="p-4 font-medium">Confidence</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">Loading history...</td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">No history found matching filters.</td>
                                </tr>
                            ) : (
                                history.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        className="hover:bg-white/5 transition-colors"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td className="p-4 text-gray-300">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${item.disease_type === 'Diabetes' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                                item.disease_type === 'Heart Disease' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                                                    'border-purple-500/30 bg-purple-500/10 text-purple-400'
                                                }`}>
                                                {item.disease_type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium">
                                            <span className={item.prediction.includes('High') || item.prediction.includes('Positive') ? 'text-red-400' : 'text-green-400'}>
                                                {item.prediction}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {(item.probability * 100).toFixed(1)}%
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
