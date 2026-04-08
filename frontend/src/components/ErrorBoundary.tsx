import { Component, type ErrorInfo, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { getDevelopmentMode } from '../utils/config';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
  info?: ErrorInfo;
  isDevelopmentMode: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isDevelopmentMode: false };
  }

  async componentDidMount() {
    try {
      const isDevelopmentMode = await getDevelopmentMode();
      this.setState({ isDevelopmentMode });
    } catch {
      this.setState({ isDevelopmentMode: false });
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Frontend crash error:', error, info);
    this.setState({ info });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, info: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { error, info, isDevelopmentMode } = this.state;

      if (isDevelopmentMode) {
        // Mode développement : affiche tout le détail
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full bg-red-50 border-2 border-red-600 rounded-lg shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-red-600">❌ Erreur React (Développement)</h2>
                <button
                  onClick={this.handleReset}
                  className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-2">Message d'erreur :</p>
                  <p className="text-red-600 font-mono bg-red-100 p-3 rounded border border-red-300 break-words">
                    {error?.message || 'Erreur inconnue'}
                  </p>
                </div>

                {error?.stack && (
                  <div>
                    <p className="text-sm font-semibold text-red-700 mb-2">Stack trace :</p>
                    <pre className="text-xs text-red-600 font-mono bg-red-100 p-3 rounded border border-red-300 overflow-auto max-h-64 break-words whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                )}

                {info?.componentStack && (
                  <div>
                    <p className="text-sm font-semibold text-red-700 mb-2">React Stack :</p>
                    <pre className="text-xs text-red-600 font-mono bg-red-100 p-3 rounded border border-red-300 overflow-auto max-h-64 break-words whitespace-pre-wrap">
                      {info.componentStack}
                    </pre>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition font-medium"
                >
                  Recharger la page
                </button>
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        );
      } else {
        // Mode production : message générique minimal
        return (
          <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-100">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
              <h1 className="text-3xl font-bold mb-3 text-neutral-800">⚠️ Oups, un problème</h1>
              <p className="text-neutral-700 mb-6">
                L'application a rencontré une erreur inattendue. Veuillez recharger la page pour continuer.
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
    }

    return this.props.children;
  }
}

export default ErrorBoundary;