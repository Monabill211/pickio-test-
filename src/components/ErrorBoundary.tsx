import React, { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Something went wrong
              </h1>
              <p className="text-muted-foreground text-sm">
                An unexpected error occurred. Please try again or go back to the home page.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-muted p-3 rounded-lg">
                <summary className="cursor-pointer font-mono text-xs text-destructive">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs overflow-auto max-h-40 text-muted-foreground">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-2 justify-center pt-4">
              <Button
                onClick={() => window.location.reload()}
                variant="default"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
