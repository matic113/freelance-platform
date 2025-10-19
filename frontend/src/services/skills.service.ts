import { apiService } from './api';
import { 
  Skill, 
  FreelancerSkill, 
  AddSkillRequest, 
  UpdateSkillRequest 
} from '@/types/api';

export const skillsService = {
  // Get all available skills
  getAllSkills: async (): Promise<Skill[]> => {
    return apiService.get<Skill[]>('/skills');
  },

  // Get skills by category
  getSkillsByCategory: async (category: string): Promise<Skill[]> => {
    return apiService.get<Skill[]>(`/skills/category/${category}`);
  },

  // Search skills
  searchSkills: async (searchTerm: string): Promise<Skill[]> => {
    return apiService.get<Skill[]>('/skills/search', {
      params: { searchTerm },
    });
  },

  // Get all skill categories
  getAllCategories: async (): Promise<string[]> => {
    return apiService.get<string[]>('/skills/categories');
  },

  // Get current user's skills
  getCurrentUserSkills: async (): Promise<FreelancerSkill[]> => {
    return apiService.get<FreelancerSkill[]>('/skills/my-skills');
  },

  // Get freelancer's skills
  getFreelancerSkills: async (freelancerId: string): Promise<FreelancerSkill[]> => {
    return apiService.get<FreelancerSkill[]>(`/skills/freelancer/${freelancerId}`);
  },

  // Add skill to freelancer
  addSkill: async (request: AddSkillRequest): Promise<FreelancerSkill> => {
    return apiService.post<FreelancerSkill>('/skills/add', request);
  },

  // Update freelancer skill
  updateSkill: async (skillId: string, request: UpdateSkillRequest): Promise<FreelancerSkill> => {
    return apiService.put<FreelancerSkill>(`/skills/${skillId}`, request);
  },

  // Remove skill from freelancer
  removeSkill: async (skillId: string): Promise<void> => {
    return apiService.delete<void>(`/skills/${skillId}`);
  },
};
