import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, Brain, ArrowRight, Users, TrendingUp, Search } from 'lucide-react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { getStats } from '../services/api';

const MOCK_DATA = {
    total_predictions: 1245,
    disease_breakdown: {
        'Diabetes': 450,
        'Heart Disease': 320,
        'Parkinsons': 210
    },
    predictions_over_time: {
        labels: ['Jan 12', 'Jan 13', 'Jan 14', 'Jan 15', 'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19', 'Jan 20', 'Jan 21'],
        data: [15, 22, 18, 25, 30, 28, 35, 42, 38, 45]
    },
    recent_activity: [
        { disease: 'Diabetes', date: '2024-01-21', result: 'High Risk' },
        { disease: 'Heart Disease', date: '2024-01-20', result: 'Normal' },
        { disease: 'Parkinsons', date: '2024-01-19', result: 'Detected' },
        { disease: 'Diabetes', date: '2024-01-18', result: 'Normal' },
        { disease: 'Heart Disease', date: '2024-01-17', result: 'High Risk' },
    ]
};

const Home = () => {
    const [stats, setStats] = useState(MOCK_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                if (data && data.total_predictions > 0) {
                    // Check if we have enough data for a trend line (at least 3 points)
                    // If not, keep the mock predictions_over_time for visualization
                    if (data.predictions_over_time.data.length < 3) {
                        setStats({
                            ...data,
                            predictions_over_time: MOCK_DATA.predictions_over_time,
                            // Optional: also keep mock recent activity if real is empty
                            recent_activity: data.recent_activity.length > 0 ? data.recent_activity : MOCK_DATA.recent_activity
                        });
                    } else {
                        setStats(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Memoize chart data preparation to prevent recalculation on every render
    const diseaseData = useMemo(() => {
        if (!stats) return [];
        return [
            { disease: 'Diabetes', count: stats.disease_breakdown.Diabetes, color: '#3b82f6' },
            { disease: 'Heart', count: stats.disease_breakdown['Heart Disease'], color: '#ef4444' },
            { disease: 'Parkinsons', count: stats.disease_breakdown.Parkinsons, color: '#a855f7' },
        ];
    }, [stats]);

    // Memoize trend data preparation
    const trendData = useMemo(() => {
        if (!stats) return [];
        return [
            {
                id: 'predictions',
                color: '#a855f7',
                data: stats.predictions_over_time.labels.map((date, index) => ({
                    x: date,
                    y: stats.predictions_over_time.data[index]
                }))
            }
        ];
    }, [stats]);

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
        <div className="space-y-6 md:space-y-10 text-gray-100">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-0 relative pt-16 md:pt-0">
                <div className="space-y-2 md:space-y-3">
                    <div className="inline-block">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3 animate-fade-in">
                            Dashboard Overview
                        </h1>
                    </div>
                    <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Real-time health analytics and prediction metrics powered by AI
                    </p>
                </div>
                <div className="hidden md:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="glass px-6 py-3 rounded-2xl text-sm border-green-500/20">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full pulse-medical"></div>
                            <span className="text-gray-400">System Status:</span>
                            <span className="text-green-400 font-semibold">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards with 3D Effect */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <StatCard
                        icon={Users}
                        label="Total Predictions"
                        value={stats?.total_predictions || 0}
                        color="cyan"
                        loading={loading}
                    />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <StatCard
                        icon={Activity}
                        label="Most Common"
                        value={stats && stats.disease_breakdown ? Object.keys(stats.disease_breakdown).reduce((a, b) => stats.disease_breakdown[a] > stats.disease_breakdown[b] ? a : b) : '-'}
                        color="blue"
                        loading={loading}
                    />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <StatCard
                        icon={TrendingUp}
                        label="Active Models"
                        value="3"
                        color="purple"
                        loading={loading}
                    />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <div className="glass-card">
                        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-blue-400" />
                            <span>Disease Distribution</span>
                        </h3>
                        <div className="h-56 sm:h-64 md:h-72">
                            <ResponsiveBar
                                data={diseaseData}
                                keys={['count']}
                                indexBy="disease"
                                margin={{ top: 10, right: 10, bottom: 30, left: 30 }}
                                padding={0.4}
                                valueScale={{ type: 'linear' }}
                                indexScale={{ type: 'band', round: true }}
                                colors={({ data }) => data.color}
                                theme={theme}
                                borderRadius={4}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{ tickSize: 0, tickPadding: 10 }}
                                axisLeft={{ tickSize: 0, tickPadding: 10 }}
                                enableGridY={true}
                                enableLabel={false}
                                role="application"
                                ariaLabel="Disease distribution chart"
                                tooltip={({ id, value, color }) => (
                                    <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                        <span className="text-slate-200 font-medium">{id}: {value}</span>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                            <span>Predictions Over Time</span>
                        </h3>
                        <div className="h-64 sm:h-72 md:h-80">
                            <ResponsiveLine
                                data={trendData}
                                margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                                xScale={{ type: 'point' }}
                                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                                curve="monotoneX"
                                theme={theme}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 0,
                                    tickPadding: 15,
                                    tickRotation: 0,
                                    legend: '',
                                    legendOffset: 36,
                                    legendPosition: 'middle'
                                }}
                                axisLeft={{
                                    tickSize: 0,
                                    tickPadding: 15,
                                    tickRotation: 0,
                                    legend: '',
                                    legendOffset: -40,
                                    legendPosition: 'middle',
                                    tickValues: 5
                                }}
                                enableGridX={false}
                                enableGridY={true}
                                colors={['#a855f7']}
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
                                        id: 'purpleGradient',
                                        type: 'linearGradient',
                                        colors: [
                                            { offset: 0, color: '#a855f7', opacity: 0.6 },
                                            { offset: 100, color: '#a855f7', opacity: 0 }
                                        ],
                                    },
                                ]}
                                fill={[
                                    { match: '*', id: 'purpleGradient' },
                                ]}
                                sliceTooltip={({ slice }) => (
                                    <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl backdrop-blur-md bg-opacity-90">
                                        <div className="text-slate-400 text-xs mb-2 font-medium uppercase tracking-wider">{slice.points[0].data.x}</div>
                                        {slice.points.map(point => (
                                            <div key={point.id} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: point.serieColor, boxShadow: `0 0 8px ${point.serieColor}` }} />
                                                <span className="text-white font-bold text-lg">{point.data.yFormatted}</span>
                                                <span className="text-slate-400 text-sm">Cases</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <span>Recent Activity</span>
                        </h3>
                        <div className="space-y-4">
                            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                                stats.recent_activity.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-2 h-2 rounded-full ${item.result.includes('High') || item.result === 'Positive' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                            <div>
                                                <p className="font-medium text-white">{item.disease}</p>
                                                <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-medium ${item.result.includes('High') || item.result === 'Positive' ? 'text-red-400' : 'text-green-400'}`}>
                                            {item.result}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No recent activity.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Access & Tips */}
                <div className="space-y-6">
                    <div className="glass-card">
                        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                            <Search className="w-5 h-5 text-purple-400" />
                            <span>Quick Access</span>
                        </h3>
                        <div className="grid gap-4">
                            <ModelLink to="/diabetes" name="Diabetes" desc="Glucose, BMI & Insulin analysis" color="blue" />
                            <ModelLink to="/heart" name="Heart Disease" desc="Cardiovascular health assessment" color="red" />
                            <ModelLink to="/parkinsons" name="Parkinson's" desc="Vocal frequency analysis" color="purple" />
                        </div>
                    </div>

                    <div className="glass-card bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30">
                        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-indigo-300">
                            <Brain className="w-5 h-5" />
                            <span>Health Tips</span>
                        </h3>
                        <div className="space-y-3">
                            {stats?.health_tips ? (
                                stats.health_tips.map((tip, idx) => (
                                    <div key={idx} className="flex items-start space-x-2 text-sm text-indigo-100/80">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                        <p>{tip}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">Loading tips...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = React.memo(({ icon: Icon, label, value, color, loading }) => {
    const colorClasses = {
        cyan: {
            bg: 'from-cyan-500/20 to-cyan-600/10',
            text: 'text-cyan-400',
            glow: 'group-hover:shadow-cyan-500/50',
            border: 'border-cyan-500/20'
        },
        blue: {
            bg: 'from-blue-500/20 to-blue-600/10',
            text: 'text-blue-400',
            glow: 'group-hover:shadow-blue-500/50',
            border: 'border-blue-500/20'
        },
        purple: {
            bg: 'from-purple-500/20 to-purple-600/10',
            text: 'text-purple-400',
            glow: 'group-hover:shadow-purple-500/50',
            border: 'border-purple-500/20'
        },
        red: {
            bg: 'from-red-500/20 to-red-600/10',
            text: 'text-red-400',
            glow: 'group-hover:shadow-red-500/50',
            border: 'border-red-500/20'
        },
    };

    const styles = colorClasses[color] || colorClasses.cyan;

    return (
        <div className="stat-card card-3d group relative overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${styles.bg} ${styles.text} icon-glow transition-all duration-300 border ${styles.border}`}>
                        <Icon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">{label}</p>
                        {loading ? (
                            <div className="h-9 w-28 bg-white/10 animate-pulse rounded-lg mt-1"></div>
                        ) : (
                            <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
                        )}
                    </div>
                </div>
            </div>
            {/* Hover gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
        </div>
    );
});

const ModelLink = React.memo(({ to, name, desc, color }) => {
    const colorClasses = {
        blue: { dot: 'bg-blue-400', hoverText: 'group-hover:text-blue-300' },
        green: { dot: 'bg-green-400', hoverText: 'group-hover:text-green-300' },
        purple: { dot: 'bg-purple-400', hoverText: 'group-hover:text-purple-300' },
        red: { dot: 'bg-red-400', hoverText: 'group-hover:text-red-300' },
    };

    const styles = colorClasses[color] || colorClasses.blue;

    return (
        <Link to={to} className="group block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${styles.dot} group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-shadow`}></div>
                    <div>
                        <h4 className={`font-semibold text-lg ${styles.hoverText} transition-colors`}>{name}</h4>
                        <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
        </Link>
    );
});

export default Home;
