import { Award, Users, Target, Lightbulb, GraduationCap, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const values = [
  {
    title: 'Excellence in Education',
    description: 'We are committed to delivering the highest quality education through industry-aligned curriculum and expert instructors.',
    icon: Award,
  },
  {
    title: 'Student Success',
    description: 'Our primary focus is on student success, ensuring every learner achieves their career goals through personalized support.',
    icon: Users,
  },
  {
    title: 'Industry Relevance',
    description: 'We continuously update our programs to match industry demands, preparing students for current and future job markets.',
    icon: Target,
  },
  {
    title: 'Innovation',
    description: 'We embrace innovative teaching methods and technologies to provide an engaging and effective learning experience.',
    icon: Lightbulb,
  },
];

const achievements = [
  {
    number: '5000+',
    label: 'Graduates',
    icon: GraduationCap,
  },
  {
    number: '95%',
    label: 'Placement Rate',
    icon: Briefcase,
  },
  {
    number: '50+',
    label: 'Industry Partners',
    icon: Users,
  },
  {
    number: '15+',
    label: 'Years Experience',
    icon: Award,
  },
];

const team = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Founder & Director',
    bio: 'With over 20 years of experience in education and technology, Dr. Johnson leads our vision and strategy.',
    image: '/team/sarah.jpg',
  },
  {
    name: 'Michael Chen',
    role: 'Head of Academics',
    bio: 'A former tech industry leader, Michael ensures our curriculum stays current with industry trends.',
    image: '/team/michael.jpg',
  },
  {
    name: 'Priya Sharma',
    role: 'Placement Director',
    bio: 'Priya has helped thousands of students launch successful careers through her extensive industry network.',
    image: '/team/priya.jpg',
  },
  {
    name: 'David Kim',
    role: 'Technical Lead',
    bio: 'David brings 15 years of software development experience to our technical training programs.',
    image: '/team/david.jpg',
  },
];

export default function AboutPage() {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          About Launch Verse
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          We are a premier training institute dedicated to transforming careers through
          industry-aligned education and practical training.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            To empower individuals with practical skills and knowledge that enable them
            to build successful careers in the technology and digital industries. We
            believe in making quality education accessible and ensuring our students
            are industry-ready from day one.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
          Our Values
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} className="flex flex-col items-center text-center">
              <CardContent className="flex flex-col items-center p-6">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="mb-16">
        <div className="rounded-lg bg-primary px-6 py-12 text-primary-foreground">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.label}
                className="flex flex-col items-center text-center"
              >
                <achievement.icon className="mb-4 h-8 w-8" />
                <div className="text-3xl font-bold">{achievement.number}</div>
                <div className="text-sm opacity-90">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
          Our Leadership Team
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <Card key={member.name} className="overflow-hidden">
              <div className="aspect-square w-full bg-muted" />
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="mb-2 text-sm text-primary">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to Start Your Journey?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Join thousands of successful graduates who have transformed their careers
          with Launch Verse.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href={ROUTES.courses}>Explore Courses</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={ROUTES.contact}>Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
} 