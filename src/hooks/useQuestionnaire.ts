
import { useState, useCallback } from 'react';
import { questions, Question } from '@/data/questions';
import { Answers } from '@/types/questionnaireTypes';

export const useQuestionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const processAnswer = useCallback((answer: string, question: Question): string | string[] => {
    if (question.isArray) {
      return answer.split(',').map(item => item.trim()).filter(item => item !== '');
    }
    return answer.trim();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentAnswer(e.target.value);
  }, []);

  const updateAnswers = useCallback(() => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.key]: processAnswer(currentAnswer, currentQuestion)
    }));
  }, [currentAnswer, currentQuestion, processAnswer]);
  
  const updateAnswersIfDirty = useCallback(() => {
    if (currentAnswer.trim() !== '' || (Array.isArray(answers[currentQuestion.key]) && (answers[currentQuestion.key] as string[]).length > 0)) {
      updateAnswers();
    }
  }, [currentAnswer, answers, currentQuestion.key, updateAnswers]);


  const handleNext = useCallback(() => {
    updateAnswers();
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
      const nextQuestionKey = questions[nextQuestionIndex].key;
      const nextStoredAnswer = answers[nextQuestionKey];
      setCurrentAnswer(Array.isArray(nextStoredAnswer) ? nextStoredAnswer.join(', ') : nextStoredAnswer?.toString() || '');
    }
  }, [currentQuestionIndex, answers, updateAnswers]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      updateAnswersIfDirty();
      const prevQuestionIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevQuestionIndex);
      const prevQuestionKey = questions[prevQuestionIndex].key;
      const prevStoredAnswer = answers[prevQuestionKey];
      setCurrentAnswer(Array.isArray(prevStoredAnswer) ? prevStoredAnswer.join(', ') : prevStoredAnswer?.toString() || '');
    }
  }, [currentQuestionIndex, answers, updateAnswersIfDirty]);
  
  const getFinalAnswers = useCallback(() => {
    return { ...answers, [currentQuestion.key]: processAnswer(currentAnswer, currentQuestion) };
  }, [answers, currentQuestion.key, currentAnswer, processAnswer]);


  return {
    currentQuestionIndex,
    answers,
    setAnswers,
    currentAnswer,
    setCurrentAnswer,
    currentQuestion,
    isLastQuestion,
    progressPercentage,
    handleInputChange,
    handleNext,
    handlePrev,
    processAnswer,
    getFinalAnswers,
  };
};
