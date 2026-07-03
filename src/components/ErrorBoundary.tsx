import { Component, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Uncaught error:', error);
    console.error('Error info:', errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 rounded-full p-4 mb-6">
                <AlertTriangle className="w-12 h-12 text-red-800" aria-hidden="true" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Etwas ist schiefgelaufen
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Die Anwendung ist auf einen unerwarteten Fehler gestoßen.
                Bitte laden Sie die Seite neu, um fortzufahren.
              </p>

              {this.state.error && (
                <details className="mb-6 w-full text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                    Technische Details anzeigen
                  </summary>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-mono text-gray-700 break-all">
                      {this.state.error.message}
                    </p>
                  </div>
                </details>
              )}

              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
                Seite neu laden
              </button>

              <p className="text-xs text-gray-500 mt-6">
                Wenn das Problem weiterhin besteht, versuchen Sie es mit einer anderen Datei.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
