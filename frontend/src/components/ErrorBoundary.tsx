import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Frontend crash error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-100">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-3 text-red-600">Une erreur est survenue</h1>
            <p className="text-neutral-700 mb-6">
              L'application a rencontré un problème inattendu. Veuillez recharger la page.
            </p>
            <button
              type="button"
              className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;