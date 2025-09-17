import { Person, Position, Skill, SkillGap, CareerReadiness } from '@/types/skills-matrix';

/**
 * Calculate skill gaps for a person against their current position
 */
export function calculateSkillGaps(
  person: Person,
  position: Position,
  allSkills: Skill[]
): SkillGap[] {
  const gaps: SkillGap[] = [];
  
  // Create a map of all skills for easy lookup
  const skillsMap = new Map(allSkills.map(skill => [skill.id, skill]));
  
  // Check all skills the person has
  Object.keys(person.skills_acquired).forEach(skillId => {
    const skill = skillsMap.get(skillId);
    if (!skill) return;
    
    const acquired = person.skills_acquired[skillId];
    const required = position.skills_needed[skillId] || 0;
    const gap = acquired - required;
    
    let status: SkillGap['status'];
    if (required === 0) {
      status = 'not-required';
    } else if (gap < 0) {
      status = 'deficit';
    } else if (gap === 0) {
      status = 'met';
    } else {
      status = 'excess';
    }
    
    gaps.push({
      skill,
      required,
      acquired,
      gap,
      status
    });
  });
  
  // Check required skills that the person doesn't have
  Object.keys(position.skills_needed).forEach(skillId => {
    if (!person.skills_acquired[skillId]) {
      const skill = skillsMap.get(skillId);
      if (!skill) return;
      
      const required = position.skills_needed[skillId];
      gaps.push({
        skill,
        required,
        acquired: 0,
        gap: -required,
        status: 'deficit'
      });
    }
  });
  
  return gaps.sort((a, b) => a.skill.name.localeCompare(b.skill.name));
}

/**
 * Calculate what skills a person needs to move to a target position
 */
export function calculateSkillsNeededForPosition(
  person: Person,
  targetPosition: Position,
  allSkills: Skill[]
): SkillGap[] {
  const skillsMap = new Map(allSkills.map(skill => [skill.id, skill]));
  const neededSkills: SkillGap[] = [];
  
  Object.entries(targetPosition.skills_needed).forEach(([skillId, required]) => {
    const skill = skillsMap.get(skillId);
    if (!skill) return;
    
    const acquired = person.skills_acquired[skillId] || 0;
    const gap = acquired - required;
    
    if (gap < 0) {
      neededSkills.push({
        skill,
        required,
        acquired,
        gap,
        status: 'deficit'
      });
    }
  });
  
  return neededSkills.sort((a, b) => a.gap - b.gap); // Sort by largest gap first
}

/**
 * Find all positions a person is ready for (meets all requirements)
 */
export function findReadyPositions(
  person: Person,
  allPositions: Position[],
  allSkills: Skill[]
): CareerReadiness[] {
  return allPositions.map(position => {
    const missingSkills = calculateSkillsNeededForPosition(person, position, allSkills);
    const isReady = missingSkills.length === 0;
    
    return {
      position,
      isReady,
      missingSkills
    };
  }).sort((a, b) => {
    // Ready positions first, then by number of missing skills
    if (a.isReady && !b.isReady) return -1;
    if (!a.isReady && b.isReady) return 1;
    return a.missingSkills.length - b.missingSkills.length;
  });
}

/**
 * Get a color class based on skill gap status
 */
export function getSkillGapColorClass(status: SkillGap['status']): string {
  switch (status) {
    case 'deficit':
      return 'skill-gap-danger';
    case 'met':
    case 'excess':
      return 'skill-gap-success';
    case 'not-required':
      return 'skill-gap-neutral';
    default:
      return 'skill-gap-neutral';
  }
}