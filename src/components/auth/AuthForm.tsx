
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  fullName: z.string().optional(), // Only for sign-up
});

type AuthFormValues = z.infer<typeof formSchema>;

interface AuthFormProps {
  isSignUpMode: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isSignUpMode }) => {
  const { signInWithEmail, signUpWithEmail, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: AuthFormValues) => {
    if (isSignUpMode) {
      await signUpWithEmail(data.email, data.password, data.fullName);
    } else {
      await signInWithEmail(data.email, data.password);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isSignUpMode && (
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-neon-green-lighter">Full Name (Optional)</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Your Name"
            {...register("fullName")}
            className="bg-input border-neon-green/50 focus:ring-neon-green focus:border-neon-green"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-neon-green-lighter">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="bg-input border-neon-green/50 focus:ring-neon-green focus:border-neon-green"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-neon-green-lighter">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className="bg-input border-neon-green/50 focus:ring-neon-green focus:border-neon-green"
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full bg-neon-green text-primary-foreground hover:bg-neon-green-darker" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSignUpMode ? 'Sign Up' : 'Sign In'}
      </Button>
    </form>
  );
};
