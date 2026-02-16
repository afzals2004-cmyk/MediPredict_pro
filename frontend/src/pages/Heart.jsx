import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { predictHeart, generateReport } from '../services/api';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import RiskGauge from '../components/RiskGauge';
import { AlertCircle, CheckCircle, FileDown, Heart as HeartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Heart = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const prediction = await predictHeart(data);
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
            const blob = await generateReport('heart', result.inputData, result.prediction, result.probability);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'heart_report.pdf');
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
                <div className="p-3 bg-red-500/20 rounded-xl backdrop-blur-sm">
                    <HeartIcon className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Heart Disease Prediction</h1>
                    <p className="text-gray-400">Cardiovascular health assessment</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card">
                    <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2 text-white">
                        <span>Clinical Vitals</span>
                        <div className="h-px flex-1 bg-white/10 ml-4"></div>
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Age" type="number" {...register('Age', { required: 'Required', min: 0, max: 120 })} error={errors.Age} />

                            <Select label="Sex" options={[{ value: 1, label: 'Male' }, { value: 0, label: 'Female' }]} {...register('Sex', { required: 'Required' })} error={errors.Sex} />

                            <Select label="Chest Pain Type" options={[{ value: 0, label: 'Typical Angina' }, { value: 1, label: 'Atypical Angina' }, { value: 2, label: 'Non-anginal Pain' }, { value: 3, label: 'Asymptomatic' }]} {...register('CP', { required: 'Required' })} error={errors.CP} />

                            <Input label="Resting Blood Pressure (mm Hg)" type="number" {...register('Trestbps', { required: 'Required', min: 0, max: 300 })} error={errors.Trestbps} />

                            <Input label="Serum Cholestoral (mg/dl)" type="number" {...register('Chol', { required: 'Required', min: 0, max: 600 })} error={errors.Chol} />

                            <Select label="Fasting Blood Sugar > 120 mg/dl" options={[{ value: 1, label: 'True' }, { value: 0, label: 'False' }]} {...register('FBS', { required: 'Required' })} error={errors.FBS} />

                            <Select label="Resting ECG Results" options={[{ value: 0, label: 'Normal' }, { value: 1, label: 'ST-T Wave Abnormality' }, { value: 2, label: 'Left Ventricular Hypertrophy' }]} {...register('RestECG', { required: 'Required' })} error={errors.RestECG} />

                            <Input label="Max Heart Rate Achieved" type="number" {...register('Thalach', { required: 'Required', min: 0, max: 250 })} error={errors.Thalach} />

                            <Select label="Exercise Induced Angina" options={[{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }]} {...register('Exang', { required: 'Required' })} error={errors.Exang} />

                            <Input label="ST Depression Induced by Exercise" type="number" step="0.1" {...register('Oldpeak', { required: 'Required', min: 0, max: 10 })} error={errors.Oldpeak} />

                            <Select label="Slope of Peak Exercise ST" options={[{ value: 0, label: 'Upsloping' }, { value: 1, label: 'Flat' }, { value: 2, label: 'Downsloping' }]} {...register('Slope', { required: 'Required' })} error={errors.Slope} />

                            <Select label="Number of Major Vessels (0-3)" options={[{ value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }]} {...register('CA', { required: 'Required' })} error={errors.CA} />

                            <Select label="Thalassemia" options={[{ value: 0, label: 'Normal' }, { value: 1, label: 'Fixed Defect' }, { value: 2, label: 'Reversable Defect' }]} {...register('Thal', { required: 'Required' })} error={errors.Thal} />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" isLoading={loading} className="w-full md:w-auto btn-primary">
                                Analyze Cardiovascular Health
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
                                className="glass-card border-l-4 border-l-red-500"
                            >
                                <h3 className="text-lg font-semibold text-white mb-6">Analysis Result</h3>
                                <div className="flex flex-col items-center">
                                    <RiskGauge probability={result.probability} />

                                    {result.insights && result.insights.length > 0 && (
                                        <div className="mt-6 w-full text-left bg-white/5 rounded-xl p-4 border border-white/10">
                                            <h4 className="text-sm font-semibold text-red-300 mb-3 flex items-center">
                                                <HeartIcon className="w-4 h-4 mr-2" />
                                                Smart Clinical Insights
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.insights.map((insight, idx) => (
                                                    <li key={idx} className="flex items-start text-xs text-gray-300">
                                                        <span className="mr-2 mt-1 text-red-400">•</span>
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
                                                    labels: ['Cholesterol', 'BP', 'Max HR', 'Age'],
                                                    datasets: [{
                                                        label: 'Relative Impact (%)',
                                                        data: [
                                                            (result.inputData.Chol / 400) * 100,
                                                            (result.inputData.Trestbps / 200) * 100,
                                                            (result.inputData.Thalach / 220) * 100,
                                                            (result.inputData.Age / 100) * 100
                                                        ],
                                                        backgroundColor: 'rgba(239, 68, 68, 0.5)',
                                                        borderColor: 'rgb(239, 68, 68)',
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
                                    <HeartIcon className="w-8 h-8 text-gray-500" />
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

export default Heart;
