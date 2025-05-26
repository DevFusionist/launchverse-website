export const SITE_CONFIG = {
  name: 'Launch Verse',
  description:
    'Modern training institute platform for managing student enrollment, certificates, and placements',
  url: 'https://scriptauradev.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/launchverse',
    github: 'https://github.com/launchverse',
  },
} as const;

export const ROUTES = {
  home: '/',
  about: '/about',
  courses: '/courses',
  certificates: '/certificates',
  verify: '/verify',
  contact: '/contact',
  placements: '/placements',
  testimonials: '/testimonials',
  gallery: '/gallery',
  blog: '/blog',
  admin: {
    dashboard: '/admin',
    students: '/admin/students',
    courses: '/admin/courses',
    companies: '/admin/companies',
    certificates: '/admin/certificates',
    placements: '/admin/placements',
    settings: '/admin/settings',
  },
} as const;

export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    callback: '/api/auth/callback',
  },
  certificates: {
    verify: '/api/certificates/verify',
    generate: '/api/certificates/generate',
    revoke: '/api/certificates/revoke',
  },
  contact: '/api/contact',
  courses: '/api/courses',
  students: '/api/students',
  placements: '/api/placements',
} as const;
