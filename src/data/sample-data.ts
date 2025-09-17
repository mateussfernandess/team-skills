import { Skill, Position, Person } from '@/types/skills-matrix';

// Sample Skills
export const skills: Skill[] = [
  { id: 's_comm', name: 'Communication' },
  { id: 's_cust_service', name: 'Customer Service' },
  { id: 's_data_analysis', name: 'Data Analysis' },
  { id: 's_project_mgmt', name: 'Project Management' },
  { id: 's_leadership', name: 'Leadership' },
  { id: 's_technical_writing', name: 'Technical Writing' },
  { id: 's_sql', name: 'SQL' },
  { id: 's_excel', name: 'Excel/Spreadsheets' },
  { id: 's_presentation', name: 'Presentation Skills' },
  { id: 's_problem_solving', name: 'Problem Solving' },
  { id: 's_team_collaboration', name: 'Team Collaboration' },
  { id: 's_strategic_thinking', name: 'Strategic Thinking' }
];

// Sample Positions
export const positions: Position[] = [
  {
    id: 'p_analyst',
    name: 'Data Analyst',
    skills_needed: {
      's_data_analysis': 3,
      's_sql': 3,
      's_excel': 2,
      's_comm': 2,
      's_technical_writing': 2,
      's_problem_solving': 2
    }
  },
  {
    id: 'p_cust_success',
    name: 'Customer Success Manager',
    skills_needed: {
      's_cust_service': 3,
      's_comm': 3,
      's_project_mgmt': 2,
      's_problem_solving': 2,
      's_presentation': 2,
      's_team_collaboration': 2
    }
  },
  {
    id: 'p_project_mgr',
    name: 'Project Manager',
    skills_needed: {
      's_project_mgmt': 3,
      's_leadership': 3,
      's_comm': 3,
      's_strategic_thinking': 2,
      's_presentation': 2,
      's_team_collaboration': 3
    }
  },
  {
    id: 'p_senior_analyst',
    name: 'Senior Data Analyst',
    skills_needed: {
      's_data_analysis': 3,
      's_sql': 3,
      's_excel': 3,
      's_comm': 3,
      's_technical_writing': 3,
      's_problem_solving': 3,
      's_presentation': 2,
      's_leadership': 2
    }
  },
  {
    id: 'p_coordinator',
    name: 'Coordinator',
    skills_needed: {
      's_comm': 2,
      's_team_collaboration': 2,
      's_project_mgmt': 1,
      's_excel': 1,
      's_problem_solving': 1
    }
  }
];

// Sample People
export const people: Person[] = [
  {
    id: 'e_jdoe',
    name: 'John Doe',
    position_id: 'p_analyst',
    skills_acquired: {
      's_data_analysis': 2,
      's_sql': 3,
      's_excel': 2,
      's_comm': 1,
      's_technical_writing': 1,
      's_problem_solving': 2,
      's_presentation': 2
    }
  },
  {
    id: 'e_asmith',
    name: 'Alice Smith',
    position_id: 'p_cust_success',
    skills_acquired: {
      's_cust_service': 3,
      's_comm': 3,
      's_project_mgmt': 2,
      's_problem_solving': 3,
      's_presentation': 3,
      's_team_collaboration': 2,
      's_leadership': 1
    }
  },
  {
    id: 'e_bjones',
    name: 'Bob Jones',
    position_id: 'p_coordinator',
    skills_acquired: {
      's_comm': 3,
      's_team_collaboration': 3,
      's_project_mgmt': 2,
      's_excel': 2,
      's_problem_solving': 2,
      's_cust_service': 2,
      's_presentation': 1
    }
  },
  {
    id: 'e_cwilson',
    name: 'Carol Wilson',
    position_id: 'p_analyst',
    skills_acquired: {
      's_data_analysis': 3,
      's_sql': 2,
      's_excel': 3,
      's_comm': 2,
      's_technical_writing': 3,
      's_problem_solving': 3,
      's_leadership': 2,
      's_strategic_thinking': 1
    }
  },
  {
    id: 'e_dlee',
    name: 'David Lee',
    position_id: 'p_project_mgr',
    skills_acquired: {
      's_project_mgmt': 3,
      's_leadership': 2,
      's_comm': 3,
      's_strategic_thinking': 2,
      's_presentation': 2,
      's_team_collaboration': 3,
      's_problem_solving': 2
    }
  },
  {
    id: 'e_ebrown',
    name: 'Emma Brown',
    position_id: 'p_coordinator',
    skills_acquired: {
      's_comm': 2,
      's_team_collaboration': 3,
      's_project_mgmt': 1,
      's_excel': 2,
      's_problem_solving': 2,
      's_cust_service': 3,
      's_presentation': 2,
      's_data_analysis': 1
    }
  }
];