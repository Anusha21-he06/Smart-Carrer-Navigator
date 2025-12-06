import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useAuth } from '../services/authContext';
import { Save, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfileSetup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile>({
    uid: user?.uid || '',
    email: user?.email || '',
    displayName: user?.displayName || '',
    skills: [],
    education: '',
    interests: [],
    targetRole: '',
    experienceLevel: 'Beginner',
    resumeText: ''
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentInterest, setCurrentInterest] = useState('');

  const addItem = (type: 'skills' | 'interests', value: string) => {
    if (value.trim()) {
      setProfile(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()]
      }));
    }
  };

  const removeItem = (type: 'skills' | 'interests', index: number) => {
    setProfile(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving to Firestore
    localStorage.setItem('user_profile', JSON.stringify(profile));
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4 border-b border-indigo-700">
          <h2 className="text-xl font-bold text-white">Setup Your Profile</h2>
          <p className="text-indigo-100 text-sm">Help our AI understand your goals</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Target Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Job Role</label>
            <input
              type="text"
              required
              placeholder="e.g. Frontend Developer, Data Scientist"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={profile.targetRole}
              onChange={e => setProfile({...profile, targetRole: e.target.value})}
            />
          </div>

          {/* Education & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Highest Education</label>
              <input
                type="text"
                placeholder="e.g. BS in Computer Science"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={profile.education}
                onChange={e => setProfile({...profile, education: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={profile.experienceLevel}
                onChange={e => setProfile({...profile, experienceLevel: e.target.value as any})}
              >
                <option value="Beginner">Beginner (0-2 years)</option>
                <option value="Intermediate">Intermediate (2-5 years)</option>
                <option value="Advanced">Advanced (5+ years)</option>
              </select>
            </div>
          </div>

          {/* Skills Tag Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a skill..."
                value={currentSkill}
                onChange={e => setCurrentSkill(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('skills', currentSkill);
                    setCurrentSkill('');
                  }
                }}
              />
              <button 
                type="button"
                onClick={() => { addItem('skills', currentSkill); setCurrentSkill(''); }}
                className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200 text-slate-600"
              >
                <Plus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span key={idx} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {skill}
                  <button type="button" onClick={() => removeItem('skills', idx)} className="hover:text-indigo-900"><X size={14}/></button>
                </span>
              ))}
            </div>
          </div>

           {/* Interests Tag Input */}
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Career Interests</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Add an interest..."
                value={currentInterest}
                onChange={e => setCurrentInterest(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('interests', currentInterest);
                    setCurrentInterest('');
                  }
                }}
              />
              <button 
                type="button"
                onClick={() => { addItem('interests', currentInterest); setCurrentInterest(''); }}
                className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200 text-slate-600"
              >
                <Plus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((int, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {int}
                  <button type="button" onClick={() => removeItem('interests', idx)} className="hover:text-emerald-900"><X size={14}/></button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              <Save size={20} />
              <span>Save & Generate Insights</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};