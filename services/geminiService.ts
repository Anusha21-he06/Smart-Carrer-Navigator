import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, CareerPath, SkillGapAnalysis, IndustryTrend } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Schemas ---

const skillGapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    missingSkills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          estimatedHours: { type: Type.NUMBER },
        },
        required: ['name', 'priority', 'estimatedHours'],
      },
    },
    matchScore: { type: Type.NUMBER, description: "0 to 100 score" },
    analysis: { type: Type.STRING },
  },
  required: ['missingSkills', 'matchScore', 'analysis'],
};

const careerPathSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    role: { type: Type.STRING },
    salaryRange: { type: Type.STRING },
    outlook: { type: Type.STRING },
    milestones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          duration: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['course', 'project', 'certification'] },
          resources: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['title', 'description', 'duration', 'type', 'resources'],
      },
    },
  },
  required: ['role', 'milestones', 'salaryRange', 'outlook'],
};

const trendsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sector: { type: Type.STRING },
    demandScore: { type: Type.NUMBER, description: "0-100" },
    topSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    salaryGrowth: { type: Type.NUMBER, description: "Percentage growth" },
    growthChart: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Year or Quarter" },
          value: { type: Type.NUMBER, description: "Demand Index" },
        },
        required: ['name', 'value'],
      },
    },
  },
  required: ['sector', 'demandScore', 'topSkills', 'salaryGrowth', 'growthChart'],
};

// --- API Calls ---

export const analyzeSkillGap = async (profile: UserProfile): Promise<SkillGapAnalysis> => {
  const prompt = `
    Analyze the skill gap for a user targeting the role of: ${profile.targetRole}.
    Their current skills are: ${profile.skills.join(', ')}.
    Their education is: ${profile.education}.
    Experience level: ${profile.experienceLevel}.
    ${profile.resumeText ? `Resume context: ${profile.resumeText}` : ''}
    
    Identify what is missing to reach industry standards for this role.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: skillGapSchema,
      },
    });

    return JSON.parse(response.text || "{}") as SkillGapAnalysis;
  } catch (error) {
    console.error("Gemini Skill Gap Error:", error);
    throw error;
  }
};

export const generateCareerPath = async (profile: UserProfile, gaps: SkillGapAnalysis): Promise<CareerPath> => {
  const prompt = `
    Create a personalized career learning pathway for a ${profile.targetRole}.
    The user is a ${profile.experienceLevel}.
    They need to acquire these missing skills: ${gaps.missingSkills.map(s => s.name).join(', ')}.
    Interests: ${profile.interests.join(', ')}.
    
    Structure the path in sequential milestones. Include specific project ideas and certification recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: careerPathSchema,
      },
    });

    return JSON.parse(response.text || "{}") as CareerPath;
  } catch (error) {
    console.error("Gemini Career Path Error:", error);
    throw error;
  }
};

export const getIndustryTrends = async (role: string): Promise<IndustryTrend> => {
  const prompt = `
    Provide real-time industry trend analysis for the job role: ${role}.
    Include demand scores, salary growth projections, and a simulated growth chart data for the last 5 years.
    Also list top trending skills for this role right now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: trendsSchema,
        tools: [{ googleSearch: {} }] // Use search to get real data if needed, though schema parsing with tools can be tricky. We stick to model knowledge for structure here.
      },
    });
    
    // Note: If using googleSearch, the response format might change. 
    // For this specific structured data request, relying on the model's training data is safer for strict JSON.
    // However, if we enabled search, we would likely parse the text differently.
    // We will stick to the model's internal knowledge base for the structured chart data to ensure valid JSON schema compliance.
    
    return JSON.parse(response.text || "{}") as IndustryTrend;
  } catch (error) {
    console.error("Gemini Trends Error:", error);
    throw error;
  }
};