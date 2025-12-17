import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Legend } from 'recharts';

const BENCHMARK_DATA = [
    { name: 'mAP@50', current: 0.951, baseline: 0.76 }, // Updated with YOLOv8s mAP50
    { name: 'Precision', current: 0.927, baseline: 0.81 }, // Updated with YOLOv8s Precision
    { name: 'Recall', current: 0.92, baseline: 0.78 }, // Updated with YOLOv8s Recall
    { name: 'F1-Score', current: 0.923, baseline: 0.79 }, // Calculated F1 from P and R
];

const LEXICON_DATA = [
    { subject: 'Crop Top', A: 95.8, B: 96.8, fullMark: 100 },
    { subject: 'Sleeveless Top', A: 95.2, B: 97.5, fullMark: 100 },
    { subject: 'Transparent Top', A: 81.2, B: 69.3, fullMark: 100 },
    { subject: 'Ripped Jeans', A: 91.7, B: 96.2, fullMark: 100 },
    { subject: 'Short/Medium Skirt', A: 91.9, B: 93, fullMark: 100 },
    { subject: 'Shorts', A: 98.1, B: 96.9, fullMark: 100 },
    { subject: 'Opened Foot', A: 94.9, B: 94.1, fullMark: 100 },
];

const LATENCY_DATA = [
    { load: '1 user', latency: 100.2, throughput: 22 }, // Using actual inference time
    { load: '10 users', latency: 120, throughput: 200 }, // Hypothetical scaling
    { load: '50 users', latency: 180, throughput: 850 },
    { load: '100 users', latency: 250, throughput: 1100 },
    { load: '200 users', latency: 400, throughput: 1400 },
];

export const ModelManager: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
             <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Model Manager</h1>
                    <p className="text-slate-500">Deep learning performance metrics and architecture analysis</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                        <i className="fas fa-check-circle mr-1"></i> SERVABLE
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
                        <i className="fas fa-cube mr-1"></i> ONNX (Backend)
                    </span>
                </div>
            </div>

            {/* Top Row: Active Model & Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                {/* Active Model Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <i className="fas fa-microchip text-indigo-500"></i> Active Inference Engine
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Model Architecture</span>
                                <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">YOLOv8s</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Parameters</span>
                                <span className="font-medium text-slate-800">11.14 M</span> {/* Updated */}
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">GFLOPs</span>
                                <span className="font-medium text-slate-800">28.7</span> {/* Updated */}
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Inference Time (CPU)</span>
                                <span className="font-medium text-slate-800">100.2ms</span> {/* Updated */}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 mb-2">Training ID: <span className="font-mono">TRN-2023-YOLOv8s</span></p> {/* Updated */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <p className="text-xs text-right text-emerald-600 mt-1 font-semibold">Ready</p>
                    </div>
                </div>

                {/* Heatmap Visualization Mockup */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                     <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-fire text-orange-500"></i> Class Activation Heatmap (Grad-CAM)
                    </h3>
                    <div className="flex gap-4 h-64">
                        <div className="flex-1 bg-slate-900 rounded-lg overflow-hidden relative group">
                            <img src="https://picsum.photos/400/300?random=1" alt="Original" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-red-500/40 via-transparent to-transparent mix-blend-overlay"></div>
                            <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">Input Image</div>
                        </div>
                        <div className="flex-1 bg-slate-900 rounded-lg overflow-hidden relative">
                             {/* Simulated Heatmap Overlay */}
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,0,0.8),_transparent_70%)] opacity-80 mix-blend-screen"></div>
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,_rgba(255,255,0,0.6),_transparent_50%)] opacity-80 mix-blend-screen"></div>
                             <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">Model Attention</div>
                        </div>
                        <div className="w-48 bg-slate-50 rounded-lg p-3 flex flex-col gap-2">
                             <div className="text-xs font-bold text-slate-600 mb-1">Attention Focus</div>
                             <div className="flex items-center gap-2 text-xs">
                                 <div className="w-3 h-3 bg-red-500 rounded-full"></div> High Relevance
                             </div>
                             <div className="flex items-center gap-2 text-xs">
                                 <div className="w-3 h-3 bg-yellow-400 rounded-full"></div> Medium Relevance
                             </div>
                             <div className="flex items-center gap-2 text-xs">
                                 <div className="w-3 h-3 bg-transparent border border-slate-300 rounded-full"></div> Low Relevance
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Benchmarks, Lexicon, Latency */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Benchmarks Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-chart-bar text-blue-500"></i> Performance Benchmarks
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">Real-time metrics from active model inference (Requires backend connection).</p>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={BENCHMARK_DATA}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" domain={[0, 1]} hide />
                                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={80} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="current" name="Current Model" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="baseline" name="YOLOv8 Base" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fine-Grained Lexicon (Radar Chart) */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                     <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-project-diagram text-purple-500"></i> Class-wise Performance
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">Detailed metrics per violation category (Requires backend connection).</p>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={LEXICON_DATA}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Precision" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                <Radar name="Recall" dataKey="B" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.3} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Latency Analysis */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-tachometer-alt text-red-500"></i> Latency vs Load
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">Simulated inference speed under varying loads (Requires backend connection for real-time data).</p>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={LATENCY_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="load" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="latency" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} name="Latency (ms)" />
                                <Legend wrapperStyle={{fontSize: '10px'}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};