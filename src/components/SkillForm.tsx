import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skill } from '@/types/skills-matrix';
import { useToast } from '@/components/ui/use-toast';

interface SkillFormProps {
  skill?: Skill;
  onSave: (skill: Skill) => void;
  onCancel: () => void;
}

export function SkillForm({ skill, onSave, onCancel }: SkillFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: skill?.id || '',
    name: skill?.name || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name is required",
        variant: "destructive",
      });
      return;
    }

    const newSkill: Skill = {
      id: formData.id || `s_${formData.name.toLowerCase().replace(/\s+/g, '_')}`,
      name: formData.name
    };

    onSave(newSkill);
    toast({
      title: "Success",
      description: skill ? "Skill updated successfully" : "Skill created successfully",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{skill ? 'Edit Skill' : 'Create New Skill'}</CardTitle>
        <CardDescription>
          {skill ? 'Update skill information' : 'Add a new skill to the system'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter skill name"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {skill ? 'Update Skill' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}