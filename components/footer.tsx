"use client";
import { Link } from "@heroui/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import { GithubIcon, TwitterIcon, DiscordIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const Footer = () => {
  return (
    <motion.footer
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-background/70 border-t border-divider/50 shadow-lg mt-16 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background/5 -z-10" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="visible"
        >
          {/* Quick Links Card */}
          <CardContainer className="inter-var w-full">
            <CardBody
              className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border 
              before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
              after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
              [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
              [&:hover]:border-emerald-500/50
              transition-all duration-500"
            >
              <CardItem className="text-lg font-semibold mb-2" translateZ="150">
                Quick Links
              </CardItem>
              <CardItem className="space-y-2" translateZ="120">
                {[
                  { label: "Courses", href: "/courses" },
                  { label: "About Us", href: "/about" },
                  { label: "Contact", href: "/contact" },
                  // { label: "Blog", href: "/blog" },
                ].map((item) => (
                  <motion.div
                    key={item.href}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Contact Us Card */}
          <CardContainer className="inter-var w-full">
            <CardBody
              className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border 
              before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
              after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
              [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
              [&:hover]:border-emerald-500/50
              transition-all duration-500"
            >
              <CardItem className="text-lg font-semibold mb-2" translateZ="150">
                Contact Us
              </CardItem>
              <CardItem
                className="text-sm text-muted-foreground mb-4"
                translateZ="100"
              >
                Have questions or need help? Reach out!
              </CardItem>
              <CardItem className="flex space-x-4" translateZ="120">
                <Link
                  aria-label="Twitter"
                  className="hover:text-primary"
                  href={siteConfig.links.twitter}
                >
                  <TwitterIcon className="h-5 w-5" />
                </Link>
                <Link
                  aria-label="Discord"
                  className="hover:text-primary"
                  href={siteConfig.links.discord}
                >
                  <DiscordIcon className="h-5 w-5" />
                </Link>
                <Link
                  aria-label="GitHub"
                  className="hover:text-primary"
                  href={siteConfig.links.github}
                >
                  <GithubIcon className="h-5 w-5" />
                </Link>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Address Card */}
          <CardContainer className="inter-var w-full">
            <CardBody
              className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border 
              before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
              after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
              [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
              [&:hover]:border-emerald-500/50
              transition-all duration-500"
            >
              <CardItem
                className="text-lg font-semibold mb-2 flex items-center gap-2"
                translateZ="150"
              >
                <MapPin className="h-5 w-5 text-primary" />
                Visit Us
              </CardItem>
              <CardItem
                className="space-y-2 text-sm text-muted-foreground"
                translateZ="120"
              >
                <p className="font-medium">LaunchVerse Academy</p>
                <p>131/26 (holding no)</p>
                <p>Tentul tala lane (east) (ward-2)</p>
                <p>Post-mankundu, ps-bhadreswar</p>
                <p>Dist-hooghly, West bengal - 712139</p>
                <p className="mt-4">
                  <a
                    className="hover:text-primary transition-colors"
                    href="mailto:sacredwebdev@gmail.com"
                  >
                    sacredwebdev@gmail.com
                  </a>
                </p>
                <p>
                  <a
                    className="hover:text-primary transition-colors"
                    href="tel:+917001478078"
                  >
                    +91 7001478078
                  </a>
                </p>
                <p>
                  <a
                    className="hover:text-primary transition-colors"
                    href="tel:+917508162363"
                  >
                    +91 7508162363
                  </a>
                </p>
                <div className="mt-4 mb-4 w-full h-[200px] rounded-lg overflow-hidden border border-divider/50">
                  <iframe
                    allowFullScreen
                    className="w-full h-full"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.1234567890123!2d88.3456789!3d22.6789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89d9c7c7c7c7c%3A0x7c7c7c7c7c7c7c7c!2s131%2F26%2C%20Tentul%20tala%20lane%2C%20Mankundu%2C%20West%20Bengal%20712139!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
                    style={{ border: 0 }}
                    title="Location Map"
                    width="100%"
                  />
                </div>
                <p className="mt-4">
                  <a
                    className="hover:text-primary transition-colors font-semibold"
                    href="https://www.google.com/maps/search/?api=1&query=131/26+Tentul+tala+lane+Mankundu+West+Bengal+712139"
                    rel="noopener noreferrer"
                    target="_blank"
                    title="View on Google Maps"
                  >
                    View on Google Maps
                  </a>
                </p>
              </CardItem>
            </CardBody>
          </CardContainer>
        </motion.div>

        {/* Bottom Bar (Copyright) */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-divider/50 mt-12 pt-8 text-center text-default-500"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p>
            © {new Date().getFullYear()} LaunchVerse Academy. All rights
            reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};
