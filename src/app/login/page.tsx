'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, buttonVariants, iconVariants, MotionDiv, PageTransition } from '@/components/ui/motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Github, Chrome } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function LoginPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Redirecting...',
        description: `Please complete the ${provider} login process.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: `Failed to login with ${provider}. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
        <AnimatedSection
          variants={slideIn}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2 text-center"
              >
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  <motion.div variants={staggerItem}>
                    <div className="relative">
                      <MotionDiv
                        initial={{ opacity: 0.5 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                      >
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </MotionDiv>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={cn(
                          "pl-9 transition-all duration-200",
                          "focus:ring-2 focus:ring-primary/20",
                          "hover:border-primary/50"
                        )}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <div className="relative">
                      <MotionDiv
                        initial={{ opacity: 0.5 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                      >
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </MotionDiv>
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={cn(
                          "pl-9 transition-all duration-200",
                          "focus:ring-2 focus:ring-primary/20",
                          "hover:border-primary/50"
                        )}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <MotionDiv
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                          "w-full transition-all duration-200",
                          "hover:bg-primary/90",
                          "active:scale-95"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {isLoading ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center gap-2"
                            >
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Signing in...
                            </motion.div>
                          ) : (
                            <motion.div
                              key="signin"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              Sign In
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </MotionDiv>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
                    <MotionDiv
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => handleSocialLogin('github')}
                        className={cn(
                          "w-full transition-all duration-200",
                          "hover:bg-primary/10 hover:text-primary",
                          "active:scale-95"
                        )}
                      >
                        <MotionDiv
                          whileHover={{ x: 2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="flex items-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          Github
                        </MotionDiv>
                      </Button>
                    </MotionDiv>

                    <MotionDiv
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => handleSocialLogin('google')}
                        className={cn(
                          "w-full transition-all duration-200",
                          "hover:bg-primary/10 hover:text-primary",
                          "active:scale-95"
                        )}
                      >
                        <MotionDiv
                          whileHover={{ x: 2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="flex items-center gap-2"
                        >
                          <Chrome className="h-4 w-4" />
                          Google
                        </MotionDiv>
                      </Button>
                    </MotionDiv>
                  </motion.div>

                  <motion.div variants={staggerItem} className="text-center text-sm">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <Link
                      href="/register"
                      className={cn(
                        "font-medium text-primary transition-colors",
                        "hover:text-primary/80"
                      )}
                    >
                      Sign up
                    </Link>
                  </motion.div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
