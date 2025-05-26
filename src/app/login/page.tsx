'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';
import {
  AnimatedSection,
  ParallaxSection,
  fadeIn,
  slideIn,
  scaleIn,
} from '@/components/ui/motion';
import {
  HoverCard,
  AnimatedButton,
  AnimatedIcon,
  AnimatedInput,
  AnimatedErrorField,
  AnimatedError,
} from '@/components/ui/enhanced-motion';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'admin' || modeParam === 'student') {
      setLoginType(modeParam);
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        mode: loginType,
        redirect: false,
      });

      if (result?.error) {
        console.error('Login error:', result.error);
        setErrors({
          general: 'Invalid email or password',
        });
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password',
        });
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        router.push(loginType === 'admin' ? '/admin' : '/student/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: 'An error occurred. Please try again.',
      });
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
      <ParallaxSection speed={0.1} className="w-full max-w-md">
        <AnimatedSection variants={scaleIn}>
          <HoverCard className="w-full">
            <CardHeader>
              <AnimatedSection variants={fadeIn}>
                <CardTitle className="text-center text-2xl font-bold">
                  {loginType === 'admin' ? 'Admin Login' : 'Student Login'}
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </AnimatedSection>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatedSection variants={slideIn} custom={0}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <AnimatedErrorField error={errors.email}>
                      <Input
                        id="email"
                        type="email"
                        placeholder={
                          loginType === 'admin'
                            ? 'admin@example.com'
                            : 'student@example.com'
                        }
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        required
                        disabled={isLoading}
                        className={cn(
                          errors.email &&
                            'border-destructive focus-visible:ring-destructive'
                        )}
                      />
                    </AnimatedErrorField>
                  </div>
                </AnimatedSection>
                <AnimatedSection variants={slideIn} custom={1}>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <AnimatedErrorField error={errors.password}>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }}
                        required
                        disabled={isLoading}
                        className={cn(
                          errors.password &&
                            'border-destructive focus-visible:ring-destructive'
                        )}
                      />
                    </AnimatedErrorField>
                  </div>
                </AnimatedSection>
                {errors.general && (
                  <AnimatedSection variants={fadeIn}>
                    <AnimatedError className="justify-center">
                      {errors.general}
                    </AnimatedError>
                  </AnimatedSection>
                )}
                <AnimatedSection variants={slideIn} custom={2}>
                  <AnimatedButton
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <AnimatedIcon className="ml-2">
                          <LogIn className="h-4 w-4" />
                        </AnimatedIcon>
                      </>
                    )}
                  </AnimatedButton>
                </AnimatedSection>
              </form>
            </CardContent>
          </HoverCard>
        </AnimatedSection>
      </ParallaxSection>
    </div>
  );
}
