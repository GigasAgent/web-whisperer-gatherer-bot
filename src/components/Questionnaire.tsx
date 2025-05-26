
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { questions } from '@/data/questions';

import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import { QuestionDisplay } from './QuestionDisplay';
// import { N8nWebhookInput } from './N8nWebhookInput'; // Commented out
import { QuestionNavigation } from './QuestionNavigation';
import { submitToSupabase } from '@/services/submissionService'; // Removed: callN8nWebhook

export const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [n8nWebhookUrl, setN8nWebhookUrl] = useState(''); // Commented out

  const {
    currentQuestionIndex,
    currentAnswer,
    currentQuestion,
    isLastQuestion,
    progressPercentage,
    handleInputChange,
    handleNext,
    handlePrev,
    getFinalAnswers,
  } = useQuestionnaire();

  // useEffect(() => { // Commented out n8n webhook URL loading
  //   const storedWebhookUrl = localStorage.getItem('n8nWebhookUrl');
  //   if (storedWebhookUrl) {
  //     setN8nWebhookUrl(storedWebhookUrl);
  //   }
  // }, []);

  // const handleN8nWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Commented out
  //   setN8nWebhookUrl(e.target.value);
  //   localStorage.setItem('n8nWebhookUrl', e.target.value);
  // };
  
  // const isValidHttpUrl = (string: string) => { // Commented out
  //   let url;
  //   try {
  //     url = new URL(string);
  //   } catch (_) {
  //     return false;
  //   }
  //   return url.protocol === "http:" || url.protocol === "https:" || url.protocol.startsWith("https+");
  // };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to submit.", variant: "destructive" });
      return;
    }

    // if (n8nWebhookUrl.trim() && !isValidHttpUrl(n8nWebhookUrl)) { // Commented out n8n validation
    //   toast({ title: "Invalid Webhook URL", description: "Please enter a valid HTTP/HTTPS URL for n8n webhook.", variant: "destructive" });
    //   return;
    // }

    setIsSubmitting(true);
    const finalAnswers = getFinalAnswers();
    
    // let submissionSuccessful = false; // Simplified logic
    // let newProjectId: string | number | null | undefined = null; // Simplified logic

    const supabaseResult = await submitToSupabase(user.id, finalAnswers);

    if (supabaseResult.error || !supabaseResult.data?.id) {
      toast({ title: "Submission Error (Supabase)", description: `Failed to submit: ${supabaseResult.error?.message || 'Unknown error'}`, variant: "destructive" });
    } else {
      // newProjectId = supabaseResult.newProjectId; // Simplified logic
      toast({ title: "Success!", description: "Project requirements submitted successfully to database." });
      // submissionSuccessful = true; // Simplified logic
      navigate('/project-output', { state: { projectData: finalAnswers, projectId: supabaseResult.newProjectId } }); // Navigate directly
    }

    // Code related to n8n webhook call and subsequent navigation has been removed / simplified.
    // The navigation now happens directly after successful Supabase submission.

    setIsSubmitting(false);
  };


  if (authLoading) {
    return (
      <Card className="w-full max-w-2xl bg-card shadow-xl shadow-neon-green/30 border border-neon-green/50 flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
      </Card>
    );
  }

  // const disableSubmitButton = !user || (n8nWebhookUrl.trim() && !isValidHttpUrl(n8nWebhookUrl)); // Simplified disable logic
  const disableSubmitButton = !user; 

  return (
    <Card className="w-full max-w-2xl bg-card shadow-xl shadow-neon-green/30 border border-neon-green/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold glowing-text text-center">
          Project Requirements
        </CardTitle>
        <Progress value={progressPercentage} className="w-full mt-2 [&>div]:bg-neon-green" />
        <p className="text-sm text-muted-foreground text-center pt-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {currentQuestion && (
          <QuestionDisplay
            question={currentQuestion}
            currentAnswer={currentAnswer}
            onInputChange={handleInputChange}
            isSubmitting={isSubmitting}
          />
        )}
        {/* {isLastQuestion && currentQuestion && ( // Commented out N8nWebhookInput rendering
          <N8nWebhookInput
            n8nWebhookUrl={n8nWebhookUrl}
            onN8nWebhookUrlChange={handleN8nWebhookUrlChange}
            isSubmitting={isSubmitting}
            isValidHttpUrl={isValidHttpUrl}
          />
        )} */}
      </CardContent>
      <CardFooter className="flex justify-between p-6">
        <QuestionNavigation
            onPrev={handlePrev}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isLastQuestion={isLastQuestion}
            currentQuestionIndex={currentQuestionIndex}
            disableSubmit={disableSubmitButton}
        />
      </CardFooter>
    </Card>
  );
};

