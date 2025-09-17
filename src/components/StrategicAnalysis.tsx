import { useState, useMemo } from 'react';
import { ArrowLeft, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { people, positions, skills } from '@/data/sample-data';
import { calculateSkillsNeededForPosition, findReadyPositions } from '@/utils/skills-calculations';
import { SKILL_RANKS } from '@/types/skills-matrix';

export default function StrategicAnalysis() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(people[0].id);
  const [targetPositionId, setTargetPositionId] = useState<string>('');

  const selectedEmployee = people.find(p => p.id === selectedEmployeeId) || people[0];
  const currentPosition = positions.find(p => p.id === selectedEmployee.position_id);
  const targetPosition = positions.find(p => p.id === targetPositionId);

  // Calculate skills needed for target position
  const skillsNeeded = useMemo(() => {
    if (!targetPosition) return [];
    return calculateSkillsNeededForPosition(selectedEmployee, targetPosition, skills);
  }, [selectedEmployee, targetPosition]);

  // Calculate career readiness for all positions
  const careerReadiness = useMemo(() => {
    return findReadyPositions(selectedEmployee, positions, skills);
  }, [selectedEmployee]);

  const readyPositions = careerReadiness.filter(cr => cr.isReady);
  const potentialPositions = careerReadiness.filter(cr => !cr.isReady && cr.missingSkills.length <= 3);

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
            <h1 className="text-3xl font-bold text-foreground">Strategic Career Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Analyze career progression opportunities and readiness
            </p>
          </div>
        </div>
      </div>

      {/* Employee Selection */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Select Employee</CardTitle>
          <CardDescription>Choose an employee to analyze their career progression opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Employee</label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {people.map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name} - {positions.find(p => p.id === person.position_id)?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Target Position (Optional)</label>
              <Select value={targetPositionId} onValueChange={setTargetPositionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a target position" />
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
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Current Status: {selectedEmployee.name}
          </CardTitle>
          <CardDescription>
            Currently: {currentPosition?.name} | Skills: {Object.keys(selectedEmployee.skills_acquired).length}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Skills Needed for Target Position */}
      {targetPosition && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Skills Needed for {targetPosition.name}
            </CardTitle>
            <CardDescription>
              Skills that need improvement to qualify for this position
            </CardDescription>
          </CardHeader>
          <CardContent>
            {skillsNeeded.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Ready for This Position!</h3>
                <p className="text-muted-foreground">
                  {selectedEmployee.name} meets all skill requirements for {targetPosition.name}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedEmployee.name} needs to improve {skillsNeeded.length} skill(s) to qualify for this position:
                </p>
                <div className="grid gap-3">
                  {skillsNeeded.map((skillGap) => (
                    <div key={skillGap.skill.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">{skillGap.skill.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current: {skillGap.acquired > 0 ? `${skillGap.acquired} - ${SKILL_RANKS[skillGap.acquired as keyof typeof SKILL_RANKS]}` : 'None'} | 
                          Required: {skillGap.required} - {SKILL_RANKS[skillGap.required as keyof typeof SKILL_RANKS]}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        Gap: {Math.abs(skillGap.gap)} level(s)
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ready Positions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Positions Ready to Assume Today
          </CardTitle>
          <CardDescription>
            Positions where {selectedEmployee.name} meets all skill requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {readyPositions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No positions are fully ready. Focus on developing key skills first.
            </p>
          ) : (
            <div className="grid gap-3">
              {readyPositions.map((readiness) => (
                <div key={readiness.position.id} className="flex items-center justify-between p-3 border border-success/20 bg-success/5 rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">{readiness.position.name}</h4>
                    <p className="text-sm text-success">
                      All skill requirements met
                    </p>
                  </div>
                  <Badge className="bg-success text-success-foreground">
                    Ready
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Potential Future Positions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-info" />
            Potential Future Positions
          </CardTitle>
          <CardDescription>
            Positions within reach with moderate skill development (3 or fewer skill gaps)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {potentialPositions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No positions are within immediate reach. Consider long-term skill development.
            </p>
          ) : (
            <div className="grid gap-3">
              {potentialPositions.map((readiness) => (
                <div key={readiness.position.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">{readiness.position.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {readiness.missingSkills.length} skill gap(s): {' '}
                      {readiness.missingSkills.slice(0, 2).map(skill => skill.skill.name).join(', ')}
                      {readiness.missingSkills.length > 2 && '...'}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-info border-info">
                    {readiness.missingSkills.length} gap(s)
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}