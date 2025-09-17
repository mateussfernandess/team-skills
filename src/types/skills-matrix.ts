// Data model for Skills Matrix Application

export interface Skill {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
  skills_needed: { [skillId: string]: number }; // skill_id -> required_rank (1-3)
}

export interface Person {
  id: string;
  name: string;
  position_id: string;
  skills_acquired: { [skillId: string]: number }; // skill_id -> acquired_rank (1-3)
}

export interface SkillGap {
  skill: Skill;
  required: number;
  acquired: number;
  gap: number;
  status: 'deficit' | 'met' | 'excess' | 'not-required';
}

export interface CareerReadiness {
  position: Position;
  isReady: boolean;
  missingSkills: SkillGap[];
}

// Rank levels
export const SKILL_RANKS = {
  1: 'Beginner',
  2: 'Intermediate', 
  3: 'Advanced'
} as const;

export type SkillRank = keyof typeof SKILL_RANKS;