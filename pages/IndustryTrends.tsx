import React, { useEffect, useState } from 'react';
import { IndustryTrend, UserProfile } from '../types';
import { getIndustryTrends } from '../services/geminiService';
import { Loader2, TrendingUp, DollarSign, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const IndustryTrends: React.FC = () => {
  const [trends, setTrends] = useState<IndustryTrend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      const profile: UserProfile = JSON.parse(savedProfile);
      getIndustryTrends(profile.targetRole)
        .then(setTrends)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500">Analyzing live market data...</p>
      </div>
    );
  }

  if (!trends) return <div className="p-8 text-center">Set up your profile to see trends for your role.</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Market Insights: {trends.sector}</h1>
        <p className="text-slate-500">Real-time analysis based on industry data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={20}/></div>
            <h3 className="text-slate-500 font-medium">Demand Score</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{trends.demandScore}/100</p>
          <p className="text-sm text-slate-400 mt-1">Current market hiring intensity</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarSign size={20}/></div>
            <h3 className="text-slate-500 font-medium">Salary Growth</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">+{trends.salaryGrowth}%</p>
          <p className="text-sm text-slate-400 mt-1">Year-over-year estimation</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><TrendingUp size={20}/></div>
            <h3 className="text-slate-500 font-medium">Outlook</h3>
          </div>
          <p className="text-lg font-bold text-slate-800">Positive</p>
          <p className="text-sm text-slate-400 mt-1">High growth sector</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Demand Trend (Last 5 Years)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends.growthChart}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hot Skills */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">🔥 Trending Skills</h3>
          <div className="flex flex-col gap-3">
            {trends.topSkills.map((skill, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">{skill}</span>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-bold">Hot</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};