"use client";

import { motion } from "framer-motion";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: string;
  _neonColor: string;
  description?: string;
};

const StatCard = ({
  title,
  value,
  icon,
  _neonColor,
  description,
}: StatCardProps) => {
  return (
    <CardContainer className="inter-var w-full">
      <CardBody
        className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border 
        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
        after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
        [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
        [&:hover]:border-emerald-500/50
        transition-all duration-500"
      >
        <CardItem className="text-4xl text-center" translateZ="200">
          {icon}
        </CardItem>

        <CardItem
          className="text-3xl font-bold text-neutral-600 dark:text-white mt-4 text-center"
          translateZ="150"
        >
          {value}
        </CardItem>

        <CardItem
          className="text-lg font-semibold text-neutral-600 dark:text-white mt-2 text-center"
          translateZ="180"
        >
          {title}
        </CardItem>

        {description && (
          <CardItem
            className="text-neutral-500 text-sm max-w-sm mt-2 text-center dark:text-neutral-300"
            translateZ="160"
          >
            {description}
          </CardItem>
        )}
      </CardBody>
    </CardContainer>
  );
};

type StatGridProps = {
  stats: StatCardProps[];
  title?: string;
};

export const StatGrid = ({ stats, title = "Our Impact" }: StatGridProps) => {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <section className="space-y-8">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[300px] mx-auto"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export { StatCard };
