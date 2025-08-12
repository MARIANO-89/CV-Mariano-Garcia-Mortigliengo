import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { 
  CVProfile, 
  Experience, 
  Education, 
  Skill, 
  Project, 
  Certification, 
  Language 
} from '../types';

interface UseCV {
  profile: CVProfile | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCV = (): UseCV => {
  const [profile, setProfile] = useState<CVProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('cv_profile')
        .select('*')
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      throw err;
    }
  };

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('startDate', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (err) {
      console.error('Error fetching experiences:', err);
      throw err;
    }
  };

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('startDate', { ascending: false });

      if (error) throw error;
      setEducation(data || []);
    } catch (err) {
      console.error('Error fetching education:', err);
      throw err;
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (err) {
      console.error('Error fetching skills:', err);
      throw err;
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('startDate', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      throw err;
    }
  };

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('issueDate', { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (err) {
      console.error('Error fetching certifications:', err);
      throw err;
    }
  };

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setLanguages(data || []);
    } catch (err) {
      console.error('Error fetching languages:', err);
      throw err;
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchProfile(),
        fetchExperiences(),
        fetchEducation(),
        fetchSkills(),
        fetchProjects(),
        fetchCertifications(),
        fetchLanguages()
      ]);
    } catch (err) {
      console.error('Error fetching CV data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    profile,
    experiences,
    education,
    skills,
    projects,
    certifications,
    languages,
    isLoading,
    error,
    refetch
  };
};