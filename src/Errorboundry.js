import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate that an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error to an external service like Sentry here
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error is caught
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>
            <summary>Click for more details</summary>
            <pre>{this.state.error && this.state.error.toString()}</pre>
            <pre>{this.state.errorInfo.componentStack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
