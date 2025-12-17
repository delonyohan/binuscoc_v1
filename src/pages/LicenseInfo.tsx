import React from 'react';

export const LicenseInfo: React.FC = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">License & Information</h1>
            <p className="text-slate-500 mb-8">System details, legal information, and credits.</p>

            <div className="space-y-6">
                {/* System Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">System Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-slate-500">Application Name</p>
                            <p className="font-medium text-slate-800">Binuscoc - Dress Code Enforcement</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Version</p>
                            <p className="font-medium text-slate-800">v2.1.0 (Stable)</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Build Date</p>
                            <p className="font-medium text-slate-800">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Environment</p>
                            <p className="font-medium text-slate-800">Production / Docker</p>
                        </div>
                    </div>
                </div>

                {/* License */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">License</h2>
                    <div className="prose prose-sm text-slate-600">
                        <p className="mb-4">
                            <strong>MIT License</strong>
                        </p>
                        <p className="mb-4">
                            Copyright (c) 2024 Binuscoc Development Team
                        </p>
                        <p className="mb-4">
                            Permission is hereby granted, free of charge, to any person obtaining a copy
                            of this software and associated documentation files (the "Software"), to deal
                            in the Software without restriction, including without limitation the rights
                            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                            copies of the Software, and to permit persons to whom the Software is
                            furnished to do so, subject to the following conditions:
                        </p>
                        <p className="mb-4">
                            The above copyright notice and this permission notice shall be included in all
                            copies or substantial portions of the Software.
                        </p>
                        <p>
                            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                            SOFTWARE.
                        </p>
                    </div>
                </div>

                 {/* Credits & Tech Stack */}
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Technology Stack & Credits</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <i className="fab fa-react text-2xl text-blue-500 mb-2"></i>
                            <p className="font-semibold text-sm text-slate-700">React 19</p>
                        </div>
                         <div className="p-4 bg-slate-50 rounded-lg">
                            <i className="fas fa-chart-line text-2xl text-emerald-500 mb-2"></i>
                            <p className="font-semibold text-sm text-slate-700">Recharts</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <i className="fab fa-docker text-2xl text-blue-600 mb-2"></i>
                            <p className="font-semibold text-sm text-slate-700">Docker</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};