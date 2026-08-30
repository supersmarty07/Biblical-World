import { Component, type ErrorInfo, type ReactNode } from 'react';
import { atlasConfig } from '../config';

type State = { error?: Error };

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('The Biblical World runtime error', error, info);
  }

  private async resetSiteRuntime() {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.startsWith('biblical-world-')).map((key) => caches.delete(key)));
      }
    } finally {
      window.location.reload();
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    return <main className="fatal-screen" role="alert">
      <div className="fatal-screen__card">
        <span>THE BIBLICAL WORLD</span>
        <h1>The atlas could not finish starting.</h1>
        <p>The deployment loaded, but the application encountered a runtime error. Reload first; if a previous service-worker deployment is stale, reset the local runtime cache.</p>
        <details><summary>Technical details</summary><code>{this.state.error.message}</code><small>Build branch: {atlasConfig.deployBranch}</small></details>
        <div>
          <button type="button" onClick={() => window.location.reload()}>Reload</button>
          <button type="button" onClick={() => void this.resetSiteRuntime()}>Reset local cache & reload</button>
        </div>
      </div>
    </main>;
  }
}
