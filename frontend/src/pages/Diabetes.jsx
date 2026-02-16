import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { predictDiabetes, generateReport } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import RiskGauge from '../components/RiskGauge';
import { AlertCircle, CheckCircle, FileDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Diabetes = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const prediction = await predictDiabetes(data);
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
            const blob = await generateReport('diabetes', result.inputData, result.prediction, result.probability);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'diabetes_report.pdf');
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
                <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm">
                    <Activity className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Diabetes Prediction</h1>
                    <p className="text-gray-400">Advanced risk assessment</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card">
                    <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2 text-white">
                        <span>Patient Vitals</span>
                        <div className="h-px flex-1 bg-white/10 ml-4"></div>
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Pregnancies"
                                type="number"
                                placeholder="0"
                                {...register('Pregnancies', { required: 'Required', min: 0, max: 20 })}
                                error={errors.Pregnancies}
                            />
                            <Input
                                label="Glucose (mg/dL)"
                                type="number"
                                placeholder="80-200"
                                {...register('Glucose', { required: 'Required', min: 0, max: 300 })}
                                error={errors.Glucose}
                            />
                            <Input
                                label="Blood Pressure (mm Hg)"
                                type="number"
                                placeholder="60-140"
                                {...register('BloodPressure', { required: 'Required', min: 0, max: 200 })}
                                error={errors.BloodPressure}
                            />
                            <Input
                                label="Skin Thickness (mm)"
                                type="number"
                                placeholder="10-50"
                                {...register('SkinThickness', { required: 'Required', min: 0, max: 100 })}
                                error={errors.SkinThickness}
                            />
                            <Input
                                label="Insulin (mu U/ml)"
                                type="number"
                                placeholder="15-276"
                                {...register('Insulin', { required: 'Required', min: 0, max: 900 })}
                                error={errors.Insulin}
                            />
                            <Input
                                label="BMI"
                                type="number" step="0.1"
                                placeholder="18.5-40.0"
                                {...register('BMI', { required: 'Required', min: 0, max: 70 })}
                                error={errors.BMI}
                            />
                            <Input
                                label="Diabetes Pedigree Function"
                                type="number" step="0.001"
                                placeholder="0.08-2.42"
                                {...register('DiabetesPedigreeFunction', { required: 'Required', min: 0, max: 2.5 })}
                                error={errors.DiabetesPedigreeFunction}
                            />
                            <Input
                                label="Age"
                                type="number"
                                placeholder="21-81"
                                {...register('Age', { required: 'Required', min: 0, max: 120 })}
                                error={errors.Age}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" isLoading={loading} className="w-full md:w-auto btn-primary">
                                Analyze Risk
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
                                className="glass-card border-l-4 border-l-blue-500"
                            >
                                <h3 className="text-lg font-semibold text-white mb-6">Analysis Result</h3>
                                <div className="flex flex-col items-center">
                                    <RiskGauge probability={result.probability} />

                                    {result.insights && result.insights.length > 0 && (
                                        <div className="mt-6 w-full text-left bg-white/5 rounded-xl p-4 border border-white/10">
                                            <h4 className="text-sm font-semibold text-blue-300 mb-3 flex items-center">
                                                <Activity className="w-4 h-4 mr-2" />
                                                Smart Clinical Insights
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.insights.map((insight, idx) => (
                                                    <li key={idx} className="flex items-start text-xs text-gray-300">
                                                        <span className="mr-2 mt-1 text-blue-400">•</span>
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
                                                    labels: ['Glucose', 'BMI', 'BP', 'Age'],
                                                    datasets: [{
                                                        label: 'Relative Impact (%)',
                                                        data: [
                                                            (result.inputData.Glucose / 200) * 100,
                                                            (result.inputData.BMI / 50) * 100,
                                                            (result.inputData.BloodPressure / 120) * 100,
                                                            (result.inputData.Age / 100) * 100
                                                        ],
                                                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                                                        borderColor: 'rgb(59, 130, 246)',
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
                                    <Activity className="w-8 h-8 text-gray-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-300">Ready to Analyze</h3>
                                <p className="text-gray-500 mt-2 text-sm px-4">Fill out the patient vitals form to generate a comprehensive clinical risk assessment.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Diabetes;
