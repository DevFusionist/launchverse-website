'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, buttonVariants, iconVariants, MotionDiv, PageTransition } from '@/components/ui/motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const contactInfo = [
  {
    title: 'Email',
    value: 'contact@launchverse.com',
    icon: Mail,
    link: 'mailto:contact@launchverse.com',
  },
  {
    title: 'Phone',
    value: '+91 1234567890',
    icon: Phone,
    link: 'tel:+911234567890',
  },
  {
    title: 'Address',
    value: '123 Tech Park, Bangalore, India',
    icon: MapPin,
    link: 'https://maps.google.com',
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Message Sent',
        description: 'We will get back to you soon!',
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="container py-8">
        <AnimatedSection
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            Get in touch with our team
          </motion.p>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-2">
          <AnimatedSection
            variants={slideIn}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                  Send us a Message
                </CardTitle>
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
                      <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className={cn(
                          "transition-all duration-200",
                          "focus:ring-2 focus:ring-primary/20",
                          "hover:border-primary/50"
                        )}
                      />
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className={cn(
                          "transition-all duration-200",
                          "focus:ring-2 focus:ring-primary/20",
                          "hover:border-primary/50"
                        )}
                      />
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <Input
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className={cn(
                          "transition-all duration-200",
                          "focus:ring-2 focus:ring-primary/20",
                          "hover:border-primary/50"
                        )}
                      />
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <Textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className={cn(
                          "min-h-[120px] transition-all duration-200",
                          "focus:ring-2 focus:ring-primary/20",
                          "hover:border-primary/50"
                        )}
                      />
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
                                Sending...
                              </motion.div>
                            ) : (
                              <motion.div
                                key="send"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2"
                              >
                                <Send className="h-4 w-4" />
                                Send Message
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </MotionDiv>
                    </motion.div>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection
            variants={slideIn}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="grid gap-4"
                >
                  {contactInfo.map((info) => (
                    <motion.a
                      key={info.title}
                      href={info.link}
                      target={info.title === 'Address' ? '_blank' : undefined}
                      rel={info.title === 'Address' ? 'noopener noreferrer' : undefined}
                      variants={staggerItem}
                      className="group flex items-center gap-4 rounded-lg border p-4 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                    >
                      <MotionDiv
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
                      >
                        <info.icon className="h-5 w-5" />
                      </MotionDiv>
                      <div className="flex-1">
                        <h4 className="font-medium transition-colors duration-200 group-hover:text-primary">
                          {info.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{info.value}</p>
                      </div>
                      <MotionDiv
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="text-muted-foreground"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </MotionDiv>
                    </motion.a>
                  ))}
                </motion.div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  <motion.div variants={staggerItem} className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </motion.div>
                  <motion.div variants={staggerItem} className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </motion.div>
                  <motion.div variants={staggerItem} className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
}
