
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProjectOutputPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectData } = location.state || {}; // Expecting projectData in navigation state

  if (!projectData) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-neon-green/50 selection:text-white">
        <Card className="w-full max-w-2xl bg-card shadow-xl shadow-neon-green/30 border border-neon-green/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold glowing-text text-center">
              Project Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              No project data found. Please submit the questionnaire first.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-neon-green text-neon-green hover:bg-neon-green/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Questionnaire
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center p-4 sm:p-8 selection:bg-neon-green/50 selection:text-white">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12 text-center">
        <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-neon-green text-neon-green hover:bg-neon-green/10 absolute left-8 top-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Questionnaire
          </Button>
        <div className="flex-grow text-center">
          <h1 className="text-4xl font-extrabold tracking-tight glowing-text">
            Project Submission Details
          </h1>
        </div>
      </header>
      <Card className="w-full max-w-3xl bg-card shadow-xl shadow-neon-green/30 border border-neon-green/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold glowing-text">
            Submitted Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-input p-4 rounded-md border border-neon-green/50 text-sm overflow-auto whitespace-pre-wrap break-words">
            {JSON.stringify(projectData, null, 2)}
          </pre>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Button
              onClick={() => navigate('/')} // Or maybe a different route for "new project"
              className="bg-neon-green text-primary-foreground hover:bg-neon-green-darker"
            >
              Start New Project
            </Button>
          </CardFooter>
      </Card>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Project Requirements Collector. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProjectOutputPage;
