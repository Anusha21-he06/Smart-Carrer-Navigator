import React, { useEffect, useState } from 'react';
import { UserProfile, SkillGapAnalysis, CareerPath as CareerPathType } from '../types';
import { generateCareerPath, analyzeSkillGap } from '../services/geminiService';
import { Loader2, BookOpen, Code, Award, CheckCircle2 } from 'lucide-react';

export const CareerPath: React.FC = () => {
  const [roadmap, setRoadmap] = useState<CareerPathType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        const profile: UserProfile = JSON.parse(savedProfile);
        try {
          // We need gap analysis first to generate a good path
          const gaps = await analyzeSkillGap(profile);
          const path = await generateCareerPath(profile, gaps);
          setRoadmap(path);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchPath();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mb-4 text-indigo-600" size={48} />
        <h2 className="text-xl font-semibold">Generating Your Personalized Career Roadmap</h2>
        <p className="text-sm mt-2">Gemini is curating courses, projects, and certifications...</p>
      </div>
    );
  }

  if (!roadmap) return <div className="text-center p-10">No profile found. Please complete profile setup.</div>;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen size={16} />;
      case 'project': return <Code size={16} />;
      case 'certification': return <Award size={16} />;
      default: return <CheckCircle2 size={16} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Career Pathway: {roadmap.role}</h1>
            <p className="text-slate-500 mt-1">{roadmap.outlook}</p>
          </div>
          <div className="text-right">
            <span className="block text-sm text-slate-400">Estimated Salary</span>
            <span className="text-xl font-bold text-green-600">{roadmap.salaryRange}</span>
          </div>
        </div>
      </div>

      <div className="relative border-l-2 border-indigo-200 ml-4 md:ml-6 space-y-12 pb-12">
        {roadmap.milestones.map((milestone, index) => (
          <div key={index} className="relative pl-8 md:pl-12 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-0 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white shadow-sm group-hover:scale-110 transition-transform"></div>
            
            {/* Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">{milestone.title}</h3>
                <div className="flex items-center gap-3 mt-2 md:mt-0">
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
                    {getTypeIcon(milestone.type)}
                    {milestone.type}
                  </span>
                  <span className="text-sm text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                    {milestone.duration}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-600 mb-4">{milestone.description}</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recommended Resources / Actions</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                  {milestone.resources.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};