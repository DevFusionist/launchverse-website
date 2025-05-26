'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Search, Shield, Clock, Lock } from 'lucide-react';
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
import { Loader2 } from 'lucide-react';

export default function VerifyCertificateLandingPage() {
  const router = useRouter();
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <ParallaxSection
        speed={0.2}
        className="relative overflow-hidden bg-background py-20 sm:py-32"
      >
        <div className="container relative">
          <AnimatedSection
            variants={fadeIn}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Verify Your Certificate
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Enter your certificate code to verify its authenticity and view
              its details
            </p>
          </AnimatedSection>
        </div>
      </ParallaxSection>

      {/* Verification Form */}
      <section className="container">
        <div className="mx-auto max-w-2xl">
          <AnimatedSection variants={scaleIn}>
            <HoverCard>
              <CardHeader>
                <AnimatedSection variants={fadeIn}>
                  <CardTitle>Certificate Verification</CardTitle>
                  <CardDescription>
                    Enter the unique code found on your certificate
                  </CardDescription>
                </AnimatedSection>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatedSection variants={slideIn}>
                    <div className="flex gap-4">
                      <AnimatedErrorField error={error} className="flex-1">
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
                            'font-mono text-lg',
                            error &&
                              'border-destructive focus-visible:ring-destructive'
                          )}
                          maxLength={16}
                          disabled={isSubmitting}
                        />
                      </AnimatedErrorField>
                      <AnimatedButton
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-5 w-5" />
                            Verify
                          </>
                        )}
                      </AnimatedButton>
                    </div>
                  </AnimatedSection>
                </form>

                <AnimatedSection variants={slideIn} className="mt-8">
                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="mb-2 font-semibold">
                      Where to find your code?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your certificate code is a unique identifier printed on
                      your certificate. It starts with "LV-" followed by 6
                      alphanumeric characters (e.g., LV-XXXXXX).
                    </p>
                  </div>
                </AnimatedSection>
              </CardContent>
            </HoverCard>
          </AnimatedSection>

          {/* Features Grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <AnimatedSection variants={slideIn} custom={0}>
              <HoverCard className="text-center">
                <AnimatedIcon className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </AnimatedIcon>
                <h3 className="mb-2 font-semibold">Instant Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Get immediate results about your certificate's authenticity
                </p>
              </HoverCard>
            </AnimatedSection>
            <AnimatedSection variants={slideIn} custom={1}>
              <HoverCard className="text-center">
                <AnimatedIcon className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </AnimatedIcon>
                <h3 className="mb-2 font-semibold">Detailed Information</h3>
                <p className="text-sm text-muted-foreground">
                  View complete certificate details including issue date and
                  status
                </p>
              </HoverCard>
            </AnimatedSection>
            <AnimatedSection variants={slideIn} custom={2}>
              <HoverCard className="text-center">
                <AnimatedIcon className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </AnimatedIcon>
                <h3 className="mb-2 font-semibold">Secure & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Our verification system ensures the integrity of your
                  credentials
                </p>
              </HoverCard>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
