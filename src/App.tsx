import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import SkillGapAnalysis from "./components/SkillGapAnalysis";
import StrategicAnalysis from "./components/StrategicAnalysis";
import { DataManagement } from "./components/DataManagement";
import NotFound from "./pages/NotFound";
import { people as initialPeople, positions as initialPositions, skills as initialSkills } from './data/sample-data';
import { Person, Position, Skill } from './types/skills-matrix';

const queryClient = new QueryClient();

const App = () => {
  // State management for all data
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard 
                    people={people} 
                    positions={positions} 
                    skills={skills}
                    onUpdatePeople={setPeople}
                    onUpdatePositions={setPositions}
                    onUpdateSkills={setSkills}
                  />
                } 
              />
              <Route 
                path="/skill-analysis" 
                element={
                  <SkillGapAnalysis 
                    people={people} 
                    positions={positions} 
                    skills={skills}
                    onUpdatePeople={setPeople}
                  />
                } 
              />
              <Route 
                path="/career-insights" 
                element={
                  <StrategicAnalysis 
                    people={people} 
                    positions={positions} 
                    skills={skills} 
                  />
                } 
              />
              <Route 
                path="/data-management" 
                element={
                  <DataManagement 
                    people={people} 
                    positions={positions} 
                    skills={skills}
                    onUpdatePeople={setPeople}
                    onUpdatePositions={setPositions}
                    onUpdateSkills={setSkills}
                  />
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
