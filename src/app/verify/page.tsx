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
import { Search } from 'lucide-react';

export default function VerifyCertificateLandingPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('Please enter a certificate code');
      return;
    }

    // Validate code format (LV-XXXXXX)
    if (!/^LV-[A-Z0-9]{6}$/.test(code.toUpperCase())) {
      setError('Invalid certificate code format. Expected format: LV-XXXXXX');
      return;
    }

    router.push(`/verify/${code.toUpperCase()}`);
  };

  return (
    <div className="container mx-auto py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold">Verify Your Certificate</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Enter your certificate code to verify its authenticity and view its
          details
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Verification</CardTitle>
            <CardDescription>
              Enter the unique code found on your certificate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Enter certificate code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="font-mono text-lg"
                  maxLength={16}
                />
                <Button type="submit" size="lg">
                  <Search className="mr-2 h-5 w-5" />
                  Verify
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}
            </form>

            <div className="mt-8 rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">Where to find your code?</h3>
              <p className="text-sm text-muted-foreground">
                Your certificate code is a unique identifier printed on your
                certificate. It starts with "LV-" followed by 6 alphanumeric
                characters (e.g., LV-XXXXXX).
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-center">
            <h3 className="mb-2 font-semibold">Instant Verification</h3>
            <p className="text-sm text-muted-foreground">
              Get immediate results about your certificate's authenticity
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-center">
            <h3 className="mb-2 font-semibold">Detailed Information</h3>
            <p className="text-sm text-muted-foreground">
              View complete certificate details including issue date and status
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-center">
            <h3 className="mb-2 font-semibold">Secure & Reliable</h3>
            <p className="text-sm text-muted-foreground">
              Our verification system ensures the integrity of your credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
