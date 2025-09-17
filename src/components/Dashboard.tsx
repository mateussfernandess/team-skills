import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Award, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { people, positions, skills } from '@/data/sample-data';
import { calculateSkillGaps } from '@/utils/skills-calculations';
import { SKILL_RANKS } from '@/types/skills-matrix';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  // Get position lookup map
  const positionsMap = useMemo(() => {
    return new Map(positions.map(pos => [pos.id, pos]));
  }, []);

  // Filter people based on search
  const filteredPeople = useMemo(() => {
    return people.filter(person => 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      positionsMap.get(person.position_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, positionsMap]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalEmployees = people.length;
    const totalPositions = new Set(people.map(p => p.position_id)).size;
    const totalSkills = skills.length;
    
    // Calculate average skill readiness
    let totalGaps = 0;
    let totalRequiredSkills = 0;
    
    people.forEach(person => {
      const position = positionsMap.get(person.position_id);
      if (position) {
        const gaps = calculateSkillGaps(person, position, skills);
        const requiredSkills = gaps.filter(gap => gap.required > 0);
        const metSkills = requiredSkills.filter(gap => gap.gap >= 0);
        
        totalGaps += metSkills.length;
        totalRequiredSkills += requiredSkills.length;
      }
    });
    
    const readinessPercentage = totalRequiredSkills > 0 ? Math.round((totalGaps / totalRequiredSkills) * 100) : 0;
    
    return { totalEmployees, totalPositions, totalSkills, readinessPercentage };
  }, [positionsMap]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Skills Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of employee skills and career readiness across your organization.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalEmployees}</div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.totalPositions}</div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Tracked</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.totalSkills}</div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Readiness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.readinessPercentage}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            Search and filter employees to view their skill profiles and gaps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees or positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Employee Table */}
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead className="table-header-gradient">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                    Skills Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredPeople.map((person) => {
                  const position = positionsMap.get(person.position_id);
                  const skillCount = Object.keys(person.skills_acquired).length;
                  const gaps = position ? calculateSkillGaps(person, position, skills) : [];
                  const deficits = gaps.filter(gap => gap.status === 'deficit').length;
                  
                  return (
                    <tr 
                      key={person.id} 
                      className="hover:bg-table-row-hover transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          {person.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">
                          {position?.name || 'Unknown Position'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {skillCount} skills
                          </Badge>
                          {deficits > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {deficits} gaps
                            </Badge>
                          )}
                          {deficits === 0 && gaps.length > 0 && (
                            <Badge className="text-xs bg-success text-success-foreground">
                              Ready
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/skill-analysis?employee=${person.id}`}
                          className="text-primary hover:text-primary-dark transition-colors duration-150"
                        >
                          View Analysis
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}