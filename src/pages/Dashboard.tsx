import React from 'react';
import { TrendChart, DistributionChart } from '../components/DashboardCharts';
import { DailyStat } from '../types';

const MOCK_DATA: DailyStat[] = [
    { date: 'Mon', shorts: 12, sandals: 8, sleeveless: 3, total: 23 },
    { date: 'Tue', shorts: 15, sandals: 5, sleeveless: 6, total: 26 },
    { date: 'Wed', shorts: 8, sandals: 12, sleeveless: 4, total: 24 },
    { date: 'Thu', shorts: 20, sandals: 15, sleeveless: 2, total: 37 },
    { date: 'Fri', shorts: 25, sandals: 22, sleeveless: 8, total: 55 },
    { date: 'Sat', shorts: 5, sandals: 3, sleeveless: 1, total: 9 },
    { date: 'Sun', shorts: 2, sandals: 1, sleeveless: 0, total: 3 },
];

export const Dashboard: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500">Overview of campus dress code compliance</p>
                </div>
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <i className="fas fa-download mr-2"></i> Export CSV
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <i className="fas fa-users text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Detections</p>
                            <h4 className="text-2xl font-bold text-slate-800">177</h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full">
                            <i className="fas fa-exclamation-triangle text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Violations Today</p>
                            <h4 className="text-2xl font-bold text-slate-800">14</h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                            <i className="fas fa-check-circle text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Compliance Rate</p>
                            <h4 className="text-2xl font-bold text-slate-800">92%</h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                            <i className="fas fa-server text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Model Version</p>
                            <h4 className="text-2xl font-bold text-slate-800">v2.1.0</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendChart data={MOCK_DATA} />
                <DistributionChart data={MOCK_DATA} />
            </div>
        </div>
    );
};
