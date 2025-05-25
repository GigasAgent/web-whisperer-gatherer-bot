
import React, { useState } from 'react';
import { questions, Question } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea is available or similar
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Answers {
  [key: string]: string | string[];
}

export const Questionnaire: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentAnswer, setCurrentAnswer] = useState('');

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
      setCurrentAnswer(answers[questions[currentQuestionIndex + 1].key]?.toString() || ''); // Pre-fill if already answered
    } else {
      // Finished
      console.log("Final Answers:", { ...answers, [currentQuestion.key]: processAnswer(currentAnswer, currentQuestion) });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      // Save current answer before going back
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.key]: processAnswer(currentAnswer, currentQuestion)
      }));
      setCurrentQuestionIndex(prev => prev - 1);
      const prevQuestionKey = questions[currentQuestionIndex - 1].key;
      const prevAnswer = answers[prevQuestionKey];
      setCurrentAnswer(Array.isArray(prevAnswer) ? prevAnswer.join(', ') : prevAnswer?.toString() || '');
    }
  };
  
  const handleSubmit = async () => {
    const finalAnswers = { ...answers, [currentQuestion.key]: processAnswer(currentAnswer, currentQuestion) };
    console.log("Submitting data:", JSON.stringify(finalAnswers, null, 2));
    // Here you would typically send the data to a backend or webhook
    // e.g., await fetch('/api/submit-project', { method: 'POST', body: JSON.stringify(finalAnswers) });
    alert("Project requirements submitted! (Check console for JSON data)");
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (currentQuestionIndex >= questions.length) {
    // This state is reached if logic error, submit should happen on last question.
    // For safety, handle display of final answers if somehow past last question.
    // Correct flow: on last question, 'Next' becomes 'Finish' or similar.
    // The handleNext already logs when finished. Let's refine the "finished" state.
    // A better way: after last question's "Next" is clicked, show summary.
    // The current logic: state updates, then if index < length-1, go next, else log.
    // This means the UI for the summary/submit is needed after the last question.
    // For now, the submit button appears on the last question.
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
            />
          ) : (
            <Input
              id={currentQuestion.id}
              type="text"
              value={currentAnswer}
              onChange={handleInputChange}
              placeholder={`Your answer for ${currentQuestion.label.toLowerCase()}`}
              className="bg-input border-neon-green/50 focus:ring-neon-green focus:border-neon-green"
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="border-neon-green text-neon-green hover:bg-neon-green/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            className="bg-neon-green text-primary-foreground hover:bg-neon-green-darker"
          >
            Submit Project <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-neon-green text-primary-foreground hover:bg-neon-green-darker"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
