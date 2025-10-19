import { useState, useEffect } from 'react';
import { skillsService } from '@/services/skills.service';
import { 
  Skill, 
  FreelancerSkill, 
  AddSkillRequest, 
  UpdateSkillRequest 
} from '@/types/api';

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<FreelancerSkill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all skills
  const loadSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const skillsData = await skillsService.getAllSkills();
      setSkills(skillsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  // Load skill categories
  const loadCategories = async () => {
    try {
      const categoriesData = await skillsService.getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  // Load current user's skills
  const loadUserSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const userSkillsData = await skillsService.getCurrentUserSkills();
      console.log('Fetched user skills:', userSkillsData);
      setUserSkills(userSkillsData);
    } catch (err) {
      console.error('Error loading user skills:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user skills');
    } finally {
      setLoading(false);
    }
  };

  // Search skills
  const searchSkills = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      await loadSkills();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const searchResults = await skillsService.searchSkills(searchTerm);
      setSkills(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search skills');
    } finally {
      setLoading(false);
    }
  };

  // Add skill
  const addSkill = async (request: AddSkillRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newSkill = await skillsService.addSkill(request);
      setUserSkills(prev => [...prev, newSkill]);
      return newSkill;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add skill');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update skill
  const updateSkill = async (skillId: string, request: UpdateSkillRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSkill = await skillsService.updateSkill(skillId, request);
      setUserSkills(prev => 
        prev.map(skill => 
          skill.id === skillId ? updatedSkill : skill
        )
      );
      return updatedSkill;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update skill');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove skill
  const removeSkill = async (skillId: string) => {
    setLoading(true);
    setError(null);
    try {
      await skillsService.removeSkill(skillId);
      setUserSkills(prev => prev.filter(skill => skill.id !== skillId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove skill');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize
  useEffect(() => {
    loadSkills();
    loadCategories();
    loadUserSkills();
  }, []);

  return {
    skills,
    userSkills,
    categories,
    loading,
    error,
    loadSkills,
    loadCategories,
    loadUserSkills,
    searchSkills,
    addSkill,
    updateSkill,
    removeSkill,
  };
};
