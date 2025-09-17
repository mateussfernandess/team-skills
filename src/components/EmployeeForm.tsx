import { useState } from 'react';
import { Save, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Person, Position, Skill, SKILL_RANKS } from '@/types/skills-matrix';
import { useToast } from '@/components/ui/use-toast';

interface EmployeeFormProps {
  employee?: Person;
  positions: Position[];
  skills: Skill[];
  onSave: (employee: Person) => void;
  onCancel: () => void;
}

export function EmployeeForm({ employee, positions, skills, onSave, onCancel }: EmployeeFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: employee?.id || '',
    name: employee?.name || '',
    position_id: employee?.position_id || '',
    skills_acquired: employee?.skills_acquired || {}
  });

  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedRank, setSelectedRank] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Employee name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.position_id) {
      toast({
        title: "Error",
        description: "Position is required",
        variant: "destructive",
      });
      return;
    }

    const newEmployee: Person = {
      id: formData.id || `e_${formData.name.toLowerCase().replace(/\s+/g, '')}`,
      name: formData.name,
      position_id: formData.position_id,
      skills_acquired: formData.skills_acquired
    };

    onSave(newEmployee);
    toast({
      title: "Success",
      description: employee ? "Employee updated successfully" : "Employee created successfully",
    });
  };

  const addSkill = () => {
    if (!selectedSkill || !selectedRank) return;
    
    setFormData(prev => ({
      ...prev,
      skills_acquired: {
        ...prev.skills_acquired,
        [selectedSkill]: parseInt(selectedRank)
      }
    }));
    
    setSelectedSkill('');
    setSelectedRank('');
  };

  const removeSkill = (skillId: string) => {
    setFormData(prev => {
      const newSkillsAcquired = { ...prev.skills_acquired };
      delete newSkillsAcquired[skillId];
      return {
        ...prev,
        skills_acquired: newSkillsAcquired
      };
    });
  };

  const getSkillName = (skillId: string) => {
    return skills.find(s => s.id === skillId)?.name || skillId;
  };

  const getPositionName = (positionId: string) => {
    return positions.find(p => p.id === positionId)?.name || positionId;
  };

  const availableSkills = skills.filter(skill => 
    !Object.keys(formData.skills_acquired).includes(skill.id)
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{employee ? 'Edit Employee' : 'Create New Employee'}</CardTitle>
        <CardDescription>
          {employee ? 'Update employee details and skills' : 'Add a new employee and their current skill levels'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Employee Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter employee name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Current Position</Label>
            <Select 
              value={formData.position_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, position_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map(position => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Current Skills</Label>
            
            {/* Add new skill */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills.map(skill => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-32">
                <Select value={selectedRank} onValueChange={setSelectedRank}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SKILL_RANKS).map(([rank, label]) => (
                      <SelectItem key={rank} value={rank}>
                        {rank} - {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                type="button"
                onClick={addSkill}
                disabled={!selectedSkill || !selectedRank}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Current skills */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(formData.skills_acquired).map(([skillId, rank]) => (
                <Badge key={skillId} variant="outline" className="flex items-center gap-1">
                  {getSkillName(skillId)} - Level {rank}
                  <button
                    type="button"
                    onClick={() => removeSkill(skillId)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {employee ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}