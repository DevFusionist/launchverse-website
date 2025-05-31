"use client";

import { motion } from "framer-motion";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  icon: string;
  expertise: string[];
};

type Value = {
  title: string;
  description: string;
  icon: string;
};

type Stat = {
  value: string;
  label: string;
};

type AboutClientProps = {
  mission: string;
  vision: string;
  values: Value[];
  team: TeamMember[];
  stats: Stat[];
};

// Add default team members with Unsplash images
const defaultTeam: TeamMember[] = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    bio: "Former tech lead at Google with 10+ years of experience in AI and education technology. Passionate about making quality education accessible to all.",
    icon: "👩‍💻",
    expertise: ["AI", "Education Technology"],
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO",
    bio: "Full-stack developer with expertise in AI and machine learning. Previously led engineering teams at Microsoft and Amazon.",
    icon: "👨‍💻",
    expertise: ["AI", "Machine Learning"],
  },
  {
    name: "Priya Patel",
    role: "Head of Product",
    bio: "Product visionary with a background in educational psychology. Focused on creating intuitive and engaging learning experiences.",
    icon: "👩‍🎓",
    expertise: ["Educational Psychology", "Product Design"],
  },
  {
    name: "David Kim",
    role: "Lead Developer",
    bio: "Full-stack developer specializing in React and Node.js. Passionate about building scalable and performant applications.",
    icon: "👨‍💻",
    expertise: ["React", "Node.js"],
  },
  {
    name: "Emma Wilson",
    role: "UX Designer",
    bio: "Award-winning designer with a focus on creating beautiful and accessible user interfaces. Previously at Airbnb and Figma.",
    icon: "👩‍🎨",
    expertise: ["UX Design", "UI Design"],
  },
  {
    name: "James Thompson",
    role: "Head of Growth",
    bio: "Growth marketing expert with a track record of scaling edtech startups. Focused on sustainable user acquisition and retention.",
    icon: "👨‍🌾",
    expertise: ["Growth Marketing", "EdTech"],
  },
  {
    name: "Aisha Okafor",
    role: "Content Director",
    bio: "Former teacher turned content creator. Dedicated to developing engaging and effective learning materials.",
    icon: "👩‍🏫",
    expertise: ["Educational Content Development", "Teaching"],
  },
  {
    name: "Michael Chang",
    role: "AI Research Lead",
    bio: "PhD in Machine Learning from MIT. Leading our AI initiatives to create personalized learning experiences.",
    icon: "👨‍🎓",
    expertise: ["Machine Learning", "AI"],
  },
];

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <CardContainer className="inter-var w-full">
      <CardBody
        className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-8 border 
        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
        after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
        [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
        [&:hover]:border-emerald-500/50
        transition-all duration-500"
      >
        <CardItem className="w-full" translateZ="200">
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl">
            {member.icon}
          </div>
        </CardItem>

        <CardItem
          className="text-xl font-bold text-neutral-600 dark:text-white mt-4 text-center"
          translateZ="150"
        >
          {member.name}
        </CardItem>

        <CardItem
          className="text-primary font-medium text-center mt-2"
          translateZ="180"
        >
          {member.role}
        </CardItem>

        <CardItem
          className="text-neutral-500 text-sm max-w-sm mt-4 text-center dark:text-neutral-300"
          translateZ="120"
        >
          {member.bio}
        </CardItem>

        <CardItem className="mt-4" translateZ="100">
          <div className="flex flex-wrap gap-2 justify-center">
            {member.expertise.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

const ValueCard = ({ value }: { value: Value }) => {
  return (
    <CardContainer className="inter-var w-full">
      <CardBody
        className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-8 border 
        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-purple-500/40 before:via-pink-500/40 before:to-rose-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
        after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-purple-500/30 after:via-pink-500/30 after:to-rose-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
        [&:hover]:shadow-[0_0_30px_rgba(168,85,247,0.3)] [&:hover]:shadow-purple-500/30
        [&:hover]:border-purple-500/50
        transition-all duration-500"
      >
        <CardItem className="text-5xl text-center" translateZ="200">
          {value.icon}
        </CardItem>

        <CardItem
          className="text-xl font-bold text-neutral-600 dark:text-white mt-4 text-center"
          translateZ="150"
        >
          {value.title}
        </CardItem>

        <CardItem
          className="text-neutral-500 text-sm max-w-sm mt-4 text-center dark:text-neutral-300"
          translateZ="180"
        >
          {value.description}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

const StatCard = ({ stat }: { stat: Stat }) => {
  return (
    <CardContainer className="inter-var w-full">
      <CardBody
        className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-cyan-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-8 border 
        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-cyan-500/40 before:via-blue-500/40 before:to-indigo-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
        after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-cyan-500/30 after:via-blue-500/30 after:to-indigo-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
        [&:hover]:shadow-[0_0_30px_rgba(6,182,212,0.3)] [&:hover]:shadow-cyan-500/30
        [&:hover]:border-cyan-500/50
        transition-all duration-500"
      >
        <CardItem
          className="text-4xl font-bold text-neutral-600 dark:text-white text-center"
          translateZ="200"
        >
          {stat.value}
        </CardItem>

        <CardItem
          className="text-neutral-500 text-sm max-w-sm mt-4 text-center dark:text-neutral-300"
          translateZ="180"
        >
          {stat.label}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

export const AboutClient = ({
  mission,
  vision,
  values,
  team = defaultTeam,
  stats,
}: AboutClientProps) => {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Mission & Vision Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-default-500 text-lg">{mission}</p>
        </motion.div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold">Our Vision</h2>
          <p className="text-default-500 text-lg">{vision}</p>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="space-y-8">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Our Values
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ValueCard value={value} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="space-y-8">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Our Impact
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard stat={stat} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-8">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TeamMemberCard member={member} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
