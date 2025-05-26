
import React from 'react';
import { Question } from '@/data/questions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface QuestionDisplayProps {
  question: Question;
  currentAnswer: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSubmitting: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentAnswer,
  onInputChange,
  isSubmitting,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={question.id} className="text-lg font-semibold text-neon-green-lighter">
        {question.label}
      </Label>
      {question.prompt && (
        <p className="text-sm text-muted-foreground">{question.prompt}</p>
      )}
      {question.type === 'textarea' ? (
        <Textarea
          id={question.id}
          value={currentAnswer}
          onChange={onInputChange}
          placeholder={`Your answer for ${question.label.toLowerCase()}`}
          className="min-h-[100px] bg-input border-neon-green/50 focus:ring-neon-green focus:border-neon-green"
          rows={4}
          disabled={isSubmitting}
        />
      ) : (
        <Input
          id={question.id}
          type="text"
          value={currentAnswer}
          onChange={onInputChange}
          placeholder={`Your answer for ${question.label.toLowerCase()}`}
          className="bg-input border-neon-green/50 focus:ring-neon-green focus:border-neon-green"
          disabled={isSubmitting}
        />
      )}
    </div>
  );
};
