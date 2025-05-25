
import { Questionnaire } from '@/components/Questionnaire';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-neon-green/50 selection:text-white">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight glowing-text">
          Let's Build Your Vision
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
          Answer a few questions to help us understand your project requirements.
        </p>
      </header>
      <Questionnaire />
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Project Requirements Collector. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
