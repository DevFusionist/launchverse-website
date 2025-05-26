'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/enhanced-motion';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Message Sent',
      description: 'Thank you for contacting us. We will get back to you soon.',
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
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
              Get in Touch
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Have questions? We're here to help. Reach out to us and we'll get
              back to you as soon as possible.
            </p>
          </AnimatedSection>
        </div>
      </ParallaxSection>

      {/* Contact Form and Info Section */}
      <section className="container">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <AnimatedSection variants={slideIn}>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Name
                      </label>
                      <AnimatedInput className="mt-2">
                        <Input
                          id="name"
                          placeholder="Your name"
                          required
                          disabled={isSubmitting}
                        />
                      </AnimatedInput>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <AnimatedInput className="mt-2">
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          required
                          disabled={isSubmitting}
                        />
                      </AnimatedInput>
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Message
                      </label>
                      <AnimatedInput className="mt-2">
                        <Textarea
                          id="message"
                          placeholder="Your message"
                          required
                          disabled={isSubmitting}
                          className="min-h-[120px]"
                        />
                      </AnimatedInput>
                    </div>
                  </div>
                  <AnimatedButton
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <AnimatedIcon className="ml-2">
                          <Send className="h-4 w-4" />
                        </AnimatedIcon>
                      </>
                    )}
                  </AnimatedButton>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Contact Information */}
          <div className="space-y-8">
            <AnimatedSection variants={fadeIn}>
              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  Contact Information
                </h2>
                <p className="text-muted-foreground">
                  We're here to help and answer any questions you might have. We
                  look forward to hearing from you.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <AnimatedSection
                  key={info.title}
                  variants={slideIn}
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                >
                  <HoverCard>
                    <div className="flex items-start gap-4">
                      <AnimatedIcon className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <info.icon className="h-5 w-5 text-primary" />
                      </AnimatedIcon>
                      <div>
                        <h3 className="font-semibold">{info.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </HoverCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
