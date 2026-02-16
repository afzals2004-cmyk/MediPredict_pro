import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const RiskGauge = ({ probability }) => {
    // Probability is 0.0 to 1.0
    const percentage = (probability * 100).toFixed(1);
    const isHighRisk = probability > 0.5;

    const data = {
        labels: ['Risk', 'Safe'],
        datasets: [
            {
                data: [probability, 1 - probability],
                backgroundColor: [
                    probability > 0.7 ? '#ef4444' : probability > 0.3 ? '#f59e0b' : '#10b981',
                    'rgba(255, 255, 255, 0.1)', // Dark mode track color
                ],
                borderWidth: 0,
                circumference: 180,
                rotation: 270,
                borderRadius: 20,
            },
        ],
    };

    const options = {
        cutout: '75%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        animation: {
            animateScale: true,
            animateRotate: true,
        },
    };

    return (
        <div className="relative w-64 h-32 mx-auto flex justify-center items-end">
            <div className="absolute w-full h-full">
                <Doughnut data={data} options={options} />
            </div>
            <div className="text-center pb-2 z-10">
                <div className={`text-4xl font-bold bg-clip-text text-transparent ${isHighRisk
                        ? 'bg-gradient-to-r from-red-400 to-orange-400'
                        : 'bg-gradient-to-r from-green-400 to-emerald-400'
                    }`}>
                    {percentage}%
                </div>
                <div className="text-sm text-gray-400 font-medium tracking-wide uppercase mt-1">Probability</div>
            </div>
        </div>
    );
};

export default RiskGauge;
