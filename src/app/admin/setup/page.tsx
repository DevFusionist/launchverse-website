'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const setupAdminSchema = z
  .object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SetupAdminForm = z.infer<typeof setupAdminSchema>;

export default function SetupAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [invitation, setInvitation] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const form = useForm<SetupAdminForm>({
    resolver: zodResolver(setupAdminSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      toast({
        title: 'Error',
        description: 'Invalid or missing invitation token',
        variant: 'destructive',
      });
      router.push('/admin/login');
      return;
    }

    // Fetch invitation details
    fetch(`/api/admin/create/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setInvitation(data.invitation);
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to verify invitation',
          variant: 'destructive',
        });
        router.push('/admin/login');
      });
  }, [searchParams, router, toast]);

  const onSubmit = async (data: SetupAdminForm) => {
    try {
      setIsLoading(true);
      const token = searchParams.get('token');
      const response = await fetch('/api/admin/create/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          otp: data.otp,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to set up account');
      }

      toast({
        title: 'Success',
        description: 'Account set up successfully. You can now log in.',
      });
      router.push('/admin/login');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to set up account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Verifying invitation...</h1>
          <p className="text-muted-foreground">
            Please wait while we verify your invitation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Set Up Your Account</h1>
        <p className="text-muted-foreground">
          Welcome {invitation.name}! Please enter the OTP sent to your email and
          set up your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Setting Up Account...' : 'Set Up Account'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
