'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    title: 'Email',
    description: 'info@launchverse.com',
    icon: Mail,
  },
  {
    title: 'Phone',
    description: '+91 98765 43210',
    icon: Phone,
  },
  {
    title: 'Address',
    description: '123 Tech Park, Bangalore, Karnataka, India - 560103',
    icon: MapPin,
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Message sent!',
      description: 'We will get back to you shortly.',
    });

    setIsSubmitting(false);
    (event.target as HTMLFormElement).reset();
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Have questions? We'd love to hear from you. Send us a message and we'll
          respond as soon as possible.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <div>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Course Inquiry"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your inquiry..."
                    required
                    className="min-h-[150px]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Get in Touch</h2>
            <p className="text-muted-foreground">
              We're here to help and answer any questions you might have. We look
              forward to hearing from you.
            </p>
          </div>

          <div className="grid gap-6">
            {contactInfo.map((info) => (
              <Card key={info.title}>
                <CardContent className="flex items-center p-6">
                  <div className="mr-4 rounded-full bg-primary/10 p-3">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{info.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-[4/3] w-full bg-muted">
                {/* In a real app, this would be an embedded Google Map */}
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Map Placeholder
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 