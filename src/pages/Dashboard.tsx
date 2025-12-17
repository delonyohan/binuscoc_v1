import React from 'react';
import { TrendChart, DistributionChart } from '../components/DashboardCharts';
import { DailyStat } from '../types';

const MOCK_DATA: DailyStat[] = [
    { date: 'Mon', shorts: 0, sleeveless_top: 0, opened_foot: 0, total: 0 },
    { date: 'Tue', shorts: 0, sleeveless_top: 0, opened_foot: 0, total: 0 },
    { date: 'Wed', shorts: 0, sleeveless_top: 0, opened_foot: 0, total: 0 },
    { date: 'Thu', shorts: 0, sleeveless_top: 0, opened_foot: 0, total: 0 },
    { date: 'Fri', shorts: 0, sleeveless_top: 0, opened_foot: 0, total: 0 },
    { date: 'Sat', shorts: 0, sleeveless_top: 0, opened_foot: 0, total: 0 },
    { date: 'Sun', shorts: 0, sleeveless_top: 0, opened_foot: 0, total: 0 },
];

export const Dashboard: React.FC = () => {
    const totalDetections = 0;
    const violationsToday = 0;
    const complianceRate = 100;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="mb-6">
                <h1 className="text-3xl font-extrabold text-slate-800">Compliance Dashboard</h1>
                <p className="text-slate-500 mt-2">
                    Binus Campus Outfit Check (BinusCoC) is an innovative application designed with a focus on delivering a superior user interface and an intuitive user experience. It automatically monitors and ensures compliance with campus dress code policies using advanced object detection. This modern, efficient, and data-driven approach maintains a consistent and respectful academic environment, significantly reducing manual effort and providing clear, actionable insights into compliance trends.
                </p>
                <p className="text-slate-500 mt-2">
                    This dashboard provides an overview of dress code compliance across the campus,
                    utilizing real-time object detection to identify potential violations.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <i className="fas fa-camera text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Detections</p>
                            <h4 className="text-2xl font-bold text-slate-800">{totalDetections}</h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full">
                            <i className="fas fa-exclamation-circle text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Violations Today</p>
                            <h4 className="text-2xl font-bold text-slate-800">{violationsToday}</h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                            <i className="fas fa-shield-alt text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Compliance Rate</p>
                            <h4 className="text-2xl font-bold text-slate-800">{complianceRate}%</h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                            <i className="fas fa-code-branch text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Model Version</p>
                            <h4 className="text-2xl font-bold text-slate-800">YOLOv8s</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendChart data={MOCK_DATA} />
                <DistributionChart data={MOCK_DATA} />
            </div>
        </div>
    );
};
