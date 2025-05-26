'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, buttonVariants, iconVariants, MotionDiv, PageTransition } from '@/components/ui/motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Shield, Clock, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VerifyCertificatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCode = (code: string) => {
    if (!code.trim()) {
      return 'Please enter a certificate code';
    }
    if (!/^LV-[A-Z0-9]{6}$/.test(code.toUpperCase())) {
      return 'Invalid certificate code format. Expected format: LV-XXXXXX';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const validationError = validateCode(code);
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      router.push(`/verify/${code.toUpperCase()}`);
    } catch (err) {
      setError('An error occurred while verifying the certificate');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-16">
        <AnimatedSection
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden bg-background py-20 sm:py-32"
        >
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Verify Your Certificate
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-lg leading-8 text-muted-foreground"
              >
                Enter your certificate code to verify its authenticity and view its details
              </motion.p>
            </motion.div>
          </div>
        </AnimatedSection>

        <section className="container">
          <div className="mx-auto max-w-2xl">
            <AnimatedSection
              variants={slideIn}
              initial="hidden"
              animate="visible"
            >
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-2"
                  >
                    <CardTitle>Certificate Verification</CardTitle>
                    <CardDescription>
                      Enter the unique code found on your certificate
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                            <Search className="h-4 w-4 text-muted-foreground" />
                          </MotionDiv>
                          <Input
                            type="text"
                            placeholder="Enter certificate code"
                            value={code}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase();
                              setCode(value);
                              setError(null);
                            }}
                            className={cn(
                              'pl-9 font-mono text-lg transition-all duration-200',
                              'focus:ring-2 focus:ring-primary/20',
                              'hover:border-primary/50',
                              error && 'border-destructive focus-visible:ring-destructive'
                            )}
                            maxLength={16}
                            disabled={isSubmitting}
                          />
                        </div>
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-destructive"
                          >
                            {error}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div variants={staggerItem}>
                        <MotionDiv
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                              "w-full transition-all duration-200",
                              "hover:bg-primary/90",
                              "active:scale-95"
                            )}
                          >
                            <AnimatePresence mode="wait">
                              {isSubmitting ? (
                                <motion.div
                                  key="loading"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-center gap-2"
                                >
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Verifying...
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="verify"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-center gap-2"
                                >
                                  <Search className="h-4 w-4" />
                                  Verify Certificate
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Button>
                        </MotionDiv>
                      </motion.div>
                    </motion.div>
                  </form>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="mt-8 grid gap-6 md:grid-cols-3"
                  >
                    <motion.div variants={staggerItem}>
                      <Card className="text-center transition-all duration-300 hover:shadow-lg">
                        <CardContent className="pt-6">
                          <MotionDiv
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                          >
                            <Shield className="h-6 w-6 text-primary" />
                          </MotionDiv>
                          <h3 className="mb-2 font-semibold">Instant Verification</h3>
                          <p className="text-sm text-muted-foreground">
                            Get immediate results about your certificate's authenticity
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <Card className="text-center transition-all duration-300 hover:shadow-lg">
                        <CardContent className="pt-6">
                          <MotionDiv
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                          >
                            <Clock className="h-6 w-6 text-primary" />
                          </MotionDiv>
                          <h3 className="mb-2 font-semibold">Detailed Information</h3>
                          <p className="text-sm text-muted-foreground">
                            View complete certificate details including issue date and status
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <Card className="text-center transition-all duration-300 hover:shadow-lg">
                        <CardContent className="pt-6">
                          <MotionDiv
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                          >
                            <Lock className="h-6 w-6 text-primary" />
                          </MotionDiv>
                          <h3 className="mb-2 font-semibold">Secure & Reliable</h3>
                          <p className="text-sm text-muted-foreground">
                            Our verification system ensures the integrity of your credentials
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
