import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, Question } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Zap, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Answers {
  [key: string]: string | string[];
}

export const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const { user, profile, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');

  useEffect(() => {
    const storedWebhookUrl = localStorage.getItem('n8nWebhookUrl');
    if (storedWebhookUrl) {
      setN8nWebhookUrl(storedWebhookUrl);
    }
  }, []);

  const handleN8nWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setN8nWebhookUrl(e.target.value);
    localStorage.setItem('n8nWebhookUrl', e.target.value);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentAnswer(e.target.value);
  };

  const processAnswer = (answer: string, question: Question): string | string[] => {
    if (question.isArray) {
      return answer.split(',').map(item => item.trim()).filter(item => item !== '');
    }
    return answer.trim();
  };

  const handleNext = () => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.key]: processAnswer(currentAnswer, currentQuestion)
    }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      const nextQuestionKey = questions[currentQuestionIndex + 1].key;
      const nextAnswer = answers[nextQuestionKey] || (answers[nextQuestionKey] === '' ? '' : undefined);
      setCurrentAnswer(Array.isArray(nextAnswer) ? nextAnswer.join(', ') : nextAnswer?.toString() || '');
    } else {
      // If it's the last question, and next is clicked, it implies submit.
      // However, the explicit submit button should be used. 
      // Consider if this else block is needed or if handleSubmit() should be called here.
      // For now, let's assume the user will click the "Submit" button.
      // If we want "Next" on the last question to also submit, we'd call handleSubmit here.
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      // Save current answer before going back, only if it's not empty, to avoid overwriting with empty
      if (currentAnswer.trim() !== '' || (Array.isArray(answers[currentQuestion.key]) && (answers[currentQuestion.key] as string[]).length > 0)) {
         setAnswers(prev => ({
          ...prev,
          [currentQuestion.key]: processAnswer(currentAnswer, currentQuestion)
        }));
      }
      setCurrentQuestionIndex(prev => prev - 1);
      const prevQuestionKey = questions[currentQuestionIndex - 1].key;
      const prevAnswer = answers[prevQuestionKey];
      setCurrentAnswer(Array.isArray(prevAnswer) ? prevAnswer.join(', ') : prevAnswer?.toString() || '');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to submit.", variant: "destructive" });
      return;
    }

    if (n8nWebhookUrl.trim() && !isValidHttpUrl(n8nWebhookUrl)) {
      toast({ title: "Invalid Webhook URL", description: "Please enter a valid HTTP/HTTPS URL for n8n webhook.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const finalAnswers = { ...answers, [currentQuestion.key]: processAnswer(currentAnswer, currentQuestion) };
    
    let submissionSuccessful = false;
    let newProjectId: string | number | null = null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ 
          user_id: user.id,
          requirements_json: finalAnswers, 
          status: 'submitted'
        }])
        .select('id')
        .single();

      if (error) {
        console.error("Error submitting project requirements to Supabase:", error);
        toast({ title: "Submission Error (Supabase)", description: `Failed to submit: ${error.message}`, variant: "destructive" });
      } else {
        console.log("Project requirements submitted to Supabase, response data:", data);
        if (data && data.id) {
            newProjectId = data.id;
            console.log("New project ID from Supabase:", newProjectId);
        } else {
            console.warn("Supabase insert succeeded but returned no data or ID.");
        }
        toast({ title: "Success!", description: "Project requirements submitted successfully to database." });
        submissionSuccessful = true;
      }
    } catch (e) {
      console.error("Unexpected error submitting to Supabase:", e);
      toast({ title: "Submission Error (Supabase)", description: "An unexpected error occurred.", variant: "destructive" });
    }

    if (submissionSuccessful && n8nWebhookUrl.trim()) {
      try {
        const webhookPayload = {
          userId: user.id,
          userEmail: user.email,
          userFullName: profile?.full_name || 'N/A',
          submissionTimestamp: new Date().toISOString(),
          projectRequirements: finalAnswers,
          supabaseProjectId: newProjectId 
        };

        console.log("Sending to n8n webhook:", n8nWebhookUrl, JSON.stringify(webhookPayload, null, 2));
        
        const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        });

        if (response.ok) {
          const responseData = await response.json().catch(() => ({}));
          console.log("Successfully sent data to n8n webhook:", responseData);
          toast({ title: "Webhook Success", description: "Data sent to n8n successfully." });
          navigate('/project-output', { state: { projectData: finalAnswers } });
        } else {
          const errorText = await response.text().catch(() => "Could not retrieve error details.");
          console.error("Error sending data to n8n webhook:", response.status, response.statusText, errorText);
          toast({ title: "Webhook Error", description: `Failed to send data to n8n: ${response.status} ${response.statusText}. Details: ${errorText.substring(0,100)}`, variant: "destructive" });
          navigate('/project-output', { state: { projectData: finalAnswers } });
        }
      } catch (e: any) {
        console.error("Error calling n8n webhook:", e);
        toast({ title: "Webhook Call Error", description: `An error occurred while calling n8n webhook: ${e.message ? e.message : 'Unknown error'}.`, variant: "destructive" });
        navigate('/project-output', { state: { projectData: finalAnswers } });
      }
    } else if (submissionSuccessful) { // No n8n URL or it was skipped
        navigate('/project-output', { state: { projectData: finalAnswers } });
    } else if (n8nWebhookUrl.trim() && !submissionSuccessful) {
      toast({ title: "Webhook Skipped", description: "Data not sent to n8n due to prior submission error.", variant: "default" });
    }

    setIsSubmitting(false);
  };

  const isValidHttpUrl = (string: string) => {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol.startsWith("https+");
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (authLoading) {
    return (
      <Card className="w-full max-w-2xl bg-card shadow-xl shadow-neon-green/30 border border-neon-green/50 flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
      </Card>
    );
  }

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
        <div className="space-y-2">
          <Label htmlFor={currentQuestion.id} className="text-lg font-semibold text-neon-green-lighter">
            {currentQuestion.label}
          </Label>
          {currentQuestion.prompt && (
            <p className="text-sm text-muted-foreground">{currentQuestion.prompt}</p>
          )}
          {currentQuestion.type === 'textarea' ? (
            <Textarea
              id={currentQuestion.id}
              value={currentAnswer}
              onChange={handleInputChange}
              placeholder={`Your answer for ${currentQuestion.label.toLowerCase()}`}
              className="min-h-[100px] bg-input border-neon-green/50 focus:ring-neon-green focus:border-neon-green"
              rows={4}
              disabled={isSubmitting}
            />
          ) : (
            <Input
              id={currentQuestion.id}
              type="text"
              value={currentAnswer}
              onChange={handleInputChange}
              placeholder={`Your answer for ${currentQuestion.label.toLowerCase()}`}
              className="bg-input border-neon-green/50 focus:ring-neon-green focus:border-neon-green"
              disabled={isSubmitting}
            />
          )}
        </div>

        {isLastQuestion && (
          <div className="space-y-3 pt-4 border-t border-neon-green/20">
             <Alert variant="default" className="bg-blue-900/20 border-blue-500/50 text-blue-300">
              <Info className="h-5 w-5 text-blue-400" />
              <AlertTitle className="font-semibold text-blue-300">n8n Webhook (Optional)</AlertTitle>
              <AlertDescription>
                If you want to send this data to an n8n workflow, paste your n8n webhook URL below. This step is optional.
                The URL will be saved in your browser's local storage for future use.
              </AlertDescription>
            </Alert>
            <div className="space-y-1">
              <Label htmlFor="n8nWebhookUrl" className="text-neon-green-lighter">
                n8n Webhook URL
              </Label>
              <Input
                id="n8nWebhookUrl"
                type="url"
                value={n8nWebhookUrl}
                onChange={handleN8nWebhookUrlChange}
                placeholder="https://your-n8n-instance.com/webhook/your-path"
                className="bg-input border-neon-green/50 focus:ring-neon-green focus:border-neon-green"
                disabled={isSubmitting}
              />
              {!n8nWebhookUrl.trim() && (
                 <p className="text-xs text-muted-foreground">Leave empty if you don't want to use n8n integration.</p>
              )}
              {n8nWebhookUrl.trim() && !isValidHttpUrl(n8nWebhookUrl) && (
                <p className="text-xs text-red-400">Please enter a valid URL (e.g., http://... or https://...).</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="border-neon-green text-neon-green hover:bg-neon-green/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !user || (n8nWebhookUrl.trim() && !isValidHttpUrl(n8nWebhookUrl))}
            className="bg-neon-green text-primary-foreground hover:bg-neon-green-darker"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Project <Zap className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={isSubmitting} 
            className="bg-neon-green text-primary-foreground hover:bg-neon-green-darker"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
