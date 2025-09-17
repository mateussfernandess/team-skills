import { useState } from 'react';
import { Plus, Edit2, Trash2, Building, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Person, Position, Skill } from '@/types/skills-matrix';
import { PositionForm } from './PositionForm';
import { EmployeeForm } from './EmployeeForm';
import { SkillForm } from './SkillForm';
import { AISkillSuggestions } from './AISkillSuggestions';
import { useToast } from '@/components/ui/use-toast';

interface DataManagementProps {
  people: Person[];
  positions: Position[];
  skills: Skill[];
  onUpdatePeople: (people: Person[]) => void;
  onUpdatePositions: (positions: Position[]) => void;
  onUpdateSkills: (skills: Skill[]) => void;
}

export function DataManagement({ 
  people, 
  positions, 
  skills, 
  onUpdatePeople, 
  onUpdatePositions, 
  onUpdateSkills 
}: DataManagementProps) {
  const { toast } = useToast();
  const [openDialogs, setOpenDialogs] = useState({
    position: false,
    employee: false,
    skill: false,
    aiSuggestions: false
  });
  const [editingItem, setEditingItem] = useState<{
    type: 'position' | 'employee' | 'skill';
    item: Position | Person | Skill | null;
  }>({ type: 'position', item: null });

  const openDialog = (type: keyof typeof openDialogs) => {
    setOpenDialogs(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof typeof openDialogs) => {
    setOpenDialogs(prev => ({ ...prev, [type]: false }));
    setEditingItem({ type: 'position', item: null });
  };

  const handleSavePosition = (position: Position) => {
    const existingIndex = positions.findIndex(p => p.id === position.id);
    if (existingIndex >= 0) {
      const updated = [...positions];
      updated[existingIndex] = position;
      onUpdatePositions(updated);
    } else {
      onUpdatePositions([...positions, position]);
    }
    closeDialog('position');
  };

  const handleSaveEmployee = (employee: Person) => {
    const existingIndex = people.findIndex(p => p.id === employee.id);
    if (existingIndex >= 0) {
      const updated = [...people];
      updated[existingIndex] = employee;
      onUpdatePeople(updated);
    } else {
      onUpdatePeople([...people, employee]);
    }
    closeDialog('employee');
  };

  const handleSaveSkill = (skill: Skill) => {
    const existingIndex = skills.findIndex(s => s.id === skill.id);
    if (existingIndex >= 0) {
      const updated = [...skills];
      updated[existingIndex] = skill;
      onUpdateSkills(updated);
    } else {
      onUpdateSkills([...skills, skill]);
    }
    closeDialog('skill');
  };

  const handleDeletePosition = (positionId: string) => {
    // Check if any employees are assigned to this position
    const assignedEmployees = people.filter(p => p.position_id === positionId);
    if (assignedEmployees.length > 0) {
      toast({
        title: "Cannot Delete Position",
        description: `${assignedEmployees.length} employee(s) are assigned to this position. Please reassign them first.`,
        variant: "destructive",
      });
      return;
    }
    
    onUpdatePositions(positions.filter(p => p.id !== positionId));
    toast({
      title: "Position Deleted",
      description: "Position has been successfully deleted.",
    });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    onUpdatePeople(people.filter(p => p.id !== employeeId));
    toast({
      title: "Employee Deleted",
      description: "Employee has been successfully deleted.",
    });
  };

  const handleDeleteSkill = (skillId: string) => {
    // Check if skill is used in any position requirements or employee skills
    const usedInPositions = positions.some(p => p.skills_needed[skillId]);
    const usedByEmployees = people.some(p => p.skills_acquired[skillId]);
    
    if (usedInPositions || usedByEmployees) {
      toast({
        title: "Cannot Delete Skill",
        description: "This skill is currently used in position requirements or employee profiles. Please remove it from those first.",
        variant: "destructive",
      });
      return;
    }
    
    onUpdateSkills(skills.filter(s => s.id !== skillId));
    toast({
      title: "Skill Deleted",
      description: "Skill has been successfully deleted.",
    });
  };

  const handleEditItem = (type: 'position' | 'employee' | 'skill', item: Position | Person | Skill) => {
    setEditingItem({ type, item });
    openDialog(type);
  };

  const handleAddSuggestion = (skillName: string) => {
    const newSkill: Skill = {
      id: `s_${skillName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`,
      name: skillName
    };
    
    // Check if skill already exists
    if (skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      toast({
        title: "Skill Already Exists",
        description: "This skill is already in your system.",
        variant: "destructive",
      });
      return;
    }
    
    onUpdateSkills([...skills, newSkill]);
    toast({
      title: "Skill Added",
      description: `"${skillName}" has been added to your skills database.`,
    });
  };

  const getPositionName = (positionId: string) => {
    return positions.find(p => p.id === positionId)?.name || 'Unknown Position';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage positions, employees, and skills in your organization.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={openDialogs.position} onOpenChange={(open) => open ? openDialog('position') : closeDialog('position')}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <PositionForm
              position={editingItem.type === 'position' ? editingItem.item as Position : undefined}
              skills={skills}
              onSave={handleSavePosition}
              onCancel={() => closeDialog('position')}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={openDialogs.employee} onOpenChange={(open) => open ? openDialog('employee') : closeDialog('employee')}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <EmployeeForm
              employee={editingItem.type === 'employee' ? editingItem.item as Person : undefined}
              positions={positions}
              skills={skills}
              onSave={handleSaveEmployee}
              onCancel={() => closeDialog('employee')}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={openDialogs.skill} onOpenChange={(open) => open ? openDialog('skill') : closeDialog('skill')}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <SkillForm
              skill={editingItem.type === 'skill' ? editingItem.item as Skill : undefined}
              onSave={handleSaveSkill}
              onCancel={() => closeDialog('skill')}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={openDialogs.aiSuggestions} onOpenChange={(open) => open ? openDialog('aiSuggestions') : closeDialog('aiSuggestions')}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Award className="h-4 w-4 mr-2" />
              AI Suggestions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <AISkillSuggestions
              existingSkills={skills}
              onAddSuggestion={handleAddSuggestion}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Positions */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Positions ({positions.length})
            </CardTitle>
            <CardDescription>
              Manage organizational positions and their skill requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {positions.map((position) => (
                <div key={position.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{position.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.keys(position.skills_needed).length > 0 ? (
                        <Badge variant="outline" className="text-xs">
                          {Object.keys(position.skills_needed).length} skills required
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          No skills defined
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditItem('position', position)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Position</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{position.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePosition(position.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
              {positions.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No positions defined yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Employees */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Employees ({people.length})
            </CardTitle>
            <CardDescription>
              Manage employee profiles and their acquired skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {people.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{person.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getPositionName(person.position_id)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {Object.keys(person.skills_acquired).length} skills
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditItem('employee', person)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{person.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteEmployee(person.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
              {people.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No employees added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Skills Database ({skills.length})
          </CardTitle>
          <CardDescription>
            Manage the skills catalog used throughout your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-2 rounded border border-border bg-card/50">
                <span className="text-sm text-foreground">{skill.name}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditItem('skill', skill)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{skill.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteSkill(skill.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
          {skills.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No skills in the database yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}