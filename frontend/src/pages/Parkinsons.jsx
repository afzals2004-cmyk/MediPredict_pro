import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { predictParkinsons, generateReport } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import RiskGauge from '../components/RiskGauge';
import { AlertCircle, CheckCircle, FileDown, Brain as BrainIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Parkinsons = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const prediction = await predictParkinsons(data);
            setResult({ ...prediction, inputData: data });
        } catch (err) {
            setError('Failed to get prediction. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        if (!result) return;
        setReportLoading(true);
        try {
            const blob = await generateReport('parkinsons', result.inputData, result.prediction, result.probability);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'parkinsons_report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Failed to download report', err);
            setError('Failed to generate report.');
        } finally {
            setReportLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-xl backdrop-blur-sm">
                    <BrainIcon className="w-8 h-8 text-purple-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Parkinson's Prediction</h1>
                    <p className="text-gray-400">Neurological health assessment</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card">
                    <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2 text-white">
                        <span>Vocal & Neurological Metrics</span>
                        <div className="h-px flex-1 bg-white/10 ml-4"></div>
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <Input label="MDVP:Fo(Hz)" type="number" step="any" {...register('Fo', { required: 'Required' })} error={errors.Fo} />
                            <Input label="MDVP:Fhi(Hz)" type="number" step="any" {...register('Fhi', { required: 'Required' })} error={errors.Fhi} />
                            <Input label="MDVP:Flo(Hz)" type="number" step="any" {...register('Flo', { required: 'Required' })} error={errors.Flo} />

                            <Input label="MDVP:Jitter(%)" type="number" step="any" {...register('Jitter_percent', { required: 'Required' })} error={errors.Jitter_percent} />
                            <Input label="MDVP:Jitter(Abs)" type="number" step="any" {...register('Jitter_Abs', { required: 'Required' })} error={errors.Jitter_Abs} />
                            <Input label="MDVP:RAP" type="number" step="any" {...register('RAP', { required: 'Required' })} error={errors.RAP} />

                            <Input label="MDVP:PPQ" type="number" step="any" {...register('PPQ', { required: 'Required' })} error={errors.PPQ} />
                            <Input label="Jitter:DDP" type="number" step="any" {...register('Jitter_DDP', { required: 'Required' })} error={errors.Jitter_DDP} />
                            <Input label="MDVP:Shimmer" type="number" step="any" {...register('Shimmer', { required: 'Required' })} error={errors.Shimmer} />

                            <Input label="MDVP:Shimmer(dB)" type="number" step="any" {...register('Shimmer_dB', { required: 'Required' })} error={errors.Shimmer_dB} />
                            <Input label="Shimmer:APQ3" type="number" step="any" {...register('APQ3', { required: 'Required' })} error={errors.APQ3} />
                            <Input label="Shimmer:APQ5" type="number" step="any" {...register('APQ5', { required: 'Required' })} error={errors.APQ5} />

                            <Input label="MDVP:APQ" type="number" step="any" {...register('APQ', { required: 'Required' })} error={errors.APQ} />
                            <Input label="Shimmer:DDA" type="number" step="any" {...register('Shimmer_DDA', { required: 'Required' })} error={errors.Shimmer_DDA} />
                            <Input label="NHR" type="number" step="any" {...register('NHR', { required: 'Required' })} error={errors.NHR} />

                            <Input label="HNR" type="number" step="any" {...register('HNR', { required: 'Required' })} error={errors.HNR} />
                            <Input label="RPDE" type="number" step="any" {...register('RPDE', { required: 'Required' })} error={errors.RPDE} />
                            <Input label="DFA" type="number" step="any" {...register('DFA', { required: 'Required' })} error={errors.DFA} />

                            <Input label="spread1" type="number" step="any" {...register('spread1', { required: 'Required' })} error={errors.spread1} />
                            <Input label="spread2" type="number" step="any" {...register('spread2', { required: 'Required' })} error={errors.spread2} />
                            <Input label="D2" type="number" step="any" {...register('D2', { required: 'Required' })} error={errors.D2} />

                            <Input label="PPE" type="number" step="any" {...register('PPE', { required: 'Required' })} error={errors.PPE} />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" isLoading={loading} className="w-full md:w-auto btn-primary">
                                Analyze Neurological Risk
                            </Button>
                        </div>
                        {error && <p className="text-red-400 text-sm mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
                    </form>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-card border-l-4 border-l-purple-500"
                            >
                                <h3 className="text-lg font-semibold text-white mb-6">Analysis Result</h3>
                                <div className="flex flex-col items-center">
                                    <RiskGauge probability={result.probability} />

                                    {result.insights && result.insights.length > 0 && (
                                        <div className="mt-6 w-full text-left bg-white/5 rounded-xl p-4 border border-white/10">
                                            <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center">
                                                <BrainIcon className="w-4 h-4 mr-2" />
                                                Smart Clinical Insights
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.insights.map((insight, idx) => (
                                                    <li key={idx} className="flex items-start text-xs text-gray-300">
                                                        <span className="mr-2 mt-1 text-purple-400">•</span>
                                                        {insight}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="mt-6 w-full">
                                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Feature Impact</h4>
                                        <div className="h-40">
                                            <Bar
                                                data={{
                                                    labels: ['Jitter', 'Shimmer', 'PPE', 'HNR'],
                                                    datasets: [{
                                                        label: 'Relative Impact (%)',
                                                        data: [
                                                            (result.inputData.Jitter_percent / 0.02) * 100,
                                                            (result.inputData.Shimmer / 0.1) * 100,
                                                            (result.inputData.PPE / 0.5) * 100,
                                                            (result.inputData.HNR / 30) * 100
                                                        ],
                                                        backgroundColor: 'rgba(168, 85, 247, 0.5)',
                                                        borderColor: 'rgb(168, 85, 247)',
                                                        borderWidth: 1
                                                    }]
                                                }}
                                                options={{
                                                    indexAxis: 'y',
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        x: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#9ca3af' } },
                                                        y: { grid: { display: false }, ticks: { color: '#9ca3af' } }
                                                    },
                                                    plugins: { legend: { display: false } }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className={`mt-6 px-4 py-2 rounded-full font-medium flex items-center space-x-2 ${result.is_danger ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-green-500/20 text-green-400 border border-green-500/20'
                                        }`}>
                                        {result.is_danger ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                        <span>{result.prediction}</span>
                                    </div>

                                    <div className="w-full mt-8 pt-6 border-t border-white/10">
                                        <Button
                                            variant="outline"
                                            className="w-full bg-white/5 hover:bg-white/10 text-white border-white/10"
                                            onClick={handleDownloadReport}
                                            isLoading={reportLoading}
                                        >
                                            <FileDown className="w-4 h-4 mr-2" />
                                            Download Complete Report
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-card text-center py-12 border-dashed border-2 border-white/10 bg-transparent"
                            >
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BrainIcon className="w-8 h-8 text-gray-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-300">Ready to Analyze</h3>
                                <p className="text-gray-500 mt-2 text-sm px-4">Fill out the clinical metrics form to generate a comprehensive clinical risk assessment.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Parkinsons;
