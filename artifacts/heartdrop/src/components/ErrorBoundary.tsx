import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("HeartDrop render error", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="min-h-screen bg-[#0A0A0A] px-6 flex items-center justify-center text-center">
        <div className="w-full max-w-md">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: "rgba(183,110,121,0.12)",
              color: "#D98A96",
            }}
          >
            <AlertTriangle size={30} aria-hidden="true" />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#B76E79]">
            HeartDrop
          </p>
          <h1 className="mt-3 font-serif text-3xl text-white">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#8A8A9A]">
            This page ran into an unexpected problem. You can reload it or head
            back home and try again.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #B76E79, #8B4A56)",
                boxShadow: "0 4px 20px rgba(183,110,121,0.3)",
              }}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Reload page
            </button>
            <a
              href={import.meta.env.BASE_URL}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-[#D8B0B6] transition-colors hover:bg-white/5"
            >
              <Home size={16} aria-hidden="true" />
              Back home
            </a>
          </div>
        </div>
      </main>
    );
  }
}