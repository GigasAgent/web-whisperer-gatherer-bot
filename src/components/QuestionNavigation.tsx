
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Zap, Loader2 } from 'lucide-react';

interface QuestionNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isLastQuestion: boolean;
  currentQuestionIndex: number;
  disableSubmit: boolean;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  onPrev,
  onNext,
  onSubmit,
  isSubmitting,
  isLastQuestion,
  currentQuestionIndex,
  disableSubmit,
}) => {
  return (
    <div className="flex justify-between p-6">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentQuestionIndex === 0 || isSubmitting}
        className="border-neon-green text-neon-green hover:bg-neon-green/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      {isLastQuestion ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || disableSubmit}
          className="bg-neon-green text-primary-foreground hover:bg-neon-green-darker"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Project <Zap className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={isSubmitting}
          className="bg-neon-green text-primary-foreground hover:bg-neon-green-darker"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
