import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { ROUTES, SITE_CONFIG } from '@/lib/constants';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Courses', href: ROUTES.courses },
    { name: 'Blog', href: ROUTES.blog },
    { name: 'Certificates', href: ROUTES.certificates },
    { name: 'Placements', href: ROUTES.placements },
    { name: 'Contact', href: ROUTES.contact },
  ],
  social: [
    {
      name: 'Twitter',
      href: SITE_CONFIG.links.twitter,
      icon: Twitter,
    },
    {
      name: 'GitHub',
      href: SITE_CONFIG.links.github,
      icon: Github,
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="text-lg font-bold">
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-4 flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Navigation</h3>
            <ul className="mt-4 space-y-4">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
