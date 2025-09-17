import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Person, Position, Skill } from '@/types/skills-matrix';
import { findReadyPositions } from '@/utils/skills-calculations';

interface SupplyAnalysisProps {
  people: Person[];
  positions: Position[];
  skills: Skill[];
}

export function SupplyAnalysis({ people, positions, skills }: SupplyAnalysisProps) {
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set());

  const supplyData = useMemo(() => {
    return positions.map(position => {
      // Find people who are ready for this position (meet all requirements)
      const readyPeople = people.filter(person => {
        const readiness = findReadyPositions(person, [position], skills);
        return readiness.length > 0 && readiness[0].isReady;
      });

      // Find people currently in this position
      const currentEmployees = people.filter(person => person.position_id === position.id);

      return {
        position,
        readyCount: readyPeople.length,
        currentCount: currentEmployees.length,
        readyPeople,
        currentEmployees,
        totalSupply: readyPeople.length + currentEmployees.length
      };
    });
  }, [people, positions, skills]);

  const toggleExpanded = (positionId: string) => {
    const newExpanded = new Set(expandedPositions);
    if (newExpanded.has(positionId)) {
      newExpanded.delete(positionId);
    } else {
      newExpanded.add(positionId);
    }
    setExpandedPositions(newExpanded);
  };

  const getSupplyStatus = (ready: number, current: number) => {
    const total = ready + current;
    if (total === 0) return 'critical';
    if (total <= 2) return 'low';
    if (total <= 5) return 'medium';
    return 'high';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'default';
      default: return 'default';
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Human Supply Analysis
        </CardTitle>
        <CardDescription>
          View available talent for each position, including current employees and qualified candidates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full">
            <thead className="table-header-gradient">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                  Current Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                  Ready Candidates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider">
                  Total Supply
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
              {supplyData.map((data) => {
                const isExpanded = expandedPositions.has(data.position.id);
                const status = getSupplyStatus(data.readyCount, data.currentCount);
                
                return (
                  <React.Fragment key={data.position.id}>
                    <tr className="hover:bg-table-row-hover transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          {data.position.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          {data.currentCount} current
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          {data.readyCount} ready
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          {data.totalSupply}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={getStatusColor(status)}
                          className="text-xs capitalize"
                        >
                          {status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(data.position.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          Details
                        </Button>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-muted/50">
                          <div className="space-y-4">
                            {data.currentCount > 0 && (
                              <div>
                                <h4 className="font-medium text-sm text-foreground mb-2">
                                  Current Employees ({data.currentCount})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {data.currentEmployees.map(employee => (
                                    <Badge key={employee.id} variant="default" className="text-xs">
                                      {employee.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {data.readyCount > 0 && (
                              <div>
                                <h4 className="font-medium text-sm text-foreground mb-2">
                                  Ready Candidates ({data.readyCount})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {data.readyPeople.map(person => (
                                    <Badge key={person.id} variant="outline" className="text-xs">
                                      {person.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {data.totalSupply === 0 && (
                              <div className="text-sm text-muted-foreground">
                                No current employees or ready candidates for this position.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}