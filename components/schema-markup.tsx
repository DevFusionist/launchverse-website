type LocalBusinessSchema = {
  name: string;
  image: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours: string;
  sameAs: string[];
  description: string;
};

type CourseSchema = {
  name: string;
  description: string;
  provider: {
    name: string;
    sameAs: string;
  };
};

type FAQSchema = {
  questions: Array<{
    question: string;
    answer: string;
  }>;
};

type BlogPostingSchema = {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  author: {
    name: string;
    url: string;
  };
  publisher: {
    name: string;
    url: string;
  };
};

export const generateLocalBusinessSchema = (data: LocalBusinessSchema) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: data.name,
  image: data.image,
  url: data.url,
  telephone: data.telephone,
  email: data.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: data.address.streetAddress,
    addressLocality: data.address.addressLocality,
    addressRegion: data.address.addressRegion,
    postalCode: data.address.postalCode,
    addressCountry: data.address.addressCountry,
  },
  openingHours: data.openingHours,
  sameAs: data.sameAs,
  description: data.description,
});

export const generateCourseSchema = (data: CourseSchema) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: data.name,
  description: data.description,
  provider: {
    "@type": "Organization",
    name: data.provider.name,
    sameAs: data.provider.sameAs,
  },
});

export const generateFaqSchema = (data: FAQSchema) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: data.questions.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: q.answer,
    },
  })),
});

export const generateBlogPostingSchema = (data: BlogPostingSchema) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: data.headline,
  description: data.description,
  image: data.image,
  datePublished: data.datePublished,
  author: {
    "@type": "Organization",
    name: data.author.name,
    url: data.author.url,
  },
  publisher: {
    "@type": "Organization",
    name: data.publisher.name,
    url: data.publisher.url,
  },
});
