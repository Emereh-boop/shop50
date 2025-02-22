import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error and error info
    console.error("Error caught in ErrorBoundary:", error, errorInfo);

    // Update state with error details
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-800 border border-red-400 rounded">
          <h2 className="text-lg font-semibold">Something went wrong.</h2>
          {this.state.error && <p>{this.state.error.toString()}</p>}
          {this.state.errorInfo && (
            <details className="mt-2">
              <summary className="cursor-pointer">Click for more details</summary>
              <pre className="whitespace-pre-wrap text-sm">{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
