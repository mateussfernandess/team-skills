import { useState } from 'react';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skill } from '@/types/skills-matrix';
import { useToast } from '@/components/ui/use-toast';

interface AISkillSuggestionsProps {
  existingSkills: Skill[];
  onAddSuggestion: (skillName: string) => void;
}

interface SkillSuggestion {
  name: string;
  relevance: string;
  marketDemand: 'high' | 'medium' | 'low';
}

export function AISkillSuggestions({ existingSkills, onAddSuggestion }: AISkillSuggestionsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([]);
  const [context, setContext] = useState('');

  // Mock AI suggestion generation (in a real app, this would call an AI service)
  const generateSuggestions = async () => {
    setIsLoading(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock market-based skill suggestions based on current trends
      const marketSkills: SkillSuggestion[] = [
        { name: 'Artificial Intelligence', relevance: 'Essential for data-driven roles and automation', marketDemand: 'high' },
        { name: 'Machine Learning', relevance: 'Critical for advanced analytics and prediction models', marketDemand: 'high' },
        { name: 'Cloud Computing', relevance: 'Required for modern infrastructure and scalability', marketDemand: 'high' },
        { name: 'Cybersecurity', relevance: 'Growing demand due to increased digital threats', marketDemand: 'high' },
        { name: 'Data Science', relevance: 'High value skill for business intelligence and insights', marketDemand: 'high' },
        { name: 'Digital Marketing', relevance: 'Essential for online presence and customer acquisition', marketDemand: 'medium' },
        { name: 'UX/UI Design', relevance: 'Critical for user-centered product development', marketDemand: 'medium' },
        { name: 'Agile Methodology', relevance: 'Standard approach for project management in tech', marketDemand: 'medium' },
        { name: 'Blockchain Technology', relevance: 'Emerging technology with growing applications', marketDemand: 'medium' },
        { name: 'DevOps', relevance: 'Essential for continuous integration and deployment', marketDemand: 'high' },
        { name: 'Mobile Development', relevance: 'High demand for mobile-first solutions', marketDemand: 'medium' },
        { name: 'Business Intelligence', relevance: 'Critical for data-driven decision making', marketDemand: 'medium' }
      ];

      // Filter out skills that already exist
      const existingSkillNames = new Set(existingSkills.map(skill => 
        skill.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      ));
      
      const newSuggestions = marketSkills.filter(suggestion => {
        const normalizedName = suggestion.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return !existingSkillNames.has(normalizedName);
      });

      // If context is provided, prioritize relevant suggestions
      let contextualSuggestions = newSuggestions;
      if (context.trim()) {
        const contextLower = context.toLowerCase();
        contextualSuggestions = newSuggestions.filter(suggestion =>
          suggestion.name.toLowerCase().includes(contextLower) ||
          suggestion.relevance.toLowerCase().includes(contextLower) ||
          contextLower.includes('tech') ||
          contextLower.includes('data') ||
          contextLower.includes('digital')
        );
        
        // If no contextual matches, return all new suggestions
        if (contextualSuggestions.length === 0) {
          contextualSuggestions = newSuggestions;
        }
      }

      // Sort by market demand and take top 6
      contextualSuggestions.sort((a, b) => {
        const demandOrder = { high: 3, medium: 2, low: 1 };
        return demandOrder[b.marketDemand] - demandOrder[a.marketDemand];
      });

      setSuggestions(contextualSuggestions.slice(0, 6));
      
      toast({
        title: "Suggestions Generated",
        description: `Found ${contextualSuggestions.slice(0, 6).length} relevant skills based on current market trends`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate skill suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Skill Suggestions
        </CardTitle>
        <CardDescription>
          Get AI-powered skill suggestions based on current market trends and industry demands
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="context">Industry Context (Optional)</Label>
          <Textarea
            id="context"
            placeholder="e.g., technology, healthcare, finance, marketing..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={2}
          />
        </div>

        <Button 
          onClick={generateSuggestions} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Market Trends...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate Suggestions
            </>
          )}
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium text-sm text-foreground">Recommended Skills</h4>
            <div className="grid gap-3">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="flex items-start justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-sm text-foreground">
                        {suggestion.name}
                      </h5>
                      <Badge 
                        variant={getDemandColor(suggestion.marketDemand)}
                        className="text-xs"
                      >
                        {suggestion.marketDemand} demand
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {suggestion.relevance}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSuggestion(suggestion.name)}
                    className="ml-2"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Click "Generate Suggestions" to discover trending skills</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}