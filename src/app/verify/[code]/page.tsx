'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';

type CertificateDetails = {
  code: string;
  studentName: string;
  courseTitle: string;
  courseDescription: string;
  issuedAt: string;
  issuedBy: string;
  status: 'ACTIVE' | 'REVOKED';
  revokedAt?: string;
};

type VerificationResponse = {
  isValid: boolean;
  message: string;
  certificate: CertificateDetails;
};

export default function VerifyCertificatePage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationResponse | null>(
    null
  );

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/certificates/verify?code=${params.code}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify certificate');
        }

        setVerification(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.code) {
      verifyCertificate();
    }
  }, [params.code]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-red-500">
              Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!verification) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Certificate Verification</CardTitle>
            <Badge
              variant="secondary"
              className={
                verification.isValid
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              }
            >
              {verification.isValid ? 'Valid' : 'Invalid'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Certificate Details</h3>
            <div className="mt-4 grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Certificate Code
                </p>
                <p className="font-mono">{verification.certificate.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p>{verification.certificate.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Course</p>
                <p>{verification.certificate.courseTitle}</p>
                {verification.certificate.courseDescription && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {verification.certificate.courseDescription}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Issued By</p>
                <p>{verification.certificate.issuedBy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Issued On</p>
                <p>{formatDate(verification.certificate.issuedAt)}</p>
              </div>
              {verification.certificate.status === 'REVOKED' && (
                <div>
                  <p className="text-sm text-muted-foreground">Revoked On</p>
                  <p>{formatDate(verification.certificate.revokedAt!)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              This certificate was verified on {formatDate(new Date())} using{' '}
              <a
                href={SITE_CONFIG.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {SITE_CONFIG.name}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
