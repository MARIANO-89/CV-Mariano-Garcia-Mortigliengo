// Database Types
export interface CVProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  avatar?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  socialMedia?: SocialMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialMedia {
  platform: string;
  url: string;
  username?: string;
}

export interface Experience {
  id: string;
  profileId: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
  website?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  profileId: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  fieldOfStudy?: string;
  description?: string;
  relevantCoursework?: string[];
  achievements?: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  profileId: string;
  name: string;
  category: string;
  level: string;
  yearsOfExperience?: number;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  profileId: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: string;
  technologies?: string[];
  keyFeatures?: string[];
  github?: string;
  demo?: string;
  images?: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  profileId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skillsValidated?: string[];
  requirements?: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Language {
  id: string;
  profileId: string;
  name: string;
  proficiency: string;
  speaking?: string;
  writing?: string;
  reading?: string;
  listening?: string;
  certifications?: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Translation {
  id: string;
  key: string;
  language: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

// Component Types
export interface ContactInfo {
  firstName: string;
  lastName: string;
  fullName?: string;
  title?: string;
  email: string;
  phone: string;
  location?: string;
  website?: string;
  avatar?: string;
  socialMedia?: SocialMedia[];
  availability?: string;
}

export interface ColorAnalysisResult {
  colors: {
    name: string;
    hex: string;
    rgb: string;
    hsl: string;
    usage: string;
  }[];
  fonts: {
    family: string;
    weight: string;
    size: string;
    usage: string;
  }[];
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export interface BackgroundTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  baseColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  settings: {
    [key: string]: any;
  };
}

// API Types
export interface APIResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface ProfileForm {
  firstName: string;
  lastName: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface ExperienceForm {
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
  website?: string;
}

export interface EducationForm {
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  fieldOfStudy?: string;
  description?: string;
  relevantCoursework?: string[];
  achievements?: string[];
}

export interface SkillForm {
  name: string;
  category: string;
  level: string;
  yearsOfExperience?: number;
  description?: string;
}

export interface ProjectForm {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: string;
  technologies?: string[];
  keyFeatures?: string[];
  github?: string;
  demo?: string;
}

export interface CertificationForm {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skillsValidated?: string[];
  requirements?: string[];
}

export interface LanguageForm {
  name: string;
  proficiency: string;
  speaking?: string;
  writing?: string;
  reading?: string;
  listening?: string;
  certifications?: string[];
}

// Utility Types
export type LanguageCode = 'es' | 'en';
export type Theme = 'light' | 'dark';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'on_hold';
export type ProficiencyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';

// Environment Types
declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_NODE_ENV: string;
    readonly VITE_DEBUG: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}