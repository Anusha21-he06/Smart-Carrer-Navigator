import React from 'react';
import { useAuth } from '../services/authContext';
import { Navigate } from 'react-router-dom';
import { Compass, LogIn } from 'lucide-react';

export const Auth: React.FC = () => {
  const { user, signInWithGoogle, demoLogin } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        {/* Left Side - Brand */}
        <div className="md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-8">
              <Compass size={32} />
              <span className="text-2xl font-bold">Smart Career Navigator</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Shape Your Future with AI</h2>
            <p className="text-indigo-100 text-lg">
              Unlock personalized career paths, analyze industry trends, and bridge your skill gaps using the power of Google Gemini.
            </p>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        {/* Right Side - Login */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800">Welcome Back</h3>
            <p className="text-slate-500">Sign in to access your dashboard</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center space-x-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
              <span>Sign in with Google</span>
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or try without account</span>
              </div>
            </div>

            <button
              onClick={demoLogin}
              className="w-full flex items-center justify-center space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-md"
            >
              <LogIn size={20} />
              <span>Enter Demo Mode</span>
            </button>
          </div>
          
          <p className="mt-8 text-center text-xs text-slate-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};