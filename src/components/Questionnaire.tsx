import React, { useState } from 'react';
import { questions, Question } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Answers {
  [key: string]: string | string[];
}

export const Questionnaire: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      if (currentAnswer.trim() !== '') {
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
    setIsSubmitting(true);
    const finalAnswers = { ...answers, [currentQuestion.key]: processAnswer(currentAnswer, currentQuestion) };
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ 
          user_id: user.id,
          requirements_json: finalAnswers,
          status: 'submitted'
        }])
        .select();

      if (error) {
        console.error("Error submitting project requirements:", error);
        toast({ title: "Submission Error", description: `Failed to submit: ${error.message}`, variant: "destructive" });
      } else {
        console.log("Project requirements submitted:", data);
        toast({ title: "Success!", description: "Project requirements submitted successfully." });
        // Optionally, redirect or clear form
        // setAnswers({});
        // setCurrentAnswer('');
        // setCurrentQuestionIndex(0);
      }
    } catch (e) {
      console.error("Unexpected error submitting:", e);
      toast({ title: "Submission Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting || !user}
            className="bg-neon-green text-primary-foreground hover:bg-neon-green-darker"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Project <CheckCircle2 className="ml-2 h-4 w-4" />
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
