"use client";

import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  FileCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

// Mock data - replace with real data from your API
const stats = [
  {
    title: "Total Students",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Active Courses",
    value: "45",
    change: "+5.2%",
    trend: "up",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Certificates Issued",
    value: "892",
    change: "+8.1%",
    trend: "up",
    icon: FileCheck,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Completion Rate",
    value: "78%",
    change: "-2.4%",
    trend: "down",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
  },
];

const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "completed",
    course: "Advanced Web Development",
    time: "2 hours ago",
    icon: FileCheck,
  },
  {
    id: 2,
    user: "Sarah Smith",
    action: "enrolled in",
    course: "Data Science Fundamentals",
    time: "3 hours ago",
    icon: BookOpen,
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "earned certificate in",
    course: "UI/UX Design",
    time: "5 hours ago",
    icon: FileCheck,
  },
  {
    id: 4,
    user: "Emily Brown",
    action: "started",
    course: "Machine Learning Basics",
    time: "6 hours ago",
    icon: BookOpen,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Welcome back, Admin
          </h1>
          <p className="text-default-500 mt-1">
            Let&apos;s get you started with your admin dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2 text-default-500">
          <Clock className="w-5 h-5" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CardContainer>
              <CardBody className="relative group/input bg-background/30 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
                <CardItem
                  className="flex items-center justify-between"
                  translateZ="50"
                >
                  <div>
                    <p className="text-sm text-default-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <div
                      className={`flex items-center gap-1 mt-2 text-sm ${
                        stat.trend === "up"
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <CardContainer>
          <CardBody className="relative group/input bg-background/30 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
            <CardItem translateZ="50">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-background/20 hover:bg-background/30 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <activity.icon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        <span className="text-foreground">{activity.user}</span>{" "}
                        <span className="text-default-500">
                          {activity.action}
                        </span>{" "}
                        <span className="text-foreground">
                          {activity.course}
                        </span>
                      </p>
                      <p className="text-sm text-default-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <CardContainer>
          <CardBody className="relative group/input bg-background/30 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
            <CardItem translateZ="50">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors text-emerald-500">
                  <Users className="w-6 h-6 mb-2" />
                  <span className="block text-sm font-medium">Add Student</span>
                </button>
                <button className="p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors text-blue-500">
                  <BookOpen className="w-6 h-6 mb-2" />
                  <span className="block text-sm font-medium">New Course</span>
                </button>
                <button className="p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition-colors text-purple-500">
                  <FileCheck className="w-6 h-6 mb-2" />
                  <span className="block text-sm font-medium">
                    Issue Certificate
                  </span>
                </button>
                <button className="p-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 transition-colors text-orange-500">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span className="block text-sm font-medium">
                    View Reports
                  </span>
                </button>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        <CardContainer>
          <CardBody className="relative group/input bg-background/30 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
            <CardItem translateZ="50">
              <h2 className="text-xl font-bold mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Server Status</span>
                  </div>
                  <span className="text-emerald-500">Operational</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Database</span>
                  </div>
                  <span className="text-emerald-500">Connected</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>API Services</span>
                  </div>
                  <span className="text-emerald-500">Running</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Storage</span>
                  </div>
                  <span className="text-emerald-500">Healthy</span>
                </div>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
      </motion.div>
    </div>
  );
}
