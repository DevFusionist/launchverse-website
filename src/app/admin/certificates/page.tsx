'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Loader2,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CertificateStatus } from '@prisma/client';
import useSWR from 'swr';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection, fadeIn, slideIn } from '@/components/ui/motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type CertificateWithRelations = {
  id: string;
  code: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
  };
  issuedBy: {
    id: string;
    name: string;
  };
  issuedAt: string;
  revokedAt: string | null;
  status: CertificateStatus;
  revocationReason?: string | null;
  revocationNotes?: string | null;
};

export default function CertificatesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CertificateStatus | 'ALL'>(
    'ALL'
  );
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>(
    []
  );
  const [isBulkRevokeDialogOpen, setIsBulkRevokeDialogOpen] = useState(false);
  const [revocationReason, setRevocationReason] = useState<
    'MISUSE_VIOLATION' | 'ADMINISTRATIVE_ERROR'
  >('MISUSE_VIOLATION');
  const [revocationNotes, setRevocationNotes] = useState('');
  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateWithRelations | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<{
    certificates: CertificateWithRelations[];
  }>('/api/admin/certificates', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const filteredCertificates = data?.certificates.filter((cert) => {
    const matchesSearch =
      cert.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleBulkRevoke = async () => {
    try {
      const response = await fetch('/api/admin/certificates/bulk-revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificateIds: selectedCertificates,
          reason: revocationReason,
          notes: revocationNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw { message: data.error || 'Failed to revoke certificates' };
      }

      toast({
        title: 'Certificates Revoked',
        description: `${selectedCertificates.length} certificate(s) have been revoked successfully.`,
      });
      await mutate();
      setSelectedCertificates([]);
      setIsBulkRevokeDialogOpen(false);
      setRevocationReason('MISUSE_VIOLATION');
      setRevocationNotes('');
    } catch (error: any) {
      console.error('Error revoking certificates:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to revoke certificates',
      });
    }
  };

  const handleBulkDownload = async () => {
    try {
      const response = await fetch('/api/admin/certificates/bulk-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificateIds: selectedCertificates }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw { message: data.error || 'Failed to download certificates' };
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificates.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Download Started',
        description: `${selectedCertificates.length} certificate(s) are being downloaded.`,
      });
    } catch (error: any) {
      console.error('Error downloading certificates:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to download certificates',
      });
    }
  };

  const handleDownload = async (certificateId: string) => {
    try {
      setIsDownloading(true);
      const response = await fetch(
        `/api/admin/certificates/${certificateId}/download`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw { message: data.error || 'Failed to download certificate' };
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Download Started',
        description: 'Certificate download has started.',
      });
    } catch (error: any) {
      console.error('Error downloading certificate:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to download certificate',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 p-8">
      <AnimatedSection
        variants={fadeIn}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold">Certificates</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/admin/certificates/generate')}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            Generate Certificate
          </Button>
          {selectedCertificates.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setIsBulkRevokeDialogOpen(true)}
              className="transition-transform hover:scale-105 active:scale-95"
            >
              Revoke Selected
            </Button>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection variants={slideIn}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Certificate List</CardTitle>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search certificates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as CertificateStatus | 'ALL')
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="REVOKED">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                Failed to load certificates
              </div>
            ) : !data ? (
              <div className="text-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verification Code</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.certificates.map((certificate, index) => (
                        <AnimatedSection
                          key={certificate.id}
                          variants={fadeIn}
                          custom={index}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableRow>
                            <TableCell className="font-medium">
                              {certificate.student.name}
                            </TableCell>
                            <TableCell>{certificate.course.title}</TableCell>
                            <TableCell>
                              {new Date(
                                certificate.issuedAt
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  certificate.status === 'ACTIVE'
                                    ? 'default'
                                    : 'destructive'
                                }
                              >
                                {certificate.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {certificate.code}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCertificate(certificate);
                                  setIsViewDialogOpen(true);
                                }}
                                className="transition-transform hover:scale-105 active:scale-95"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(certificate.id)}
                                disabled={isDownloading}
                                className="transition-transform hover:scale-105 active:scale-95"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </AnimatedSection>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>

      <Dialog
        open={isBulkRevokeDialogOpen}
        onOpenChange={setIsBulkRevokeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Certificates</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke {selectedCertificates.length}{' '}
              certificate(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reason for Revocation
              </label>
              <Select
                value={revocationReason}
                onValueChange={(
                  value: 'MISUSE_VIOLATION' | 'ADMINISTRATIVE_ERROR'
                ) => setRevocationReason(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MISUSE_VIOLATION">
                    Misuse or Violation
                  </SelectItem>
                  <SelectItem value="ADMINISTRATIVE_ERROR">
                    Administrative Error
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <textarea
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter any additional details about the revocation..."
                value={revocationNotes}
                onChange={(e) => setRevocationNotes(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Impact of Revocation:</p>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                {revocationReason === 'ADMINISTRATIVE_ERROR' ? (
                  <>
                    <li>Student status will remain ACTIVE</li>
                    <li>Enrollment status will be set to ENROLLED</li>
                    <li>Student can retake the course</li>
                    <li>Certificate will be marked as revoked</li>
                  </>
                ) : (
                  <>
                    <li>
                      Student status will be set to INACTIVE (if no other active
                      enrollments)
                    </li>
                    <li>Enrollment status will be set to DROPPED</li>
                    <li>Certificate will be marked as revoked</li>
                    <li>Student may be barred from future enrollments</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsBulkRevokeDialogOpen(false);
                setRevocationReason('MISUSE_VIOLATION');
                setRevocationNotes('');
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkRevoke}>
              Revoke Certificates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate Details</DialogTitle>
            <DialogDescription>
              View detailed information about the certificate
            </DialogDescription>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Certificate Code
                  </h3>
                  <p className="font-mono">{selectedCertificate.code}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h3>
                  <Badge
                    variant="secondary"
                    className={
                      selectedCertificate.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }
                  >
                    {selectedCertificate.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Student Information
                  </h3>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">
                      {selectedCertificate.student.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCertificate.student.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Course Information
                  </h3>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">
                      {selectedCertificate.course.title}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Issuance Details
                  </h3>
                  <div className="rounded-lg border p-3">
                    <p>Issued by: {selectedCertificate.issuedBy.name}</p>
                    <p>
                      Issued at:{' '}
                      {new Date(selectedCertificate.issuedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedCertificate.status === 'REVOKED' && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Revocation Details
                    </h3>
                    <div className="rounded-lg border p-3">
                      <p>
                        Revoked at:{' '}
                        {new Date(
                          selectedCertificate.revokedAt!
                        ).toLocaleString()}
                      </p>
                      {selectedCertificate.revocationReason && (
                        <p>Reason: {selectedCertificate.revocationReason}</p>
                      )}
                      {selectedCertificate.revocationNotes && (
                        <p>Notes: {selectedCertificate.revocationNotes}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleDownload(selectedCertificate.id)}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
