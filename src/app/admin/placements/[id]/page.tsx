'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import useSWR, { mutate } from 'swr';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Loader2, Pencil, Save, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  companyId: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  package: z.string().min(1, 'Package is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  status: z.enum(['OFFERED', 'JOINED', 'DECLINED']),
  notes: z.string().optional(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const statusColors: Record<string, string> = {
  OFFERED: 'bg-blue-100 text-blue-800',
  JOINED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
};

export default function PlacementDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: placement,
    error,
    isLoading,
  } = useSWR<{
    placement: {
      id: string;
      student: { id: string; name: string; email: string };
      company: { id: string; name: string; logo?: string };
      createdBy: { name: string };
      createdAt: string;
      updatedAt: string;
      position: string;
      package: number;
      joiningDate: string;
      status: 'OFFERED' | 'JOINED' | 'DECLINED';
      notes?: string;
    };
    students: { id: string; name: string; email: string }[];
    companies: { id: string; name: string }[];
  }>(`/api/admin/placements/${params.id}`, fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: placement?.placement
      ? {
          ...placement.placement,
          package: placement.placement.package.toString(),
          joiningDate: placement.placement.joiningDate.split('T')[0],
        }
      : undefined,
  });

  // Update form when placement data changes
  useEffect(() => {
    if (placement?.placement) {
      form.reset({
        ...placement.placement,
        package: placement.placement.package.toString(),
        joiningDate: placement.placement.joiningDate.split('T')[0],
      });
    }
  }, [placement, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/placements/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          package: parseFloat(values.package),
        }),
      });

      if (!response.ok) throw new Error('Failed to update placement');

      // Revalidate the placement data
      await mutate(`/api/admin/placements/${params.id}`);

      toast({
        title: 'Placement record updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Failed to update placement record',
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/placements/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete placement');

      toast({
        title: 'Placement record deleted successfully',
      });
      router.push('/admin/placements');
    } catch (error) {
      toast({
        title: 'Failed to delete placement record',
      });
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !placement) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          Failed to load placement details
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Placement Details</h1>
          <p className="text-muted-foreground">
            View and manage placement information
          </p>
        </div>
        <div className="flex gap-4">
          {!isEditing && (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Placement Record</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this placement record?
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Placement Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select student" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {placement.students.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} ({student.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {placement.companies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="package"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package (LPA)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value?.toString()}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="joiningDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Joining Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value?.split('T')[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="OFFERED">Offered</SelectItem>
                            <SelectItem value="JOINED">Joined</SelectItem>
                            <SelectItem value="DECLINED">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-24"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Student
                  </h3>
                  <div className="mt-1">
                    <div className="font-medium">
                      {placement.placement.student.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {placement.placement.student.email}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Company
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    {placement.placement.company.logo && (
                      <img
                        src={placement.placement.company.logo}
                        alt={placement.placement.company.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    )}
                    <span className="font-medium">
                      {placement.placement.company.name}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Position
                  </h3>
                  <div className="mt-1 font-medium">
                    {placement.placement.position}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Package
                  </h3>
                  <div className="mt-1 font-medium">
                    ₹{placement.placement.package.toFixed(2)} LPA
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Joining Date
                  </h3>
                  <div className="mt-1 font-medium">
                    {format(
                      new Date(placement.placement.joiningDate),
                      'MMMM d, yyyy'
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h3>
                  <div className="mt-1">
                    <Badge
                      variant="secondary"
                      className={statusColors[placement.placement.status]}
                    >
                      {placement.placement.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {placement.placement.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Notes
                  </h3>
                  <div className="mt-1 whitespace-pre-wrap text-sm">
                    {placement.placement.notes}
                  </div>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Created By
                  </h3>
                  <div className="mt-1 font-medium">
                    {placement.placement.createdBy.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(placement.placement.createdAt), 'PPp')}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </h3>
                  <div className="mt-1 font-medium">
                    {format(new Date(placement.placement.updatedAt), 'PPp')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
