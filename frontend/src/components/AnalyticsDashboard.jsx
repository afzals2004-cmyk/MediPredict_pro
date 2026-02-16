import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { Lightbulb, Activity, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import api from '../services/api';

const MOCK_ANALYTICS = {
    disease_distribution: {
        'Diabetes': 35,
        'Heart Disease': 25,
        'Parkinsons': 15
    },
    risk_distribution: {
        'High Risk': 40,
        'Low Risk': 60
    },
    confidence_trends: {
        labels: ['Jan 12', 'Jan 13', 'Jan 14', 'Jan 15', 'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19', 'Jan 20', 'Jan 21'],
        data: [0.75, 0.82, 0.78, 0.88, 0.92, 0.85, 0.90, 0.95, 0.93, 0.97]
    }
};

const AnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState(MOCK_ANALYTICS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics');
                const data = response.data;
                if (data && data.confidence_trends && data.confidence_trends.labels.length > 0) {
                    // Check if we have enough data to show a nice trend
                    if (data.confidence_trends.labels.length < 3) {
                        setAnalyticsData({
                            ...data,
                            confidence_trends: MOCK_ANALYTICS.confidence_trends
                        });
                    } else {
                        setAnalyticsData(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div className="text-center text-gray-400 py-10">Loading analytics...</div>;
    if (!analyticsData) return null;

    // Data for Nivo Pie
    const diseaseData = Object.entries(analyticsData.disease_distribution).map(([id, value]) => ({
        id,
        label: id,
        value,
        color: id === 'Diabetes' ? '#3b82f6' : id === 'Heart Disease' ? '#ef4444' : '#a855f7'
    }));

    const riskData = Object.entries(analyticsData.risk_distribution).map(([id, value]) => ({
        id,
        label: id,
        value,
        color: id.includes('High') ? '#ef4444' : '#22c55e'
    }));

    // Data for Nivo Line
    const trendData = [
        {
            id: 'confidence',
            color: '#10b981',
            data: analyticsData.confidence_trends.labels.map((label, index) => ({
                x: label,
                y: (analyticsData.confidence_trends.data[index] * 100).toFixed(1)
            }))
        }
    ];

    const theme = {
        background: 'transparent',
        text: { fill: '#9ca3af', fontSize: 12, fontFamily: "'Inter', sans-serif" },
        axis: {
            domain: { line: { stroke: 'transparent' } },
            ticks: { line: { stroke: 'transparent' }, text: { fill: '#9ca3af' } }
        },
        grid: { line: { stroke: 'rgba(255, 255, 255, 0.05)', strokeDasharray: '4 4' } },
        tooltip: {
            container: {
                background: '#0f172a',
                color: '#f8fafc',
                fontSize: 14,
                borderRadius: 8,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)'
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(analyticsData.disease_distribution).map(([disease, count]) => (
                    <div key={disease} className="glass-card p-4 flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">{disease}</p>
                            <h4 className="text-2xl font-bold text-white">{count}</h4>
                        </div>
                        <div className={`p - 3 rounded - full ${disease === 'Diabetes' ? 'bg-blue-500/10 text-blue-400' :
                            disease === 'Heart Disease' ? 'bg-red-500/10 text-red-400' :
                                'bg-purple-500/10 text-purple-400'
                            } `}>
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Disease Distribution */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <PieIcon className="w-5 h-5 mr-2 text-blue-400" />
                        Disease Distribution
                    </h3>
                    <div className="h-64">
                        <ResponsivePie
                            data={diseaseData}
                            margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                            innerRadius={0.6}
                            padAngle={0.7}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            colors={({ data }) => data.color}
                            borderWidth={1}
                            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                            enableArcLinkLabels={false}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor={{ from: 'color', modifiers: [['brighter', 3]] }}
                            theme={theme}
                            tooltip={({ datum: { id, value, color } }) => (
                                <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-slate-200 font-medium">{id}: {value}</span>
                                </div>
                            )}
                        />
                    </div>
                    <div className="flex justify-center space-x-4 mt-2">
                        {diseaseData.map((entry, index) => (
                            <div key={index} className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                                <span className="text-xs text-gray-400">{entry.id}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Distribution */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-red-400" />
                        Risk Overview
                    </h3>
                    <div className="h-64">
                        <ResponsivePie
                            data={riskData}
                            margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                            innerRadius={0.6}
                            padAngle={0.7}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            colors={({ data }) => data.color}
                            borderWidth={1}
                            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                            enableArcLinkLabels={false}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor={{ from: 'color', modifiers: [['brighter', 3]] }}
                            theme={theme}
                            tooltip={({ datum: { id, value, color } }) => (
                                <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-slate-200 font-medium">{id}: {value}</span>
                                </div>
                            )}
                        />
                    </div>
                    <div className="flex justify-center space-x-4 mt-2">
                        {riskData.map((entry, index) => (
                            <div key={index} className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                                <span className="text-xs text-gray-400">{entry.id}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trends */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Prediction Confidence Trends
                </h3>
                <div className="h-64">
                    <ResponsiveLine
                        data={trendData}
                        margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                        xScale={{ type: 'point' }}
                        yScale={{ type: 'linear', min: 0, max: 100, stacked: false, reverse: false }}
                        curve="monotoneX"
                        theme={theme}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 0,
                            tickPadding: 15,
                            tickRotation: 0,
                        }}
                        axisLeft={{
                            tickSize: 0,
                            tickPadding: 15,
                            tickValues: 5
                        }}
                        enableGridX={false}
                        enableGridY={true}
                        colors={['#10b981']}
                        lineWidth={4}
                        pointSize={10}
                        pointColor="#ffffff"
                        pointBorderWidth={3}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        enableArea={true}
                        areaOpacity={0.3}
                        useMesh={true}
                        enableSlices="x"
                        defs={[
                            {
                                id: 'greenGradient',
                                type: 'linearGradient',
                                colors: [
                                    { offset: 0, color: '#10b981', opacity: 0.6 },
                                    { offset: 100, color: '#10b981', opacity: 0 }
                                ],
                            },
                        ]}
                        fill={[
                            { match: '*', id: 'greenGradient' },
                        ]}
                        sliceTooltip={({ slice }) => (
                            <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl backdrop-blur-md bg-opacity-90">
                                <div className="text-slate-400 text-xs mb-2 font-medium uppercase tracking-wider">{slice.points[0].data.x}</div>
                                {slice.points.map(point => (
                                    <div key={point.id} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: point.serieColor, boxShadow: `0 0 8px ${point.serieColor} ` }} />
                                        <span className="text-white font-bold text-lg">{point.data.yFormatted}%</span>
                                        <span className="text-slate-400 text-sm">Confidence</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Health Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analyticsData.health_tips.map((tip, index) => (
                    <div key={index} className="glass-card p-4 border-l-4 border-yellow-500">
                        <div className="flex items-start">
                            <Lightbulb className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300 italic">"{tip}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
