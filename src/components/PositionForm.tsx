import { useState, useEffect } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Position, Skill, SKILL_RANKS } from '@/types/skills-matrix';
import { useToast } from '@/components/ui/use-toast';

interface PositionFormProps {
  position?: Position;
  skills: Skill[];
  onSave: (position: Position) => void;
  onCancel: () => void;
}

export function PositionForm({ position, skills, onSave, onCancel }: PositionFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: position?.id || '',
    name: position?.name || '',
    skills_needed: position?.skills_needed || {}
  });

  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedRank, setSelectedRank] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Position name is required",
        variant: "destructive",
      });
      return;
    }

    const newPosition: Position = {
      id: formData.id || `p_${formData.name.toLowerCase().replace(/\s+/g, '_')}`,
      name: formData.name,
      skills_needed: formData.skills_needed
    };

    onSave(newPosition);
    toast({
      title: "Success",
      description: position ? "Position updated successfully" : "Position created successfully",
    });
  };

  const addSkillRequirement = () => {
    if (!selectedSkill || !selectedRank) return;
    
    setFormData(prev => ({
      ...prev,
      skills_needed: {
        ...prev.skills_needed,
        [selectedSkill]: parseInt(selectedRank)
      }
    }));
    
    setSelectedSkill('');
    setSelectedRank('');
  };

  const removeSkillRequirement = (skillId: string) => {
    setFormData(prev => {
      const newSkillsNeeded = { ...prev.skills_needed };
      delete newSkillsNeeded[skillId];
      return {
        ...prev,
        skills_needed: newSkillsNeeded
      };
    });
  };

  const getSkillName = (skillId: string) => {
    return skills.find(s => s.id === skillId)?.name || skillId;
  };

  const availableSkills = skills.filter(skill => 
    !Object.keys(formData.skills_needed).includes(skill.id)
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{position ? 'Edit Position' : 'Create New Position'}</CardTitle>
        <CardDescription>
          {position ? 'Update position details and skill requirements' : 'Define a new position and its required skills'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Position Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter position name"
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Required Skills</Label>
            
            {/* Add new skill requirement */}
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
                    <SelectValue placeholder="Rank" />
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
                onClick={addSkillRequirement}
                disabled={!selectedSkill || !selectedRank}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Current skill requirements */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(formData.skills_needed).map(([skillId, rank]) => (
                <Badge key={skillId} variant="outline" className="flex items-center gap-1">
                  {getSkillName(skillId)} - Level {rank}
                  <button
                    type="button"
                    onClick={() => removeSkillRequirement(skillId)}
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
              {position ? 'Update Position' : 'Create Position'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}