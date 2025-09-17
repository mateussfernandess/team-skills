import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { people, positions, skills } from '@/data/sample-data';
import { calculateSkillGaps, getSkillGapColorClass } from '@/utils/skills-calculations';
import { SKILL_RANKS } from '@/types/skills-matrix';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function SkillGapAnalysis() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Get employee from URL params
  const employeeId = searchParams.get('employee');
  const selectedEmployee = people.find(p => p.id === employeeId) || people[0];
  
  // Get position and skills data
  const position = positions.find(p => p.id === selectedEmployee.position_id);
  const skillGaps = useMemo(() => {
    return position ? calculateSkillGaps(selectedEmployee, position, skills) : [];
  }, [selectedEmployee, position]);

  // Handle editing
  const handleEditStart = (skillId: string, currentValue: number) => {
    setEditingSkill(skillId);
    setEditValue(currentValue.toString());
  };

  const handleEditSave = (skillId: string) => {
    const newValue = parseInt(editValue);
    if (newValue >= 0 && newValue <= 3) {
      // In a real app, this would update the database
      toast({
        title: "Skill Updated",
        description: `Skill level updated successfully.`,
      });
      setEditingSkill(null);
    }
  };

  const handleEditCancel = () => {
    setEditingSkill(null);
    setEditValue('');
  };

  if (!position) {
    return <div>Position not found</div>;
  }

  const deficitSkills = skillGaps.filter(gap => gap.status === 'deficit');
  const readySkills = skillGaps.filter(gap => gap.status === 'met' || gap.status === 'excess');
  const extraSkills = skillGaps.filter(gap => gap.status === 'not-required');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{selectedEmployee.name}</h1>
            <p className="text-muted-foreground mt-1">
              Skill Gap Analysis for {position.name}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Skill Gaps</CardTitle>
            <CardDescription>Skills needing improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-danger">{deficitSkills.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Skills below required level
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ready Skills</CardTitle>
            <CardDescription>Skills meeting requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{readySkills.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Skills at or above required level
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Additional Skills</CardTitle>
            <CardDescription>Skills beyond current role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-info">{extraSkills.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Skills not required for position
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Matrix */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Skills Matrix</CardTitle>
          <CardDescription>
            Detailed breakdown of skill levels vs requirements. Click edit to update skill levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead className="table-header-gradient">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                    Skill
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                    Required Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                    Current Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                    Gap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {skillGaps.map((gap) => (
                  <tr 
                    key={gap.skill.id}
                    className={cn(
                      "hover:bg-table-row-hover transition-colors duration-150",
                      getSkillGapColorClass(gap.status)
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        {gap.skill.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">
                        {gap.required > 0 ? `${gap.required} - ${SKILL_RANKS[gap.required as keyof typeof SKILL_RANKS]}` : 'Not Required'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingSkill === gap.skill.id ? (
                        <div className="flex items-center space-x-2">
                          <Select value={editValue} onValueChange={setEditValue}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0 - None</SelectItem>
                              <SelectItem value="1">1 - Beginner</SelectItem>
                              <SelectItem value="2">2 - Intermediate</SelectItem>
                              <SelectItem value="3">3 - Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="text-sm text-foreground">
                          {gap.acquired > 0 ? `${gap.acquired} - ${SKILL_RANKS[gap.acquired as keyof typeof SKILL_RANKS]}` : '0 - None'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={cn(
                        "text-sm font-medium",
                        gap.gap < 0 ? "text-danger" : gap.gap > 0 ? "text-success" : "text-foreground"
                      )}>
                        {gap.gap > 0 ? `+${gap.gap}` : gap.gap}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={gap.status === 'deficit' ? 'destructive' : 
                                gap.status === 'not-required' ? 'secondary' : 'default'}
                        className={gap.status === 'met' || gap.status === 'excess' ? 
                                  'bg-success text-success-foreground' : ''}
                      >
                        {gap.status === 'deficit' ? 'Needs Improvement' :
                         gap.status === 'met' ? 'Meets Requirement' :
                         gap.status === 'excess' ? 'Exceeds Requirement' :
                         'Not Required'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingSkill === gap.skill.id ? (
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleEditSave(gap.skill.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleEditCancel}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditStart(gap.skill.id, gap.acquired)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}