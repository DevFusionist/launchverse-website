interface Workbox {
  register: () => void;
  messageSkipWaiting: () => void;
}

declare global {
  interface Window {
    workbox: Workbox;
  }
}

export function registerServiceWorker() {
  if (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    window.workbox !== undefined
  ) {
    const wb = window.workbox;

    // Add event listeners to handle PWA lifecycle
    addEventListener("message", (event) => {
      if (event.data && event.data.type === "SKIP_WAITING") {
        wb.messageSkipWaiting();
      }
    });

    // Register the service worker after event listeners are added
    wb.register();
  }
}

export function unregisterServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error("Error unregistering service worker:", error);
      });
  }
}
