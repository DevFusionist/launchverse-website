'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  code: string;
  course: {
    title: string;
  };
  issuedAt: string;
  status: 'ACTIVE' | 'REVOKED';
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/student/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const response = await fetch('/api/student/certificates');
        if (!response.ok) throw new Error('Failed to fetch certificates');
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load certificates',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchCertificates();
    }
  }, [status]);

  const handleDownload = async (certificateId: string) => {
    try {
      setDownloadingId(certificateId);

      // First, get the certificate details
      const certResponse = await fetch(
        `/api/student/certificates/${certificateId}`
      );
      if (!certResponse.ok) {
        throw new Error('Failed to fetch certificate details');
      }
      const certData = await certResponse.json();

      // Then generate the PDF with all required fields
      const response = await fetch(`/api/certificates/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificateId: certData.id,
          name: session?.user?.name,
          course: certData.course.title,
          date: new Date(certData.issuedAt).toLocaleDateString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate certificate');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certData.code}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Certificate downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download certificate',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No certificates found
            </p>
          ) : (
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="font-semibold">{cert.course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Issued on {new Date(cert.issuedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Certificate ID: {cert.code}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(cert.id)}
                    disabled={
                      downloadingId === cert.id || cert.status === 'REVOKED'
                    }
                  >
                    {downloadingId === cert.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
