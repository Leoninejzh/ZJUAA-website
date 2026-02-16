"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Component, ReactNode } from "react";

type Props = { children: ReactNode };

type BoundaryProps = Props & { fallback: ReactNode };

class SessionErrorBoundary extends Component<BoundaryProps, { hasError: boolean }> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function SessionProvider({ children }: Props) {
  return (
    <SessionErrorBoundary fallback={children}>
      <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
    </SessionErrorBoundary>
  );
}
