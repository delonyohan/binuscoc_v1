import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Brush
} from 'recharts';
import { DailyStat } from '../types';

interface DashboardChartsProps {
  data: DailyStat[];
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b'];

export const TrendChart: React.FC<DashboardChartsProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Violation Trends</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Brush dataKey="date" height={30} stroke="#cbd5e1" tickFormatter={() => ''} />
            <Bar dataKey="shorts" name="Shorts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sandals" name="Sandals" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sleeveless" name="Sleeveless" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const DistributionChart: React.FC<DashboardChartsProps> = ({ data }) => {
    const totalShorts = data.reduce((acc, cur) => acc + cur.shorts, 0);
    const totalSandals = data.reduce((acc, cur) => acc + cur.sandals, 0);
    const totalSleeveless = data.reduce((acc, cur) => acc + cur.sleeveless, 0);

    const pieData = [
        { name: 'Shorts', value: totalShorts },
        { name: 'Sandals', value: totalSandals },
        { name: 'Sleeveless', value: totalSleeveless },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Violation Distribution</h3>
            <div className="h-72 w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};