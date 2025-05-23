import React, { ComponentType } from "react";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export function withErrorHandling<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return function ErrorBoundary(props: P) {
    try {
      return <Component {...props} />;
    } catch (error) {
      console.error("Error in component:", error);
      if (error instanceof AuthError) {
        // Handle auth errors
        return <div>Authentication error: {error.message}</div>;
      }
      if (error instanceof NotFoundError) {
        // Handle not found errors
        return <div>Not found: {error.message}</div>;
      }
      // Handle other errors
      return <div>Something went wrong. Please try again later.</div>;
    }
  };
}
