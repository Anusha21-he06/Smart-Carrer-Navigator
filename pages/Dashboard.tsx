import React, { useEffect, useState } from 'react';
import { UserProfile, SkillGapAnalysis } from '../types';
import { analyzeSkillGap } from '../services/geminiService';
import { Loader2, AlertTriangle, CheckCircle, ArrowRight, Award, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      
      // Call AI for gap analysis
      analyzeSkillGap(parsed)
        .then(data => setSkillAnalysis(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      // No profile, redirect to setup
      setLoading(false);
      navigate('/profile');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p>Analyzing profile with Gemini AI...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Hello, {profile.displayName || 'User'}!</h1>
        <p className="text-slate-500">Here is your AI-powered career overview for <span className="font-semibold text-indigo-600">{profile.targetRole}</span>.</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Role Match Score</h3>
            <Zap className="text-yellow-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-slate-800">{skillAnalysis?.matchScore || 0}%</span>
            <span className="text-sm text-slate-400 mb-1">readiness</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4">
            <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${skillAnalysis?.matchScore || 0}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Missing Skills</h3>
            <AlertTriangle className="text-orange-500" />
          </div>
          <span className="text-4xl font-bold text-slate-800">{skillAnalysis?.missingSkills.length || 0}</span>
          <p className="text-sm text-slate-400 mt-2">Core competencies to acquire</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Current Level</h3>
            <Award className="text-indigo-500" />
          </div>
          <span className="text-4xl font-bold text-slate-800 capitalize">{profile.experienceLevel}</span>
          <p className="text-sm text-slate-400 mt-2">Based on self-assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Skills List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Priority Skills to Learn</h2>
          <div className="space-y-4">
            {skillAnalysis?.missingSkills.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${skill.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  <span className="font-medium text-slate-700">{skill.name}</span>
                </div>
                <div className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded border border-slate-200">
                  {skill.estimatedHours} hrs est.
                </div>
              </div>
            ))}
            {(!skillAnalysis || skillAnalysis.missingSkills.length === 0) && (
              <p className="text-slate-400 italic">No major skill gaps identified. Great job!</p>
            )}
          </div>
        </div>

        {/* AI Analysis Text */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-xl shadow-sm text-white p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-white/20 p-1 rounded">AI</span>
              Career Analysis
            </h2>
            <p className="text-indigo-100 leading-relaxed text-sm md:text-base">
              {skillAnalysis?.analysis || "Pending analysis..."}
            </p>
            
            <Link to="/pathway" className="inline-flex items-center gap-2 mt-6 bg-white text-indigo-900 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
              View Recommended Roadmap <ArrowRight size={16} />
            </Link>
          </div>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};