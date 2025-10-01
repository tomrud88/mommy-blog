"use client";

import React from "react";
import styles from "./ErrorBoundary.module.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h2 className={styles.errorTitle}>🔧 Ups! Coś poszło nie tak</h2>
            <p className={styles.errorDescription}>
              Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub wróć
              później.
            </p>
            <button
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Odśwież stronę
            </button>
            {process.env.NODE_ENV === "development" && (
              <details className={styles.errorDetails}>
                <summary>Szczegóły błędu (dev)</summary>
                <pre>{this.state.error?.stack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
