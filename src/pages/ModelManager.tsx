import React from 'react';

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

            {/* Top Row: Active Model & Training Results */}
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
                                <span className="font-medium text-slate-800">11.14 M</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">GFLOPs</span>
                                <span className="font-medium text-slate-800">28.7</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Inference Time (CPU)</span>
                                <span className="font-medium text-slate-800">100.2ms</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 mb-2">Training ID: <span className="font-mono">TRN-2023-YOLOv8s</span></p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <p className="text-xs text-right text-emerald-600 mt-1 font-semibold">Ready</p>
                    </div>
                </div>

                {/* Model Training Results Overview */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                     <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-chart-line text-orange-500"></i> Model Training Results Overview
                    </h3>
                    <div className="flex gap-4 h-64">
                        <div className="flex-1 bg-slate-900 rounded-lg overflow-hidden relative group">
                            <img src="/train2/results.png" alt="Training Results" className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">Training Results Overview</div>
                        </div>
                        <div className="flex-1 bg-slate-900 rounded-lg overflow-hidden relative">
                             <img src="/train2/BoxPR_curve.png" alt="Precision-Recall Curve" className="w-full h-full object-cover" />
                             <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">Precision-Recall Curve</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Metrics Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Performance Benchmarks Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-chart-bar text-blue-500"></i> Performance Curves
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">Precision, Recall, and F1-score curves showing model performance.</p>
                    <div className="h-64">
                        <img src="/train2/BoxP_curve.png" alt="Precision Curve" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Class-wise Performance (Confusion Matrix) */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                     <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-project-diagram text-purple-500"></i> Confusion Matrix
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">Normalized confusion matrix visualizing classification accuracy per class.</p>
                    <div className="h-64">
                        <img src="/train2/confusion_matrix_normalized.png" alt="Confusion Matrix Normalized" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Other Metrics */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-table text-red-500"></i> Additional Metrics
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">Other relevant training and validation metrics.</p>
                    <div className="h-64">
                        <img src="/train2/results.png" alt="Training Metrics Overview" className="w-full h-full object-contain" />
                    </div>
                </div>

            </div>
        </div>
    );
};