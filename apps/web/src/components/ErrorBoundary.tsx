import { Component, Fragment } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
  resetKey: number
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null, resetKey: 0 }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error, resetKey: 0 }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Stub pages intentionally throw. Suppress console noise for "Not implemented".
    if (!error.message.includes('Not implemented')) {
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
  }

  render(): ReactNode {
    const { error, resetKey } = this.state
    if (error !== null) {
      const isStub = error.message.includes('Not implemented')
      return (
        <div
          role="alert"
          style={{
            maxWidth: 480,
            margin: '80px auto',
            padding: '24px',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            background: '#fff',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>
            {isStub ? '🚧' : '⚠️'}
          </p>
          <h2 style={{ fontSize: '1.125rem', marginBottom: 8 }}>
            {isStub ? 'Not implemented yet' : 'Something went wrong'}
          </h2>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: 20 }}>
            {isStub
              ? 'This section is a candidate exercise stub.'
              : error.message}
          </p>
          <button
            onClick={() => this.setState((s) => ({ error: null, resetKey: s.resetKey + 1 }))}
            style={{
              padding: '8px 20px',
              cursor: 'pointer',
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    // Fragment key forces React to unmount/remount children when resetKey changes,
    // preventing the boundary from immediately re-catching the same error.
    return <Fragment key={resetKey}>{this.props.children}</Fragment>
  }
}
