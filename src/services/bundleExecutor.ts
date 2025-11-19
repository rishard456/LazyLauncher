import * as FileSystem from 'expo-file-system/legacy';
import { StoredApp } from '../types';

export class BundleExecutor {
  /**
   * Generate a complete React app that runs in WebView
   * This creates a real React application with hooks, components, etc.
   */
  static generateReactApp(app: StoredApp, appCode: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${app.name}</title>

    <!-- Load React and ReactDOM from CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        html, body, #root {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background: #ffffff;
        }

        /* Native-like animations */
        .fade-in {
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .slide-up {
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useCallback, useRef, useMemo } = React;

        // LazyLauncher Native Bridge
        const LazyNative = {
            // Storage API
            storage: {
                setItem: async (key, value) => {
                    localStorage.setItem('${app.id}_' + key, JSON.stringify(value));
                    return true;
                },
                getItem: async (key) => {
                    const data = localStorage.getItem('${app.id}_' + key);
                    return data ? JSON.parse(data) : null;
                },
                removeItem: async (key) => {
                    localStorage.removeItem('${app.id}_' + key);
                    return true;
                },
                clear: async () => {
                    const keys = Object.keys(localStorage);
                    keys.forEach(key => {
                        if (key.startsWith('${app.id}_')) {
                            localStorage.removeItem(key);
                        }
                    });
                    return true;
                }
            },

            // App Info
            appInfo: {
                id: '${app.id}',
                name: '${app.name}',
                version: '${app.version}',
                isOffline: true,
                platform: 'LazyLauncher'
            },

            // Alert/Toast
            alert: (message) => {
                alert(message);
            },

            // Vibration (if supported)
            vibrate: (duration = 100) => {
                if (navigator.vibrate) {
                    navigator.vibrate(duration);
                }
            }
        };

        // Make LazyNative globally available
        window.LazyNative = LazyNative;

        // App Component Wrapper
        function AppContainer({ children }) {
            return (
                <div className="fade-in" style={{ width: '100%', height: '100%' }}>
                    {children}
                </div>
            );
        }

        // USER APP CODE STARTS HERE
        ${appCode}
        // USER APP CODE ENDS HERE

        // Render the app
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <AppContainer>
                <App />
            </AppContainer>
        );
    </script>
</body>
</html>
    `.trim();
  }

  /**
   * Generate a default app template for testing
   */
  static generateDefaultAppCode(app: StoredApp): string {
    return `
function App() {
    const [count, setCount] = useState(0);
    const [storedValue, setStoredValue] = useState(null);

    // Load stored value on mount
    useEffect(() => {
        LazyNative.storage.getItem('count').then(value => {
            if (value !== null) {
                setStoredValue(value);
                setCount(value);
            }
        });
    }, []);

    // Save to storage when count changes
    useEffect(() => {
        if (count > 0) {
            LazyNative.storage.setItem('count', count);
        }
    }, [count]);

    const handleIncrement = () => {
        setCount(prev => prev + 1);
        LazyNative.vibrate(50);
    };

    const handleReset = () => {
        setCount(0);
        LazyNative.storage.clear();
        LazyNative.alert('Counter reset!');
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '40px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>
                    ${app.icon}
                </div>

                <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
                    ${app.name}
                </h1>

                <p style={{ opacity: 0.8, marginBottom: '30px' }}>
                    ${app.description}
                </p>

                <div style={{
                    fontSize: '72px',
                    fontWeight: 'bold',
                    margin: '30px 0',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px'
                }}>
                    {count}
                </div>

                <button
                    onClick={handleIncrement}
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '18px',
                        fontWeight: '600',
                        background: 'white',
                        color: '#667eea',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        marginBottom: '10px',
                        transition: 'transform 0.1s',
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Tap to Count
                </button>

                <button
                    onClick={handleReset}
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '16px',
                        background: 'transparent',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'transform 0.1s',
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Reset
                </button>

                {storedValue !== null && (
                    <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>
                        Previous value: {storedValue}
                    </p>
                )}

                <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>Running on LazyLauncher</p>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>Version ${app.version}</p>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>Fully Offline • Persistent Storage</p>
                </div>
            </div>
        </div>
    );
}
    `.trim();
  }

  /**
   * Create a complete app package
   */
  static async createAppPackage(app: StoredApp, appCode?: string): Promise<string> {
    const code = appCode || this.generateDefaultAppCode(app);
    const htmlContent = this.generateReactApp(app, code);
    return htmlContent;
  }
}
