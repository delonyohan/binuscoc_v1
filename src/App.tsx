import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LiveMonitor } from './pages/LiveMonitor';
import { Dashboard } from './pages/Dashboard';
import { ModelManager } from './pages/ModelManager';
import { LicenseInfo } from './pages/LicenseInfo';
import { PolicyChat } from './pages/PolicyChat';

const NavLink: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <Link 
            to={to} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
        >
            <i className={`fas ${icon} w-5 text-center`}></i>
            <span className="font-medium">{label}</span>
        </Link>
    );
};

const LiveClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-lg border border-slate-700 mx-4 mb-4">
            <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">System Time</span>
            <div className="text-white text-2xl font-mono font-bold tracking-widest">
                {time.toLocaleTimeString('en-GB', { hour12: false })}
            </div>
            <div className="text-slate-500 text-xs mt-1">
                {time.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
        </div>
    );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-slate-50">
            <aside className="w-64 bg-slate-900 flex flex-col fixed h-full z-10 shadow-2xl">
                <div className="p-6">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold shadow-lg shadow-blue-900/20">B</div>
                        <span className="text-xl font-bold tracking-tight">Binuscoc</span>
                    </div>
                </div>
                
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavLink to="/" icon="fa-chart-pie" label="Dashboard" />
                    <NavLink to="/live" icon="fa-video" label="Live Monitor" />
                    <NavLink to="/models" icon="fa-server" label="Model Manager" />
                    <NavLink to="/policy" icon="fa-balance-scale" label="Policy Assistant" />
                    <NavLink to="/license" icon="fa-info-circle" label="License & Info" />
                </nav>

                <div className="mt-auto">
                    <LiveClock />
                </div>
            </aside>

            <main className="flex-1 ml-64 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

const App: React.FC = () => {
  return (
    <HashRouter>
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/live" element={<LiveMonitor />} />
                <Route path="/models" element={<ModelManager />} />
                <Route path="/policy" element={<PolicyChat />} />
                <Route path="/license" element={<LicenseInfo />} />
            </Routes>
        </Layout>
    </HashRouter>
  );
};

export default App;