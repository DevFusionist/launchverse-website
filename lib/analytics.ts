// Analytics utility for tracking events and improving tag coverage

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const trackEvent = (
  eventName: string,
  parameters: Record<string, any> = {}
) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters,
    });
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  trackEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
  });
};

export const trackButtonClick = (buttonName: string, pagePath?: string) => {
  trackEvent("button_click", {
    button_name: buttonName,
    page_path: pagePath || window.location.pathname,
  });
};

export const trackFormSubmission = (formName: string, pagePath?: string) => {
  trackEvent("form_submission", {
    form_name: formName,
    page_path: pagePath || window.location.pathname,
  });
};

export const trackCourseView = (courseId: string, courseName: string) => {
  trackEvent("course_view", {
    course_id: courseId,
    course_name: courseName,
    page_path: window.location.pathname,
  });
};

export const trackBlogView = (blogId: string, blogTitle: string) => {
  trackEvent("blog_view", {
    blog_id: blogId,
    blog_title: blogTitle,
    page_path: window.location.pathname,
  });
};

export const trackContactFormSubmission = (source?: string) => {
  trackEvent("contact_form_submission", {
    source: source || "contact_page",
    page_path: window.location.pathname,
  });
};

export const trackPhoneCall = (phoneNumber: string) => {
  trackEvent("phone_call", {
    phone_number: phoneNumber,
    page_path: window.location.pathname,
  });
};

export const trackWhatsAppClick = (phoneNumber: string) => {
  trackEvent("whatsapp_click", {
    phone_number: phoneNumber,
    page_path: window.location.pathname,
  });
};

export const trackSocialMediaClick = (platform: string, url: string) => {
  trackEvent("social_media_click", {
    platform,
    url,
    page_path: window.location.pathname,
  });
};

export const trackCourseEnrollment = (courseId: string, courseName: string) => {
  trackEvent("course_enrollment", {
    course_id: courseId,
    course_name: courseName,
    page_path: window.location.pathname,
  });
};

export const trackCertificateDownload = (
  certificateId: string,
  courseName: string
) => {
  trackEvent("certificate_download", {
    certificate_id: certificateId,
    course_name: courseName,
    page_path: window.location.pathname,
  });
};
